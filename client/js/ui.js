var graphics;
var ui = function() {
	var doLoad = function() {
		loadStage();
		
		graphics.doLoad(stage);
		
		loadConfig();
		initUI();
		initUIControls();
	};
	
	var doLoadCreator = function() {
		loadStage();
		graphics.doLoad(stage);
		loadConfig();
		initUI();
		initUIControls();
	};
	// CreateJS stage
	var stage;
	
	var loadStage = function() {
		stage = new createjs.Stage("gameCanvas");
		adjustStageSize();
		
		// Start the stage ticker.
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", stage);
		createjs.Ticker.addEventListener("tick", tickHandler);
		stage.update();
	};
	
	var adjustStageSize = function() {
		/*! GetDevicePixelRatio | Author: Tyson Matanich, 2012 | License: MIT */
		(function (window) {
			window.getDevicePixelRatio = function () {
				var ratio = 1;
				// To account for zoom, change to use deviceXDPI instead of systemXDPI
				if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
					// Only allow for values > 1
					ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
				}
				else if (window.devicePixelRatio !== undefined) {
					ratio = window.devicePixelRatio;
				}
				return ratio;
			};
		})(this);
		if (window.devicePixelRatio) {
			var canvas = document.getElementById("gameCanvas");
			// grab the width and height from canvas
			var height = canvas.getAttribute('height');
			var width = canvas.getAttribute('width');
			// reset the canvas width and height with window.devicePixelRatio applied
			canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));
			canvas.setAttribute('height', Math.round(height * window.devicePixelRatio));
			// force the canvas back to the original size using css
			canvas.style.width = width+"px";
			canvas.style.height = height+"px";
			// set CreateJS to render scaled
			stage.scaleX = stage.scaleY = window.devicePixelRatio;
			// set canvas context image smoothing
			canvas.getContext("2d").imageSmoothingQuality = "high";
		}
		stage.update();
	};
	
	var N, M;
	
	var loadConfig = function() {
		N = config.mapHeight;
		M = config.mapWidth;
	};

	var readOnly = false;
	
	// Map state
	var map = [];
	var mapSize;
	
	// Item states
	var items = [];
	var itemOnHead;
	
	// Player state
	var playerPos = 0;
	
	// Animation queue
	var animationQueue = [];
	
	// CreateJS map data
	var mapGridHeight;
	var mapGridWidth;
	var mapLeftPos;
	var mapTopPos;
	var mapSpriteSheets = {};
	var mapSprites = [];
	var mapTextSprites = [];
	var objectSpriteSheets = {};
	var playerSpriteSheet;
	var playerSprite = undefined;
	// We store player direction just for animation fluency.
	var playerDirection = 0;
	
	// Input/Output
	const IOItemsWidth = 50;
	const IOItemsHeight = 50;
	const IOItemsHorizontalGap = 20;
	const IOItemsLeftPos = 100;
	const inputTopPos = 0;
	const outputTopPos = 75;
	var inputItems = [];
	var outputItems = [];
	
	// For continuous-run function.
	var gameRunning = false;
	
	var initUI = function() {
		// Init map.
		mapSize = N * M;
		for (var i = 0; i < mapSize; i++) {
			map[i] = 0;
		}
		
		// Init player.
		playerPos = 0;
		
		// Init animation queue.
		animationQueue = [];
		
		// Init items.
		// Use clear items animation.
		// Animation queue must be initialized before this.
		clearItems();
		
		// Setup and render on CreateJS.
		mapLeftPos = 2;
		mapTopPos = 2 + 150;
		mapGridHeight = 546 / N;
		mapGridWidth = 546 / M;
		
		mapSpriteSheet = {};
		for (var i in config.UI.map.images) {
			mapSpriteSheets[i] = graphics.newSpriteSheet(config.UI.map.images[i]);
		}
		
		objectSpriteSheet = {};
		for (var i in config.UI.object.images) {
			objectSpriteSheets[i] = graphics.newSpriteSheet(config.UI.object.images[i]);
		}
		
		playerSpriteSheet = new createjs.SpriteSheet({
			images: [
				config.UI.player.images[0][0],
				config.UI.player.images[0][1],
				config.UI.player.images[1][0],
				config.UI.player.images[1][1],
				config.UI.player.images[2][0],
				config.UI.player.images[2][1],
				config.UI.player.images[3][0],
				config.UI.player.images[3][1],
			],
			frames: {
				width: config.UI.player.imageWidth,
				height: config.UI.player.imageHeight
			},
			framerate: 2,
			animations: {
				a0: [0, 1],
				a1: [2, 3],
				a2: [4, 5],
				a3: [6, 7]
			}
		});
		playerDirection = 0;
		
		// Draw I/O queue.
		(function() {
			var inputPos = getIOItemPos(-1.2, false);
			var outputPos = getIOItemPos(-1.2, true);
			var s1 = graphics.newSprite(mapSpriteSheets[1]);
			graphics.setSpritePos(s1, inputPos);
			var s2 = graphics.newSprite(mapSpriteSheets[2]);
			graphics.setSpritePos(s2, outputPos);
		})();
		
		// Init DOM elements.
		// For test only.
		$("#buttonUndo").click(function() {
			code.undo();
			$("#buttonRedo").attr("disabled", false);
		});
		$("#buttonRedo").click(function() {
			code.redo();
		});
		$("#buttonCompile").click(function() {
			logic.start();
			$("#buttonUndo").attr("disabled", true);
			$("#buttonRedo").attr("disabled", true);
			$("#buttonCompile").attr("disabled", true);
			$("#buttonRun").attr("disabled", false);
			$("#buttonRun").css("display", "");
			$("#buttonPause").css("display", "none");
			$("#buttonStep").attr("disabled", false);
			$("#buttonStop").attr("disabled", false);
		});
		$("#buttonRun").click(function() {
			$("#buttonRun").css("display", "none");
			$("#buttonPause").css("display", "");
			$("#buttonStep").attr("disabled", true);
			gameRunning = true;
		});
		$("#buttonPause").click(function() {
			$("#buttonRun").css("display", "");
			$("#buttonPause").css("display", "none");
			$("#buttonStep").attr("disabled", false);
			gameRunning = false;
		});
		$("#buttonStep").click(function() {
			if (!logic.step()) {
				$("#buttonStep").attr("disabled", true);
				$("#buttonRun").attr("disabled", true);
				$("#buttonRun").css("display", "");
				$("#buttonPause").css("display", "none");
			}
		});
		$("#buttonStop").click(function() {
			$("#buttonUndo").attr("disabled", false);
			$("#buttonRedo").attr("disabled", false);
			$("#buttonCompile").attr("disabled", false);
			$("#buttonRun").attr("disabled", true);
			$("#buttonRun").css("display", "");
			$("#buttonPause").css("display", "none");
			$("#buttonStep").attr("disabled", true);
			$("#buttonStop").attr("disabled", true);
			gameRunning = false;
			code.stop();
			animationQueue = [];
		});
		resetGameButtons();
	};

	var resetGameButtons = function() {
		$("#buttonUndo").attr("disabled", false);
		$("#buttonRedo").attr("disabled", true);
		$("#buttonCompile").attr("disabled", false);
		$("#buttonRun").attr("disabled", true);
		$("#buttonRun").css("display", "");
		$("#buttonPause").css("display", "none");
		$("#buttonStep").attr("disabled", true);
		$("#buttonStop").attr("disabled", true);
		gameRunning = false;
	}
	
	var initUIControls = function() {
		// TODO: Use "get user info" API to resolve this issue. (#50)
		// Force logout to prevent "you have already logged in" bug.
		logic.doLogout(function() {});
		
		// For login function.
		$("#loginButton").click(function() {
			$("#loginMethodModal").modal();
		});
		$("#defaultLoginButton").click(function() {
			$("#loginMethodModal").modal("hide");
			// Init login modal.
			$("#loginUsername").val("");
			$("#loginPassword").val("");
			
			$("#loginModal").modal();
		});
		$("#phoneLoginButton").click(function() {
			$("#loginMethodModal").modal("hide");
			// Init login modal.
			$("#loginPhoneNumber").val("");
			$("#loginIdentifyingCode").val("");
			
			$("#phoneLoginModal").modal();

		});
		$("#phoneLoginGetCodeButton").click(function() {
			$("#phoneLoginGetCodeButton").attr("disabled", "disabled");
			logic.doPhoneGetCode($("#loginPhoneNumber").val(), function(err, res) {
				$("#phoneLoginGetCodeButton").removeAttr("disabled");

				if (err != undefined) {
					alert("获取失败： " + err);
					return;
				}
				else {
					alert("已发送，请注意查收。");
					return;
				}
			});
		});
		$("#phoneLoginConfirmButton").click(function() {
			$("#phoneLoginConfirmButton").attr("disabled", "disabled");
			
			// Call logic login interface.
			logic.doPhoneLogin($("#loginPhoneNumber").val(), $("#loginIdentifyingCode").val(), function(err, res) {
				$("#phoneLoginConfirmButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("登录失败： " + err);
					$("#loginIdentifyingCode").val("");
					return;
				}
				
				// Login ok
				$("#phoneLoginModal").modal("hide");
				$("#loginButton").css("display", "none");
				$("#logoutButton").css("display", "");
				$("#registerButton").css("display", "none");
				$("#usernameSpanText").text(res.username);
				$("#usernameSpan").css("display", "");
			});
		});
		$("#loginSubmitButton").click(function() {
			$("#loginSubmitButton").attr("disabled", "disabled");
			
			// Call logic login interface.
			logic.doLogin($("#loginUsername").val(), $("#loginPassword").val(), function(err, res) {
				$("#loginSubmitButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("登录失败： " + err);
					$("#loginPassword").val("");
					return;
				}
				
				// Login ok
				$("#loginModal").modal("hide");
				$("#loginButton").css("display", "none");
				$("#changePasswordButton").css("display", "");
				$("#logoutButton").css("display", "");
				$("#registerButton").css("display", "none");
				$("#usernameSpanText").text(res.username);
				$("#usernameSpan").css("display", "");
			});
		});
		
		// For logout function.
		$("#logoutButton").click(function() {
			$("#logoutButton").attr("disabled", "disabled");
			
			// Call logic logout interface.
			logic.doLogout(function(err, res) {
				$("#logoutButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("登出失败： " + err);
					return;
				}
				
				// Logout ok
				$("#logoutButton").css("display", "none");
				$("#changePasswordButton").css("display", "none");
				$("#loginButton").css("display", "");
				$("#registerButton").css("display", "");
				$("#usernameSpanText").text("");
				$("#usernameSpan").css("display", "none");
			});
		});
		
		// For register function.
		$("#registerButton").click(function() {
			// Init register modal.
			$("#registerUsername").val("");
			$("#registerEmail").val("");
			$("#registerPassword").val("");
			$("#registerPassword2").val("");
			
			$("#registerModal").modal();
		});
		$("#registerSubmitButton").click(function() {
			$("#registerSubmitButton").attr("disabled", "disabled");
			
			// Call logic register interface.
			logic.doRegister($("#registerUsername").val(), $("#registerEmail").val(), $("#registerPassword").val(), $("#registerPassword2").val(), function(err, res) {
				$("#registerSubmitButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("注册失败： " + err);
					$("#registerPassword").val("");
					$("#registerPassword2").val("");
					return;
				}
				
				// Register ok
				alert("注册成功！");
				$("#registerModal").modal("hide");
			});
		});
		
		// For change password function.
		$("#changePasswordButton").click(function() {
			// Init changePassword modal.
			$("#changePasswordUsername").text($("#usernameSpanText").text());
			$("#changePasswordNewPassword").val("");
			$("#changePasswordNewPassword2").val("");
			
			$("#changePasswordModal").modal();
		});
		$("#changePasswordSubmitButton").click(function() {
			$("#changePasswordSubmitButton").attr("disabled", "disabled");
			
			// Call logic changePassword interface.
			logic.doChangePassword($("#changePasswordNewPassword").val(), $("#changePasswordNewPassword2").val(), function(err, res) {
				$("#changePasswordSubmitButton").removeAttr("disabled");
				
				if (err != undefined) {
					alert("修改失败： " + err);
					$("#changePasswordNewPassword").val("");
					$("#changePasswordNewPassword2").val("");
					return;
				}
				
				// Change password ok
				alert("修改成功！");
				$("#changePasswordModal").modal("hide");
			});
		});


		$("#newLevelButton").click(function() {
			// Init login modal.
			// $("#newLevelContent").val(logic.getUserContent);
			// $("#newLevelModal").modal();
			window.location.href = "creator.html";
		});
		$("#returnMainButton").click(function() {
			// Init login modal.
			// $("#newLevelContent").val(logic.getUserContent);
			// $("#newLevelModal").modal();
			window.location.href = "codechef.html";
		});
		$("#newLevelSubmitButton").click(function() {
			$("#newLevelSubmitButton").attr("disabled", "disabled");
			
			// Call logic login interface.
			logic.doNewLevel($("#newLevelContent").val(), function(err, res) {
				$("#newLevelSubmitButton").removeAttr("disabled");
				if (err != undefined) {
					alert("创建失败： " + err);
					return;
				}
				// Login ok
				$("#newLevelModal").modal("hide");
				logic.runNewLevel($("#newLevelContent").val());
			});
		});
		$("#saveLevelButton").click(function() {
			// Init login modal.
			logic.doSaveLevel(function(err, res) {
				if (err != undefined) {
					alert("保存失败： " + err);
					return;
				}
			});
		});
		$("#shareLevelButton").click(function() {
			// Init login modal.
			logic.doShareLevel(function(err, res) {
				if (err != undefined) {
					alert("分享失败： " + err);
					return;
				}
				alert("shared: " + 
						window.location.host +
						"/external_share_level?level_id=" + 
						res["level_id"]);
			});
		});
		$("#saveSolutionButton").click(function() {
			// Init login modal.
			logic.doSaveSolution(function(err, res) {
				if (err != undefined) {
					alert("解法保存失败： " + err);
					return;
				}
			});
		});
		$("#shareSolutionButton").click(function() {
			// Init login modal.
			logic.doShareSolution(function(err, res) {
				if (err != undefined) {
					alert("解法分享失败： " + err);
					return;
				}
				alert("shared: " + 
						window.location.host +
						"/external_share_level?level_id=" + 
						res["level_id"] +
						"&solution_id=" + 
						res["solution_id"]);
			});
		});
		$("#chooseLevelButton").click(function() {
			// Init login modal.
			logic.doGetLevelList(function(err, res) {
				if (err != undefined) {
					alert("查询失败： " + err);
					return;
				}
				var sharedList = res.sharedLevelList;
				$("#chooseLevelModal").modal();
				$("#chooseSharedLevelDiv").empty();
				var but = "";
				for (let i = 0; i < sharedList.length; i++)
				{
					var btn = '<button type="button" class="btn btn-primary" id="'
							+ 'chooseSharedLevelButtonId' + i
							+ '" value = "'
							+ sharedList[i]
							+ '"><span>'
							+ sharedList[i]
							+ '</span></button>&nbsp&nbsp';
					$("#chooseSharedLevelDiv").append(btn);
					btn = "#chooseSharedLevelButtonId" + i;
					$(btn).click(function() {
						var targetLevelId = $(this).attr("value");
						if (isNaN(targetLevelId)) alert("请输入正确的关卡编号");
						else logic.loadLevel(parseInt(targetLevelId));
						resetGameButtons();
						$("#chooseLevelModal").modal("hide");
					});
				}
				var defaultList = res.defaultLevelList;
				$("#chooseLevelModal").modal();
				$("#chooseDefaultLevelDiv").empty();
				var but = "";
				for (let i = 0; i < defaultList.length; i++)
				{
					var btn = '<button type="button" class="btn btn-primary" id="'
							+ 'chooseDefaultLevelButtonId' + i
							+ '" value = "'
							+ defaultList[i].default_level_id
							+ '"><span>'
							+ defaultList[i].default_level_id
							+ '</span></button>&nbsp&nbsp';
					$("#chooseDefaultLevelDiv").append(btn);
					btn = "#chooseDefaultLevelButtonId" + i;
					$(btn).click(function() {
						var targetLevelId = $(this).attr("value");
						if (isNaN(targetLevelId)) alert("请输入正确的关卡编号");
						else logic.loadLevel(parseInt(targetLevelId));
						resetGameButtons();
						$("#chooseLevelModal").modal("hide");
					});
				}
			});
		});
	};
	
	var startCreator = function()
	{
		logic.initCreator();
	}

	var start = function() {
		// Grab & start a new level.
		// The main loop is not present here, because the system event loop already does this.
		if ($("#defaultLevelIdSpan").text() === "{{defaultLevelId}}")
		{
			logic.loadLevel();
		}
		else
		{
			logic.loadLevel(parseInt($("#defaultLevelIdSpan").text()), function(){
				if ($("#defaultSolutionIdSpan").text() != "")
				{
					logic.loadSolution(parseInt($("#defaultSolutionIdSpan").text()), function(){
						readOnly = true;
						code.setAlwaysLock();
					});
				}
			});
		}
	};
	
	var animationRunning = false;
	
	var checkAnimationQueue = function() {
		// Handle unapplied animations.
		if (animationQueue.length > 0) {
			animationRunning = true;
			startAnimation(animationQueue.shift());
			return true;
		} else {
			return false;
		}
	}
	
	var idleTicks = 0;
	const MaxIdleTicks = 10;
	
	// Handle the ticks from Ticker.
	var tickHandler = function() {
		if (animationRunning == false) {
			if (checkAnimationQueue()) {
				idleTicks = 0;
			} else if (gameRunning == true && ++idleTicks >= MaxIdleTicks) {
				idleTicks = 0;
				if (!logic.step()) {
					$("#buttonStep").attr("disabled", true);
					$("#buttonRun").attr("disabled", true);
					$("#buttonRun").css("display", "");
					$("#buttonPause").css("display", "none");
					gameRunning = false;
				}
			}
		}
	};
	
	var setAnimationComplete = function() {
		animationRunning = false;
		checkAnimationQueue();
	};
	
	// getMapGridPos returns the position [graphics.pos] of grid (x, y) on the map.
	var getMapGridPos = function(x, y) {
		if (y == undefined) {
			y = (x - x % M) / M;
			x = x % M;
		}
		return {
			x: mapLeftPos + mapGridWidth * x,
			y: mapTopPos + mapGridHeight * (y + 1),
			len: mapGridWidth
		};
	};
	
	var getMapGridTextPos = function(x, y) {
		if (y == undefined) {
			y = (x - x % M) / M;
			x = x % M;
		}
		return {
			x: mapLeftPos + mapGridWidth * (x + 0.03),
			y: mapTopPos + mapGridHeight * (y + 0.99),
			len: 1.0  // Not to scale
		};
	};
	
	var loadMap = function(mapData) {
		if (!mapData || !mapData.length || mapData.length != mapSize) {
			throw "Invalid mapData";
		}
		
		for (var i = 0; i < mapSize; i++) {
			var x = mapData[i];
			if (isNaN(x)) throw "Invalid mapData[" + i + "]: " + x;
			map[i] = parseInt(x);
		}
		
		// Remove original mapSprites
		for (var i in mapSprites) {
			graphics.removeSprite(mapSprites[i]);
		}
		for (var i in mapTextSprites) {
			stage.removeChild(mapTextSprites[i]);
		}
		mapSprites = [];
		mapTextSprites = [];
		
		for (var i = 0; i < N; i++) {
			for (var j = 0; j < M; j++) {
				var id = i * M + j;
				var s = graphics.newSprite(mapSpriteSheets[0]);
				graphics.setSpritePos(s, getMapGridPos(j, i));
				mapSprites.push(s);
				
				s = graphics.newSprite(mapSpriteSheets[map[id]]);
				graphics.setSpritePos(s, getMapGridPos(j, i));
				mapSprites.push(s);
				
				var ts = graphics.newCustomSprite(new createjs.Text("", "15px Arial", "#00e077"), {
					x: 0.0,
					y: 15.0,
					len: 1.0  // Not to scale
				});
				graphics.setSpritePos(ts, getMapGridTextPos(j, i));
				mapTextSprites.push(ts);
			}
		}
		
		if (playerSprite != undefined) {
			graphics.removeSprite(playerSprite);
		}
		playerSprite = graphics.newCustomSprite(new createjs.Sprite(playerSpriteSheet), {
			x: 0,
			y: config.UI.player.imageHeight,
			len: config.UI.player.imageWidth
		});
		playerDirection = 0;
		graphics.getSprite(playerSprite).gotoAndPlay("a0");
	};
	
	var loadUserInfo = function(userInfo) {
		// TODO: implement this
	};
	
	var loadBlockInfo = function(blockInfo) {
		// TODO: implement this
	};
	
	// Common functions
	
	// Check for valid map position. Throws an error on invalid pos.
	// Returns: Integer type of pos.
	var checkValidMapPos = function(pos) {
		if (isNaN(pos)) {
			throw "Invalid pos " + pos;
		}
		pos = parseInt(pos);
		if (pos < 0 || pos >= mapSize) {
			throw "Invalid pos " + pos;
		}
		return pos;
	};
	
	// Check for valid item position. Throws an error on invalid pos.
	// Returns: Integer type of pos.
	var checkValidItemPos = function(pos) {
		if (isNaN(pos)) {
			throw "Invalid pos " + pos;
		}
		pos = parseInt(pos);
		if (pos < -1 || pos >= mapSize) {
			throw "Invalid pos " + pos;
		}
		return pos;
	}
	
	// Check for valid direction (0,1,2,3). Throws an error on invalid direction.
	// Returns: Integer type of dir.
	var checkValidDirection = function(dir) {
		if (isNaN(dir)) {
			throw "Invalid direction " + dir;
		}
		dir = parseInt(dir);
		if (dir < 0 || dir >= 4) {
			throw "Invalid direction " + dir;
		}
		return dir;
	};
	
	// Run an animation.
	var startAnimation = function(animation) {
		if (animation.type == "clearItems") {
			runClearItems(animation.args);
		} else if (animation.type == "newItem") {
			runNewItem(animation.args);
		} else if (animation.type == "addAnimation") {
			runAddAnimation(animation.args);
		} else if (animation.type == "addPlayerAnimation") {
			runAddPlayerAnimation(animation.args);
		} else if (animation.type == "deleteItem") {
			runDeleteItem(animation.args);
		} else if (animation.type == "setItemValue") {
			runSetItemValue(animation.args);
		} else if (animation.type == "setMapGridValue") {
			runSetMapGridValue(animation.args);
		} else if (animation.type == "setInput") {
			runSetInput(animation.args);
		} else if (animation.type == "setOutput") {
			runSetOutput(animation.args);
		} else if (animation.type == "alert") {
			runAlert(animation.args);
		} else {
			throw "Invalid animation " + animation.type;
		}
	};
	
	var removeItem = function(item) {
		graphics.removeSprite(item.sprite);
		graphics.removeSprite(item.textSprite);
	};
	
	var runClearItems = function(args) {
		for (var i = 0; i < mapSize; i++) {
			if (items[i] != undefined) {
				removeItem(items[i]);
			}
			items[i] = undefined;
		}
		if (itemOnHead != undefined) {
			removeItem(itemOnHead);
			itemOnHead = undefined;
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	var getItemGraphicsPosOnHead = function(pos) {
		var i = (pos - pos % M) / M;
		var j = pos % M;
		
		return {
			x: mapLeftPos + mapGridWidth * (j + 0.25),
			y: mapTopPos + mapGridHeight * (i - 0.2 + 0.5),
			len: mapGridWidth * 0.5
		};
	};
	
	var getItemGraphicsPos = function(pos) {
		if (pos == -1) {
			return getItemGraphicsPosOnHead(playerPos);
		}
		var i = (pos - pos % M) / M;
		var j = pos % M;
		
		return {
			x: mapLeftPos + mapGridWidth * (j + 0.17),
			y: mapTopPos + mapGridHeight * (i - 0.07 + 0.65),
			len: mapGridWidth * 0.65
		};
	};
	
	var getItemTextGraphicsPosOnHead = function(pos) {
		var ret = getItemGraphicsPosOnHead(pos);
		return {
			x: ret.x + mapGridWidth * 0.1,
			y: ret.y + mapGridHeight * (-0.5 + 0.39),  // 0.39 is 0.2 + 15/78
			len: 1.0
		};
	};
	
	var getItemTextGraphicsPos = function(pos) {
		if (pos == -1) {
			return getItemTextGraphicsPosOnHead(playerPos);
		}
		var ret = getItemGraphicsPos(pos);
		return {
			x: ret.x + mapGridWidth * 0.15,
			y: ret.y + mapGridHeight * (-0.65 + 0.44),  // 0.44 is 0.25 + 15/78
			len: 1.0
		};
	};
	
	// Set an item's pos (including its text)
	var setItemPos = function(item, pos) {
		graphics.setSpritePos(item.sprite, getItemGraphicsPos(pos));
		graphics.setSpritePos(item.textSprite, getItemTextGraphicsPos(pos));
	};
	
	var genNewItem = function(args) {
		var s = graphics.newSprite(objectSpriteSheets[args.type]);
		var ts = graphics.newCustomSprite(new createjs.Text(args.value == undefined ? "" : args.value + "", "15px Arial", "yellow"), {
			x: 0.0,
			y: 15.0,
			len: 1.0
		});
		return {
			type: args.type,
			value: args.value,
			args: args.args,
			sprite: s,
			textSprite: ts
		};
	};
	
	var runNewItem = function(args) {
		var pos = args.pos;
		if (pos == -1) {
			if (itemOnHead != undefined) {
				throw "There's already an item on head";
			}
			itemOnHead = genNewItem(args);
			setItemPos(itemOnHead, pos);
		} else {
			if (items[pos] != undefined) {
				throw "Invalid newItem on " + pos;
			}
			if (objectSpriteSheets[args.type] == undefined) {
				throw "Invalid newItem type " + type + " on pos " + pos;
			}
			items[pos] = genNewItem(args);
			setItemPos(items[pos], pos);
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	// Move an item to pos with animations
	var moveItem = function(item, pos, isOnHead = false, callback = function() {}) {
		var itemTrans, textTrans;
		if (isOnHead) {
			itemTrans = graphics.getSpriteTransformToPos(item.sprite, getItemGraphicsPosOnHead(pos));
			textTrans = graphics.getSpriteTransformToPos(item.textSprite, getItemTextGraphicsPosOnHead(pos));
		} else {
			itemTrans = graphics.getSpriteTransformToPos(item.sprite, getItemGraphicsPos(pos));
			textTrans = graphics.getSpriteTransformToPos(item.textSprite, getItemTextGraphicsPos(pos));
		}
		
		graphics.getTweenObject(item.sprite).to(itemTrans, 500, createjs.Ease.getPowInOut(3)).call(callback);
		graphics.getTweenObject(item.textSprite).to(textTrans, 500, createjs.Ease.getPowInOut(3));
	};
	
	var runAddAnimation = function(args) {
		var pos1 = args.pos1;
		var pos2 = args.pos2;
		if (pos1 == pos2) {
			setTimeout(setAnimationComplete, 0);
			return;
		}
		if (pos1 == -1 && itemOnHead == undefined) {
			throw "No item on head";
		}
		if (pos1 != -1 && items[pos1] == undefined) {
			throw "No such item on " + pos1;
		}
		if (pos2 == -1 && itemOnHead != undefined) {
			throw "There's already an item on head";
		}
		if (pos2 != -1 && items[pos2] != undefined) {
			throw "There's already an item on " + pos2;
		}
		var item;
		if (pos1 == -1) {
			item = itemOnHead;
			itemOnHead = undefined;
		} else {
			item = items[pos1];
			items[pos1] = undefined;
		}
		if (pos2 == -1) {
			itemOnHead = item;
		} else {
			items[pos2] = item;
		}
		moveItem(item, pos2, false, setAnimationComplete);
	};
	
	// Set player's pos
	var setPlayerPos = function(sprite, pos) {
		graphics.setSpritePos(sprite, getMapGridPos(pos));
	};
	
	// Move player's pos
	var movePlayerPos = function(sprite, pos) {
		return graphics.getTweenObject(sprite).to(
			graphics.getSpriteTransformToPos(sprite, getMapGridPos(pos)),
			500,
			createjs.Ease.getPowInOut(3)
		);
	};
	
	var runAddPlayerAnimation = function(args) {
		setPlayerPos(playerSprite, args.pos1);
		if (playerDirection != args.dir1) {
			graphics.getSprite(playerSprite).gotoAndPlay("a" + args.dir1);
			playerDirection = args.dir1;
		}
		
		// Move
		if (args.pos1 != args.pos2 && args.dir1 == args.dir2) {
			movePlayerPos(playerSprite, args.pos2).call(setAnimationComplete);
			if (itemOnHead != undefined) {
				moveItem(itemOnHead, args.pos2, true);
			}
		} else if (args.pos1 == args.pos2 && args.dir1 != args.dir2) {
			setTimeout(function() {
				setPlayerPos(playerSprite, args.pos2);
				graphics.getSprite(playerSprite).gotoAndPlay("a" + args.dir2);
				playerDirection = args.dir2;
			}, 250);
			setTimeout(setAnimationComplete, 500);
		} else if (args.pos1 == args.pos2 && args.dir1 == args.dir2) {
			setTimeout(setAnimationComplete, 0);
		} else {
			movePlayerPos(playerSprite, args.pos2);
			if (itemOnHead != undefined) {
				moveItem(itemOnHead, args.pos2, true);
			}
			setTimeout(function() {
				graphics.getSprite(playerSprite).gotoAndPlay("a" + args.dir2);
				playerDirection = args.dir2;
			}, 750);
			setTimeout(setAnimationComplete, msg.getMsgId("Succeeded"));
		}
		playerPos = args.pos2;
	};
	
	var runDeleteItem = function(args) {
		var pos = args.pos;
		if (pos == -1) {
			if (itemOnHead == undefined) {
				throw "No item on head";
			}
			removeItem(itemOnHead);
			itemOnHead = undefined;
		} else {
			if (items[pos] == undefined) {
				throw "No such item on " + pos;
			}
			removeItem(items[pos]);
			items[pos] = undefined;
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	var runSetItemValue = function(args) {
		var pos = args.pos;
		if (pos == -1) {
			if (itemOnHead == undefined) {
				throw "No item on head";
			}
			graphics.getSprite(itemOnHead.textSprite).text = args.value;
		} else {
			if (items[pos] == undefined) {
				throw "No such item on " + pos;
			}
			graphics.getSprite(items[pos].textSprite).text = args.value;
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	var runSetMapGridValue = function(args) {
		graphics.getSprite(mapTextSprites[args.pos]).text = args.value;
		
		setTimeout(setAnimationComplete, 0);
	};
	
	var getIOItemPos = function(itemIndex, isOutput = false) {
		return {
			x: IOItemsLeftPos + itemIndex * (IOItemsWidth + IOItemsHorizontalGap),
			y: IOItemsHeight + (isOutput ? outputTopPos : inputTopPos),
			len: IOItemsWidth
		};
	};
	
	var getIOItemTextPos = function(itemIndex, isOutput = false) {
		var pos = getIOItemPos(itemIndex, isOutput);
		return {
			x: pos.x + 0.2 * IOItemsWidth,
			y: pos.y + (-1.0 + 0.7) * IOItemsHeight,
			len: 1.0
		};
	};
	
	var setInputItemPos = function(item, pos) {
		graphics.setSpritePos(item.sprite, getIOItemPos(pos, false));
		graphics.setSpritePos(item.textSprite, getIOItemTextPos(pos, false));
	};
	
	var setOutputItemPos = function(item, pos) {
		graphics.setSpritePos(item.sprite, getIOItemPos(pos, true));
		graphics.setSpritePos(item.textSprite, getIOItemTextPos(pos, true));
	};
	
	var runSetInput = function(args) {
		for (let i in inputItems) {
			removeItem(inputItems[i]);
		}
		inputItems = [];
		
		for (let i in args.itemList) {
			let item = genNewItem(args.itemList[i]);
			setInputItemPos(item, inputItems.length);
			inputItems.push(item);
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	var runSetOutput = function(args) {
		for (let i in outputItems) {
			removeItem(outputItems[i]);
		}
		outputItems = [];
		
		for (let i in args.itemList) {
			let item = genNewItem(args.itemList[i]);
			setOutputItemPos(item, outputItems.length);
			outputItems.push(item);
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	var runAlert = function(args) {
		alert(args.text);
		setTimeout(setAnimationComplete, 0);
	};
	
	// Below are animation functions, i.e. functions that register animations for later rendering.
	
	var clearItems = function() {
		animationQueue.push({
			type: "clearItems"
		});
	};
	
	var newItem = function(pos, type, value = "", args) {
		pos = checkValidItemPos(pos);
		
		if (isNaN(type)) {
			throw "Invalid type";
		}
		type = parseInt(type);
		
		animationQueue.push({
			type: "newItem",
			args: {
				pos: pos,
				type: type,
				value: value,
				args: args
			}
		});
	};
	
	var deleteItem = function(pos, args) {
		pos = checkValidItemPos(pos);
		
		animationQueue.push({
			type: "deleteItem",
			args: {
				pos: pos
			}
		});
	};
	
	var setItemValue = function(pos, value) {
		pos = checkValidItemPos(pos);
		value = value == undefined ? "" : value + "";
		
		animationQueue.push({
			type: "setItemValue",
			args: {
				pos: pos,
				value: value
			}
		});
	};
	
	var addAnimation = function(pos1, pos2, args) {
		pos1 = checkValidItemPos(pos1);
		pos2 = checkValidItemPos(pos2);
		
		animationQueue.push({
			type: "addAnimation",
			args: {
				pos1: pos1,
				pos2: pos2,
				args: args
			}
		});
	};
	
	var addPlayerAnimation = function(pos1, pos2, dir1, dir2) {
		pos1 = checkValidMapPos(pos1);
		pos2 = checkValidMapPos(pos2);
		dir1 = checkValidDirection(dir1);
		dir2 = checkValidDirection(dir2);
		
		animationQueue.push({
			type: "addPlayerAnimation",
			args: {
				pos1: pos1,
				pos2: pos2,
				dir1: dir1,
				dir2: dir2
			}
		});
	};
	
	var setMapGridValue = function(pos, value) {
		pos = checkValidMapPos(pos);
		value = value == undefined ? "" : value + "";
		
		animationQueue.push({
			type: "setMapGridValue",
			args: {
				pos: pos,
				value: value
			}
		});
	};
	
	var deepCopyItemList = function(itemList) {
		var ret = [];
		for (var i in itemList) {
			var item = itemList[i];
			ret[i] = {
				type: item.type,
				value: item.value
			};
		}
		return ret;
	};
	
	var setInput = function(itemList) {
		if (!itemList || itemList.length == undefined) {
			throw "invalid item list";
		}
		
		animationQueue.push({
			type: "setInput",
			args: {
				itemList: deepCopyItemList(itemList)
			}
		});
	};
	
	var setOutput = function(itemList) {
		if (!itemList || itemList.length == undefined) {
			throw "invalid item list";
		}
		
		animationQueue.push({
			type: "setOutput",
			args: {
				itemList: deepCopyItemList(itemList)
			}
		});
	};

	var blockStep = function(s) {
		$("#buttonStep").attr("disabled", true);
		$("#buttonRun").attr("disabled", true);
		$("#buttonRun").css("display", "");
		$("#buttonPause").css("display", "none");
		gameRunning = false;
		
		animationQueue.push({
			type: "alert",
			args: {
				text: s
			}
		});
	};

	var finishLevel = function() {
		if (!readOnly) $("#passLevelModal").modal();
	};
	
	var unfinishLevel = function() {
		animationQueue.push({
			type: "alert",
			args: {
				text: "Unfinished."
			}
		});
	};

	var debug = function() {
		console.log(animationRunning);
		console.log(animationQueue);
	};
	
	return {
		doLoad: doLoad,
		doLoadCreator: doLoadCreator,
		start: start,
		startCreator: startCreator,
		loadMap: loadMap,
		loadUserInfo: loadUserInfo,
		loadBlockInfo: loadBlockInfo,
		clearItems: clearItems,
		newItem: newItem,
		deleteItem: deleteItem,
		setItemValue: setItemValue,
		addAnimation: addAnimation,
		addPlayerAnimation: addPlayerAnimation,
		setMapGridValue: setMapGridValue,
		setInput: setInput,
		setOutput: setOutput,
		blockStep: blockStep,
		finishLevel: finishLevel,
		unfinishLevel: unfinishLevel,
		debug: debug
	};
}();
