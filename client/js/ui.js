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
		
		// Clear alert masks (if exists).
		clearAlert();
		// Add alert listener.
		stage.addEventListener("click", function(event) {
			clearAlert();
		});
		
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
			clearAlert();
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
		user.initButtons();
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
			if (!logic.checkCreator())
			{
				alert("关卡不合法");
				return;
			}
			// Init login modal.
			$("#saveLevelButton").attr("disabled", "disabled");
			logic.doSaveLevel(function(err, res) {
				$("#saveLevelButton").removeAttr("disabled");
				if (err != undefined) {
					alert("保存失败： " + err);
					return;
				}
			});
		});
		$("#shareLevelButton").click(function() {
			// Init login modal.
			$("#shareLevelButton").attr("disabled", "disabled");
			logic.doShareLevel(function(err, res) {
				$("#shareLevelButton").removeAttr("disabled");
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
		$("#shareLevelButtonExtra").click(function() {
			// Init login modal.
			$("#shareLevelButtonExtra").attr("disabled", "disabled");
			logic.doShareLevel(function(err, res) {
				$("#shareLevelButtonExtra").removeAttr("disabled");
				if (err != undefined) {
					alert("分享失败： " + err);
					return;
				}
				alert("shared: " + 
						window.location.host +
						"/external_share_level?level_id=" + 
						res["level_id"]);
				$("#shareLevelButtonExtra").css("display", "none");
			});
		});
		$("#saveSolutionButton").click(function() {
			// Init login modal.
			$("#saveSolutionButton").attr("disabled", "disabled");
			logic.doSaveSolution(function(err, res) {
				$("#saveSolutionButton").removeAttr("disabled");
				if (err != undefined) {
					alert("解法保存失败： " + err);
					return;
				}
			});
		});
		$("#shareSolutionButton").click(function() {
			// Init login modal.
			$("#shareSolutionButton").attr("disabled", "disabled");
			logic.doShareSolution(function(err, res) {
				$("#shareSolutionButton").removeAttr("disabled");
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
		$("#nextLevelButton").click(function() {
			$("#passLevelModal").modal("hide");
			start();
		});
		$("#chooseLevelButton").click(function() {
			// Init login modal.
			logic.doGetLevelList(function(err, res) {
				if (err != undefined) {
					alert("查询失败： " + err);
					return;
				}
				$("#chooseLevelModal").modal();
				
				var privateList = res.privateLevelList;
				$("#choosePrivateLevelDiv").empty();
				var but = "";
				for (let i = 0; i < privateList.length; i++)
				{
					var btn = '<button type="button" class="btn btn-primary" id="'
							+ 'choosePrivateLevelButtonId' + i
							+ '" value = "'
							+ privateList[i]
							+ '"><span class="glyphicon glyphicon-star-empty">'
							+ privateList[i]
							+ '</span></button>&nbsp&nbsp';
					$("#choosePrivateLevelDiv").append(btn);
					btn = "#choosePrivateLevelButtonId" + i;
					$(btn).click(function() {
						var targetLevelId = $(this).attr("value");
						if (isNaN(targetLevelId)) alert("请输入正确的关卡编号");
						else logic.loadLevel(parseInt(targetLevelId));
						resetGameButtons();
						$("#chooseLevelModal").modal("hide");
						$("#shareLevelButtonExtra").css("display", "");
					});
				}
				var sharedList = res.sharedLevelList;
				$("#chooseSharedLevelDiv").empty();
				var but = "";
				for (let i = 0; i < sharedList.length; i++)
				{
					var btn = '<button type="button" class="btn btn-primary" id="'
							+ 'chooseSharedLevelButtonId' + i
							+ '" value = "'
							+ sharedList[i]
							+ '"><span class="glyphicon glyphicon-star">'
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
						$("#shareLevelButtonExtra").css("display", "none");
					});
				}
				var defaultList = res.defaultLevelList;
				$("#chooseDefaultLevelDiv").empty();
				var but = "";
				for (let i = 0; i < defaultList.length; i++)
				{
					var levelicon = "";
					if (defaultList[i].status == 0) levelicon = 'class="glyphicon glyphicon-remove"';
					if (defaultList[i].status == 1) levelicon = 'class="glyphicon glyphicon-lock"';
					if (defaultList[i].status == 2) levelicon = 'class="glyphicon glyphicon-ok"';
				
					var btn = '<button type="button" class="btn btn-primary" id="'
							+ 'chooseDefaultLevelButtonId' + i
							+ '" value = "'
							+ defaultList[i].default_level_id
							+ '"><span '
							+ levelicon
							+ '>'
							+ defaultList[i].default_level_id
							+ '</span></button>&nbsp&nbsp';
					$("#chooseDefaultLevelDiv").append(btn);
					btn = "#chooseDefaultLevelButtonId" + i;
					if (i >= res.nextDefaultLevel) $(btn).attr("disabled", true);
					$(btn).click(function() {
						var targetLevelId = $(this).attr("value");
						if (isNaN(targetLevelId))
							alert("请输入正确的关卡编号");
						else
						{
							logic.setOfflineLevel(parseInt(targetLevelId));
							logic.loadDefaultLevel(parseInt(targetLevelId));
						}
						resetGameButtons();
						$("#chooseLevelModal").modal("hide");
						$("#shareLevelButtonExtra").css("display", "none");
					});
				}
			});
		});


		$("#buttonPushInput").click(function() {
			logic.pushInput($("#textPushInput").val());
			$("#textPushInput").val("");
		});
		$("#buttonPopInput").click(function() {
			logic.popInput();
		});
		$("#buttonClearInput").click(function() {
			logic.clearInput();
		});

		$("#buttonPushOutput").click(function() {
			logic.pushOutput($("#textPushOutput").val());
			$("#textPushOutput").val("");
		});
		$("#buttonPopOutput").click(function() {
			logic.popOutput();
		});
		$("#buttonClearOutput").click(function() {
			logic.clearOutput();
		});

		$("#buttonSetFloor").click(function() {
			var index = $("#textSetFloor").val();
			var pos = 0;
			if (index != "" && !isNaN(index))
			{
				pos = parseInt(index);
				if (0 <= pos && pos < config.mapWidth * config.mapHeight)
					logic.newFloor(pos);
			}
			$("#textSetFloor").val("");
		});
		$("#buttonSetInbox").click(function() {
			var index = $("#textSetInbox").val();
			var pos = 0;
			if (index != "" && !isNaN(index))
			{
				pos = parseInt(index);
				if (0 <= pos && pos < config.mapWidth * config.mapHeight)
					logic.setInbox(pos);
			}
			$("#textSetInbox").val("");
		});
		$("#buttonSetOutbox").click(function() {
			var index = $("#textSetOutbox").val();
			var pos = 0;
			if (index != "" && !isNaN(index))
			{
				pos = parseInt(index);
				if (0 <= pos && pos < config.mapWidth * config.mapHeight)
					logic.setOutbox(pos);
			}
			$("#textSetOutbox").val("");
		});
		$("#buttonErase").click(function() {
			var index = $("#textErase").val();
			var pos = 0;
			if (index != "" && !isNaN(index))
			{
				pos = parseInt(index);
				if (0 <= pos && pos < config.mapWidth * config.mapHeight)
					logic.erase(pos);
			}
			$("#textErase").val("");
		});
		$("#buttonSetItem").click(function() {
			var index1 = $("#textSetItemPos").val();
			var index2 = $("#textSetItemValue").val();
			var pos = 0;
			var value = 0;
			if (index1 == "" || isNaN(index1))
				return undefined;
			if (index2 == "" || isNaN(index2))
				return undefined;
			pos = parseInt(index1);
			value = parseInt(index2);
			if (pos < 0 || pos >= config.mapWidth * config.mapHeight)
				return undefined;
			logic.newItem({type: 1, pos: pos, value: value});
			$("#textSetItemPos").val("");
			$("#textSetItemValue").val("");
		});
		$("#buttonSetDescription").click(function() {
			var index = $("#textSetDescription").val();
			logic.setDescription(index);
		});
		
	};
	
	var startCreator = function()
	{
		logic.initCreator();
	}

	var start = function() {
		resetGameButtons();
		// Grab & start a new level.
		// The main loop is not present here, because the system event loop already does this.
		if ($("#defaultLevelIdSpan").text() === "{{defaultLevelId}}")
		{
			logic.getNextDefaultLevel({}, function(err, res) {
				if (err != undefined) {
					logic.loadDefaultLevel(1);
					return;
				}
				logic.loadDefaultLevel(res.nextDefaultLevel);
			});
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
	
	// For alert function.
	var alertMask = undefined;
	var alertTextBackground = undefined;
	var alertText = undefined;
	
	var clearAlert = function() {
		if (alertMask != undefined) {
			stage.removeChild(alertMask);
			stage.removeChild(alertTextBackground);
			stage.removeChild(alertText);
			alertMask = undefined;
			alertTextBackground = undefined;
			alertText = undefined;
			setTimeout(setAnimationComplete, 0);
		}
	};
	
	var setupAlert = function(text) {
		var maskGraphics = new createjs.Graphics().beginFill("#000000").drawCircle(0, 0, 1e9);
		alertMask = stage.addChild(new createjs.Shape()).set({graphics: maskGraphics, x: 0, y: 0, alpha: 0.1});
		
		const TextWidth = 300;
		const TextHeight = 150;
		const StageWidth = 550;
		const StageHeight = 700;
		var textbgGraphics = new createjs.Graphics().beginFill("#ffffff")
			.drawRoundRect(
				0, 0,
				TextWidth, TextHeight,
				20, 20, 20, 20
			);
		alertTextBackground = stage.addChild(new createjs.Shape()).set({
			graphics: textbgGraphics,
			x: (StageWidth - TextWidth) / 2,
			y: (StageHeight - TextHeight) / 2,
			alpha: 0.85
		});
		
		alertText = stage.addChild(new createjs.Text(text, "20px Arial", "#660077"));
		alertText.textAlign = "center";
		alertText.lineWidth = TextWidth;
		alertText.lineHeight = TextHeight;
		alertText.x = StageWidth / 2;
		alertText.y = (StageHeight - 20) / 2;
	};
	
	var runAlert = function(args) {
		setupAlert(args.text);
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
		if (!readOnly)
		{
			starEvaluationRes = logic.doStarEvaluation();
			$("#starEvaluationUsedNum").text(starEvaluationRes["used_num"]);
			$("#starEvaluationBestNum").text(starEvaluationRes["best_num"]);
			$("#starEvaluationResult").text(starEvaluationRes["result"]);
			$("#passLevelModal").modal();
		}
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

	var setLevelId = function(level_id)
	{
		$("#currentLevelSpan").text("用户关卡：第" + level_id + "关")
	};
	
	var setDefaultLevelId = function(default_level_id)
	{
		$("#currentLevelSpan").text("默认关卡：第" + default_level_id + "关")	
	};

	var setDescription = function(index)
	{
	}
	
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
		debug: debug,
		setLevelId: setLevelId,
		setDefaultLevelId: setDefaultLevelId,
		setDescription: setDescription,
	};
}();
