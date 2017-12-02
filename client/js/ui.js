var graphics;
var createjs;
var code;
var logic;
var user;
var msg;
var ui = function() {
	// loadStage function
	var loadStage;
	
	// CreateJS stage
	var stage;
	
	// loadConfig function
	var loadConfig;
	
	// initUI fuction
	var initUI;
	
	// initUIControls function
	var initUIControls;
	
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
	
	// adjustStageSize function
	var adjustStageSize;
	
	// tickHandler function
	var tickHandler;
	
	loadStage = function() {
		stage = new createjs.Stage("gameCanvas");
		adjustStageSize();
		
		// Start the stage ticker.
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", stage);
		createjs.Ticker.addEventListener("tick", tickHandler);
		stage.update();
	};
	
	adjustStageSize = function() {
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
	
	loadConfig = function() {
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
	const IOItemsWidth = 50 * 1.2;
	const IOItemsHeight = 50;
	const IOItemsHorizontalGap = 20;
	const IOItemsLeftPos = 100 * 1.2;
	const inputTopPos = 20 + 100 + 45;
	const outputTopPos = 75 + 20 + 100 + 30;
	var inputItems = [];
	var outputItems = [];
	
	// For continuous-run function.
	var gameRunning = false;
	
	// For level description.
	var levelDescriptionBox = undefined;
	var levelDescriptionText = undefined;
	
	// clearAlert function
	var clearAlert;
	
	initUI = function() {
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
		stage.addEventListener("click", function() {
			clearAlert();
		});
		
		// Init level description.
		// Only run this the first time.
		if (levelDescriptionBox == undefined) {
			const TextWidth = 530;
			const TextHeight = 140;
			const StageWidth = 550;
			const StageHeight = 160;
			var textbgGraphics = new createjs.Graphics().beginFill("#e8f3f3")
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
			
			levelDescriptionText = stage.addChild(new createjs.Text("test", "20px Arial", "#222200"));
			levelDescriptionText.textAlign = "center";
			levelDescriptionText.lineWidth = TextWidth;
			levelDescriptionText.maxWidth = TextWidth;
			levelDescriptionText.lineHeight = 25;
			levelDescriptionText.x = StageWidth / 2;
			levelDescriptionText.y = (StageHeight - 20) / 2;
		}
		
		// Init items.
		// Use clear items animation.
		// Animation queue must be initialized before this.
		clearItems();
		
		// Setup and render on CreateJS.
		mapLeftPos = 2;
		mapTopPos = 2 + 150 + 160;
		mapGridHeight = 546 * 0.707 / N;
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
				config.UI.player.images.front,
				config.UI.player.images.right,
				config.UI.player.images.back,
				config.UI.player.images.left,
				config.UI.player.images.front_item,
				config.UI.player.images.right_item,
				config.UI.player.images.back_item,
				config.UI.player.images.left_item,
				
				config.UI.player.images.pick_item_front[0],
				config.UI.player.images.pick_item_front[1],
				config.UI.player.images.pick_item_front[2],
				config.UI.player.images.pick_item_front[3],
				
				config.UI.player.images.pick_item_right[0],
				config.UI.player.images.pick_item_right[1],
				config.UI.player.images.pick_item_right[2],
				config.UI.player.images.pick_item_right[3],
				
				config.UI.player.images.pick_item_back[0],
				config.UI.player.images.pick_item_back[1],
				config.UI.player.images.pick_item_back[2],
				config.UI.player.images.pick_item_back[3],
				
				config.UI.player.images.pick_item_left[0],
				config.UI.player.images.pick_item_left[1],
				config.UI.player.images.pick_item_left[2],
				config.UI.player.images.pick_item_left[3],
				
				// 24, walk front
				config.UI.player.images.walk_front[0],
				config.UI.player.images.walk_front[1],
				config.UI.player.images.walk_front[2],
				config.UI.player.images.walk_front[3],
				config.UI.player.images.walk_front[4],
				config.UI.player.images.walk_front[5],
				config.UI.player.images.walk_front[6],
				config.UI.player.images.walk_front[7],
				config.UI.player.images.walk_front[8],
				
				// 33, walk right
				config.UI.player.images.walk_right[0],
				config.UI.player.images.walk_right[1],
				config.UI.player.images.walk_right[2],
				config.UI.player.images.walk_right[3],
				config.UI.player.images.walk_right[4],
				config.UI.player.images.walk_right[5],
				config.UI.player.images.walk_right[6],
				config.UI.player.images.walk_right[7],
				
				// 41, walk back
				config.UI.player.images.walk_back[0],
				config.UI.player.images.walk_back[1],
				config.UI.player.images.walk_back[2],
				config.UI.player.images.walk_back[3],
				config.UI.player.images.walk_back[4],
				config.UI.player.images.walk_back[5],
				config.UI.player.images.walk_back[6],
				config.UI.player.images.walk_back[7],
				config.UI.player.images.walk_back[8],
				
				// 50, walk left
				config.UI.player.images.walk_left[0],
				config.UI.player.images.walk_left[1],
				config.UI.player.images.walk_left[2],
				config.UI.player.images.walk_left[3],
				config.UI.player.images.walk_left[4],
				config.UI.player.images.walk_left[5],
				config.UI.player.images.walk_left[6],
				config.UI.player.images.walk_left[7],
				
				
				// 58, walk item front
				config.UI.player.images.walk_item_front[0],
				config.UI.player.images.walk_item_front[1],
				config.UI.player.images.walk_item_front[2],
				config.UI.player.images.walk_item_front[3],
				config.UI.player.images.walk_item_front[4],
				config.UI.player.images.walk_item_front[5],
				config.UI.player.images.walk_item_front[6],
				config.UI.player.images.walk_item_front[7],
				
				// 66, walk item right
				config.UI.player.images.walk_item_right[0],
				config.UI.player.images.walk_item_right[1],
				config.UI.player.images.walk_item_right[2],
				config.UI.player.images.walk_item_right[3],
				config.UI.player.images.walk_item_right[4],
				config.UI.player.images.walk_item_right[5],
				config.UI.player.images.walk_item_right[6],
				config.UI.player.images.walk_item_right[7],
				
				// 74, walk item back
				config.UI.player.images.walk_item_back[0],
				config.UI.player.images.walk_item_back[1],
				config.UI.player.images.walk_item_back[2],
				config.UI.player.images.walk_item_back[3],
				config.UI.player.images.walk_item_back[4],
				config.UI.player.images.walk_item_back[5],
				config.UI.player.images.walk_item_back[6],
				config.UI.player.images.walk_item_back[7],
				config.UI.player.images.walk_item_back[8],
				
				// 83, walk item left
				config.UI.player.images.walk_item_left[0],
				config.UI.player.images.walk_item_left[1],
				config.UI.player.images.walk_item_left[2],
				config.UI.player.images.walk_item_left[3],
				config.UI.player.images.walk_item_left[4],
				config.UI.player.images.walk_item_left[5],
				config.UI.player.images.walk_item_left[6],
				config.UI.player.images.walk_item_left[7],
				
			],
			frames: [
				[0, 0, 380, 810, 0, -380],
				[0, 0, 380, 810, 1, -380],
				[0, 0, 380, 810, 2, -380],
				[0, 0, 380, 810, 3, -380],
				[0, 0, 760, 810, 4, -190],
				[0, 0, 760, 810, 5, -380],
				[0, 0, 760, 810, 6, -190],
				[0, 0, 760, 810, 7, 0],
				
				// 8, pick
				[0, 0, 760, 810, 8, -190],
				[0, 0, 760, 810, 9, -190],
				[0, 0, 760, 810, 10, -190],
				[0, 0, 760, 810, 11, -190],
				
				[0, 0, 760, 810, 12, -380],
				[0, 0, 760, 810, 13, -380],
				[0, 0, 760, 810, 14, -380],
				[0, 0, 760, 810, 15, -380],
				
				[0, 0, 760, 810, 16, -190],
				[0, 0, 760, 810, 17, -190],
				[0, 0, 760, 810, 18, -190],
				[0, 0, 760, 810, 19, -190],
				
				[0, 0, 760, 810, 20, 0],
				[0, 0, 760, 810, 21, 0],
				[0, 0, 760, 810, 22, 0],
				[0, 0, 760, 810, 23, 0],
				
				// 24, drop
				[0, 0, 760, 810, 11, -190],
				[0, 0, 760, 810, 10, -190],
				[0, 0, 760, 810, 9, -190],
				[0, 0, 760, 810, 8, -190],
				
				[0, 0, 760, 810, 15, -380],
				[0, 0, 760, 810, 14, -380],
				[0, 0, 760, 810, 13, -380],
				[0, 0, 760, 810, 12, -380],
				
				[0, 0, 760, 810, 19, -190],
				[0, 0, 760, 810, 18, -190],
				[0, 0, 760, 810, 17, -190],
				[0, 0, 760, 810, 16, -190],
				
				[0, 0, 760, 810, 23, 0],
				[0, 0, 760, 810, 22, 0],
				[0, 0, 760, 810, 21, 0],
				[0, 0, 760, 810, 20, 0],
				
				// 40, walk front
				[0, 0, 760, 810, 24, -190],
				[0, 0, 760, 810, 25, -190],
				[0, 0, 760, 810, 26, -190],
				[0, 0, 760, 810, 27, -190],
				[0, 0, 760, 810, 28, -190],
				[0, 0, 760, 810, 29, -190],
				[0, 0, 760, 810, 30, -190],
				[0, 0, 760, 810, 31, -190],
				[0, 0, 760, 810, 32, -190],
				
				// 49, walk right
				[0, 0, 760, 810, 33, -380],
				[0, 0, 760, 810, 34, -380],
				[0, 0, 760, 810, 35, -380],
				[0, 0, 760, 810, 36, -380],
				[0, 0, 760, 810, 37, -380],
				[0, 0, 760, 810, 38, -380],
				[0, 0, 760, 810, 39, -380],
				[0, 0, 760, 810, 40, -380],
				
				// 57, walk back
				[0, 0, 760, 810, 41, -190],
				[0, 0, 760, 810, 42, -190],
				[0, 0, 760, 810, 43, -190],
				[0, 0, 760, 810, 44, -190],
				[0, 0, 760, 810, 45, -190],
				[0, 0, 760, 810, 46, -190],
				[0, 0, 760, 810, 47, -190],
				[0, 0, 760, 810, 48, -190],
				[0, 0, 760, 810, 49, -190],
				
				// 66, walk left
				[0, 0, 760, 810, 50, 0],
				[0, 0, 760, 810, 51, 0],
				[0, 0, 760, 810, 52, 0],
				[0, 0, 760, 810, 53, 0],
				[0, 0, 760, 810, 54, 0],
				[0, 0, 760, 810, 55, 0],
				[0, 0, 760, 810, 56, 0],
				[0, 0, 760, 810, 57, 0],
				
				// 74, walk item front
				[0, 0, 760, 810, 58, -190],
				[0, 0, 760, 810, 59, -190],
				[0, 0, 760, 810, 60, -190],
				[0, 0, 760, 810, 61, -190],
				[0, 0, 760, 810, 62, -190],
				[0, 0, 760, 810, 63, -190],
				[0, 0, 760, 810, 64, -190],
				[0, 0, 760, 810, 65, -190],
				
				// 82, walk item right
				[0, 0, 760, 810, 66, -380],
				[0, 0, 760, 810, 67, -380],
				[0, 0, 760, 810, 68, -380],
				[0, 0, 760, 810, 69, -380],
				[0, 0, 760, 810, 70, -380],
				[0, 0, 760, 810, 71, -380],
				[0, 0, 760, 810, 72, -380],
				[0, 0, 760, 810, 73, -380],
				
				// 90, walk item back
				[0, 0, 760, 810, 74, -190],
				[0, 0, 760, 810, 75, -190],
				[0, 0, 760, 810, 76, -190],
				[0, 0, 760, 810, 77, -190],
				[0, 0, 760, 810, 78, -190],
				[0, 0, 760, 810, 79, -190],
				[0, 0, 760, 810, 80, -190],
				[0, 0, 760, 810, 81, -190],
				[0, 0, 760, 810, 82, -190],
				
				// 99, walk item left
				[0, 0, 760, 810, 83, 0],
				[0, 0, 760, 810, 84, 0],
				[0, 0, 760, 810, 85, 0],
				[0, 0, 760, 810, 86, 0],
				[0, 0, 760, 810, 87, 0],
				[0, 0, 760, 810, 88, 0],
				[0, 0, 760, 810, 89, 0],
				[0, 0, 760, 810, 90, 0],
				
				
			],
			framerate: 6,
			animations: {
				a0: [0],
				a1: [1],
				a2: [2],
				a3: [3],
				
				i0: [4],
				i1: [5],
				i2: [6],
				i3: [7],
				
				pick0: [8,11,"i0"],
				pick1: [12,15,"i1"],
				pick2: [16,19,"i2"],
				pick3: [20,23,"i3"],
				
				drop0: [24,27,"a0"],
				drop1: [28,31,"a1"],
				drop2: [32,35,"a2"],
				drop3: [36,39,"a3"],
				
				walk0: [40,48,"walk0",2],
				walk1: [49,56,"walk1",2],
				walk2: [57,65,"walk2",2],
				walk3: [66,73,"walk3",2],
				
				walki0: [74,81,"walki0",2],
				walki1: [82,89,"walki1",2],
				walki2: [90,98,"walki2",2],
				walki3: [99,106,"walki3",2],
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
	
	initUIControls = function() {
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
				var privateButtonFunc = function() {
					var targetLevelId = $(this).attr("value");
					if (isNaN(targetLevelId)) alert("请输入正确的关卡编号");
					else logic.loadLevel(parseInt(targetLevelId));
					resetGameButtons();
					$("#chooseLevelModal").modal("hide");
					$("#shareLevelButtonExtra").css("display", "");
				};
				for (let i = 0; i < privateList.length; i++)
				{
					let btn = '<button type="button" class="btn btn-primary" id="'
							+ 'choosePrivateLevelButtonId' + i
							+ '" value = "'
							+ privateList[i]
							+ '"><span class="glyphicon glyphicon-star-empty">'
							+ privateList[i]
							+ '</span></button>&nbsp&nbsp';
					$("#choosePrivateLevelDiv").append(btn);
					btn = "#choosePrivateLevelButtonId" + i;
					$(btn).click(privateButtonFunc);
				}
				var sharedList = res.sharedLevelList;
				$("#chooseSharedLevelDiv").empty();
				var sharedButtonFunc = function() {
					var targetLevelId = $(this).attr("value");
					if (isNaN(targetLevelId)) alert("请输入正确的关卡编号");
					else logic.loadLevel(parseInt(targetLevelId));
					resetGameButtons();
					$("#chooseLevelModal").modal("hide");
					$("#shareLevelButtonExtra").css("display", "none");
				};
				for (let i = 0; i < sharedList.length; i++)
				{
					let btn = '<button type="button" class="btn btn-primary" id="'
							+ 'chooseSharedLevelButtonId' + i
							+ '" value = "'
							+ sharedList[i]
							+ '"><span class="glyphicon glyphicon-star">'
							+ sharedList[i]
							+ '</span></button>&nbsp&nbsp';
					$("#chooseSharedLevelDiv").append(btn);
					btn = "#chooseSharedLevelButtonId" + i;
					$(btn).click(sharedButtonFunc);
				}
				var defaultList = res.defaultLevelList;
				$("#chooseDefaultLevelDiv").empty();
				var defaultButtonFunc = function() {
					var targetLevelId = $(this).attr("value");
					if (isNaN(targetLevelId))
						alert("请输入正确的关卡编号");
					else
					{
						logic.loadDefaultLevel(parseInt(targetLevelId));
					}
					resetGameButtons();
					$("#chooseLevelModal").modal("hide");
					$("#shareLevelButtonExtra").css("display", "none");
				};
				for (let i = 0; i < defaultList.length; i++)
				{
					var levelicon = "";
					if (defaultList[i].status == 0) levelicon = 'class="glyphicon glyphicon-remove"';
					if (defaultList[i].status == 1) levelicon = 'class="glyphicon glyphicon-lock"';
					if (defaultList[i].status == 2) levelicon = 'class="glyphicon glyphicon-ok"';
				
					let btn = '<button type="button" class="btn btn-primary" id="'
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
					if (i >= res.nextDefaultLevel && res.nextDefaultLevel != -1) $(btn).attr("disabled", true);
					$(btn).click(defaultButtonFunc);
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
			var pos;
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
			var pos;
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
			var pos;
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
			var pos;
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
			var pos;
			var value;
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
	tickHandler = function() {
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
			x: mapLeftPos + mapGridWidth * (x + 0.03 + 0.05),
			y: mapTopPos + mapGridHeight * (y + 0.99 - 0.05),
			len: 1.0  // Not to scale
		};
	};
	
	var loadMap = function(mapData) {
		if (!mapData || !mapData.length || mapData.length != mapSize) {
			throw "Invalid mapData";
		}
		
		for (let i = 0; i < mapSize; i++) {
			var x = mapData[i];
			if (isNaN(x)) throw "Invalid mapData[" + i + "]: " + x;
			map[i] = parseInt(x);
		}
		
		// Remove original mapSprites
		for (let i in mapSprites) {
			graphics.removeSprite(mapSprites[i]);
		}
		for (let i in mapTextSprites) {
			graphics.removeSprite(mapTextSprites[i]);
		}
		mapSprites = [];
		mapTextSprites = [];
		
		for (let i = 0; i < N; i++) {
			for (var j = 0; j < M; j++) {
				var id = i * M + j;
				var s = graphics.newSprite(mapSpriteSheets[0]);
				graphics.getSprite(s).set({alpha: 0.6});
				graphics.setSpritePos(s, getMapGridPos(j, i));
				mapSprites.push(s);
				
				if (map[id] != 0) {
					s = graphics.newSprite(mapSpriteSheets[map[id]]);
					graphics.setSpritePos(s, getMapGridPos(j, i));
					mapSprites.push(s);
				}
				
				var ts = graphics.newCustomSprite(new createjs.Text("", "15px Arial", "#003022"), {
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
			x: 380,
			y: 810,
			len: 380
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
		
		if (playerDirection == 0) {
			// front
			return {
				x: mapLeftPos + mapGridWidth * (j + 0.25),
				y: mapTopPos + mapGridHeight * (i - 0.2 + 0.5 + 0.05),
				len: mapGridWidth * 0.5
			};
		} else if (playerDirection == 2) {
			// back
			return {
				x: mapLeftPos + mapGridWidth * (j + 0.25),
				y: mapTopPos + mapGridHeight * (i - 0.2 + 0.5 - 1.0),
				len: mapGridWidth * 0.5
			};
		} else if (playerDirection == 1) {
			// right
			return {
				x: mapLeftPos + mapGridWidth * (j + 0.25 + 1.0),
				y: mapTopPos + mapGridHeight * (i - 0.2 + 0.5 - 0.55),
				len: mapGridWidth * 0.6
			};
		} else {
			// left
			return {
				x: mapLeftPos + mapGridWidth * (j + 0.25 - 1.0),
				y: mapTopPos + mapGridHeight * (i - 0.2 + 0.5 - 0.55),
				len: mapGridWidth * 0.6
			};
		}
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
			y: ret.y + mapGridHeight * (-0.65 + 0.44 - 0.1),  // 0.44 is 0.25 + 15/78
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
		var ts = graphics.newCustomSprite(new createjs.Text(args.value == undefined ? "" : args.value + "", "15px Arial", "blue"), {
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
			graphics.getSprite(playerSprite).gotoAndPlay("i" + playerDirection);
		} else {
			if (items[pos] != undefined) {
				throw "Invalid newItem on " + pos;
			}
			if (objectSpriteSheets[args.type] == undefined) {
				throw "Invalid newItem type " + args.type + " on pos " + pos;
			}
			items[pos] = genNewItem(args);
			setItemPos(items[pos], pos);
		}
		updatePlayerZIndex();
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
		
		var powFactor = 1;
		if (!isOnHead ^ (pos == -1)) {
			powFactor = 3;
		}
		
		graphics.getTweenObject(item.sprite).to(itemTrans, 500, createjs.Ease.getPowInOut(powFactor)).call(callback);
		graphics.getTweenObject(item.textSprite).to(textTrans, 500, createjs.Ease.getPowInOut(powFactor));
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
			graphics.getSprite(playerSprite).gotoAndPlay("drop" + playerDirection);
		} else {
			item = items[pos1];
			items[pos1] = undefined;
		}
		if (pos2 == -1) {
			itemOnHead = item;
			graphics.getSprite(playerSprite).gotoAndPlay("pick" + playerDirection);
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
		var prefix = itemOnHead != undefined ? "walki" : "walk";
		graphics.getSprite(playerSprite).gotoAndPlay(prefix + playerDirection);
		return graphics.getTweenObject(sprite).to(
			graphics.getSpriteTransformToPos(sprite, getMapGridPos(pos)),
			500,
			createjs.Ease.getPowInOut(1)
		);
	};
	
	var updateItemOnHead = function() {
		if (itemOnHead != undefined) {
			setItemPos(itemOnHead, -1);
		}
	};
	
	var updatePlayerZIndex = function() {
		stage.setChildIndex(graphics.getSprite(playerSprite), stage.getNumChildren() - 1);
		if (itemOnHead != undefined) {
			if (playerDirection == 2) {
				// back
				stage.setChildIndex(graphics.getSprite(itemOnHead), stage.getNumChildren() - 1);
				stage.setChildIndex(graphics.getSprite(playerSprite), stage.getNumChildren() - 1);
			} else {
				stage.setChildIndex(graphics.getSprite(itemOnHead), stage.getNumChildren() - 1);
			}
		}
	};
	
	var runAddPlayerAnimation = function(args) {
		var hasItemOnHead = itemOnHead != undefined;
		var stillPrefix = hasItemOnHead ? "i" : "a";
		
		setPlayerPos(playerSprite, args.pos1);
		if (playerDirection != args.dir1) {
			graphics.getSprite(playerSprite).gotoAndPlay(stillPrefix + args.dir1);
			playerDirection = args.dir1;
			playerPos = args.pos2;
			updateItemOnHead();
		}
		updatePlayerZIndex();
		
		// Move
		if (args.pos1 != args.pos2 && args.dir1 == args.dir2) {
			movePlayerPos(playerSprite, args.pos2).call(setAnimationComplete);
			if (itemOnHead != undefined) {
				moveItem(itemOnHead, args.pos2, true);
			}
		} else if (args.pos1 == args.pos2 && args.dir1 != args.dir2) {
			setTimeout(function() {
				setPlayerPos(playerSprite, args.pos2);
				graphics.getSprite(playerSprite).gotoAndPlay(stillPrefix + args.dir2);
				playerDirection = args.dir2;
				playerPos = args.pos2;
				updateItemOnHead();
				updatePlayerZIndex();
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
				graphics.getSprite(playerSprite).gotoAndPlay(stillPrefix + args.dir2);
				playerDirection = args.dir2;
				playerPos = args.pos2;
				updateItemOnHead();
				updatePlayerZIndex();
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
			graphics.getSprite(playerSprite).gotoAndPlay("a" + playerDirection);
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
			x: pos.x + (0.2 + 0.1) * IOItemsWidth,
			y: pos.y + (-1.0 + 0.7 - 0.05) * IOItemsHeight,
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
			if (inputItems.hasOwnProperty(i)) {
				removeItem(inputItems[i]);
			}
		}
		inputItems = [];
		
		for (let i in args.itemList) {
			if (args.itemList.hasOwnProperty(i)) {
				let item = genNewItem(args.itemList[i]);
				setInputItemPos(item, inputItems.length);
				inputItems.push(item);
			}
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	var runSetOutput = function(args) {
		for (let i in outputItems) {
			if (outputItems.hasOwnProperty(i)) {
				removeItem(outputItems[i]);
			}
		}
		outputItems = [];
		
		for (let i in args.itemList) {
			if (args.itemList.hasOwnProperty(i)) {
				let item = genNewItem(args.itemList[i]);
				setOutputItemPos(item, outputItems.length);
				outputItems.push(item);
			}
		}
		
		setTimeout(setAnimationComplete, 0);
	};
	
	// For alert function.
	var alertMask = undefined;
	var alertTextBackground = undefined;
	var alertText = undefined;
	
	clearAlert = function() {
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
		alertText.maxWidth = TextWidth;
		alertText.lineHeight = 25;
		alertText.x = StageWidth / 2;
		alertText.y = (StageHeight - alertText.getMeasuredHeight()) / 2;
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
			if (itemList.hasOwnProperty(i)) {
				var item = itemList[i];
				ret[i] = {
					type: item.type,
					value: item.value
				};
			}
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
	};

	var setLevelId = function(level_id)
	{
		$("#currentLevelSpan").text("用户关卡：第" + level_id + "关")
	};
	
	var setDefaultLevelId = function(default_level_id)
	{
		$("#currentLevelSpan").text("默认关卡：第" + default_level_id + "关")	
	};

	var setDescription = function(text) {
		if (typeof(text) != "string") {
			text = text + "";
		}
		levelDescriptionText.text = text;
		var h = levelDescriptionText.getMeasuredHeight();
		levelDescriptionText.y = (160 - h) / 2;
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
		debug: debug,
		setLevelId: setLevelId,
		setDefaultLevelId: setDefaultLevelId,
		setDescription: setDescription,
	};
}();
