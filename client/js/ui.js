var ui = function() {
	var doLoad = function() {
		loadStage();
		
		loadConfig();
		initUI();
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
	
	// Map state
	var map = [];
	var mapSize;
	
	// Item states
	var items = [];
	var itemOnHead;
	
	// Player state
	var playerX, playerY;
	
	// Animation queue
	var animationQueue = [];
	
	// CreateJS map data
	var mapGridHeight;
	var mapGridWidth;
	var mapLeftPos;
	var mapTopPos;
	var mapSpriteSheets = {};
	var mapSprites = [];
	var objectSpriteSheets = {};
	var playerSpriteSheet;
	var playerSprite = undefined;
	
	var initUI = function() {
		// Init map.
		mapSize = N * M;
		for (var i = 0; i < mapSize; i++) {
			map[i] = 0;
		}
		
		// Init player.
		playerX = 0;
		playerY = 0;
		
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
			mapSpriteSheets[i] = new createjs.SpriteSheet({
				frames: {
					width: config.UI.map.imageWidth,
					height: config.UI.map.imageHeight
				},
				images: [config.UI.map.images[i]]
			});
		}
		
		objectSpriteSheet = {};
		for (var i in config.UI.object.images) {
			objectSpriteSheets[i] = new createjs.SpriteSheet({
				frames: {
					width: config.UI.object.imageWidth,
					height: config.UI.object.imageHeight
				},
				images: [config.UI.object.images[i]]
			});
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
		
		// Init DOM elements.
		// For test only.
		$("#buttonCompile").click(function() {
			logic.start();
		});
		$("#buttonStep").click(function() {
			logic.step();
		});
	};
	
	var start = function() {
		// Grab & start a new level.
		// The main loop is not present here, because the system event loop already does this.
		logic.loadLevel();
	};
	
	var animationRunning = false;
	
	// Handle the ticks from Ticker.
	var tickHandler = function() {
		// Handle unapplied animations.
		if (animationRunning == false && animationQueue.length > 0) {
			animationRunning = true;
			startAnimation(animationQueue.shift());
		}
	};
	
	var setAnimationComplete = function() {
		animationRunning = false;
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
			stage.removeChild(mapSprites[i]);
		}
		mapSprites = [];
		
		for (var i = 0; i < N; i++) {
			for (var j = 0; j < M; j++) {
				var id = i * M + j;
				var s = new createjs.Sprite(mapSpriteSheets[0]);
				s.setTransform(
					mapLeftPos + mapGridWidth * j,
					mapTopPos + mapGridHeight * i,
					mapGridWidth / config.UI.map.imageWidth,
					mapGridHeight / config.UI.map.imageHeight
				);
				mapSprites.push(s);
				stage.addChild(s);
				
				s = new createjs.Sprite(mapSpriteSheets[map[id]]);
				s.setTransform(
					mapLeftPos + mapGridWidth * j,
					mapTopPos + mapGridHeight * i,
					mapGridWidth / config.UI.map.imageWidth,
					mapGridHeight / config.UI.map.imageHeight
				);
				mapSprites.push(s);
				stage.addChild(s);
			}
		}
		
		if (playerSprite != undefined) {
			stage.removeChild(playerSprite);
		}
		playerSprite = new createjs.Sprite(playerSpriteSheet);
		playerSprite.setTransform(
			-10000,
			-10000,
			mapGridWidth / config.UI.player.imageWidth,
			mapGridHeight / config.UI.player.imageHeight
		);
		stage.addChild(playerSprite);
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
		} else {
			throw "Invalid animation " + animation.type;
		}
	};
	
	var runClearItems = function(args) {
		for (var i = 0; i < mapSize; i++) {
			if (items[i] != undefined) {
				stage.removeChild(items[i].sprite);
			}
			items[i] = undefined;
		}
		if (itemOnHead != undefined) {
			stage.removeChild(itemOnHead.sprite);
			itemOnHead = undefined;
		}
		
		setTimeout(setAnimationComplete, 100);
	};
	
	// Get item pos on head transform.
	var getItemPosHeadTransform = function(pos) {
		var i = (pos - pos % M) / M;
		var j = pos % M;
		
		return {
			x: mapLeftPos + mapGridWidth * (j + 0.25),
			y: mapTopPos + mapGridWidth * (i -0.2),
			scaleX: 0.5 * mapGridWidth / config.UI.object.imageWidth,
			scaleY: 0.5 * mapGridHeight / config.UI.object.imageHeight
		};
	};
	
	// Get item pos transform.
	var getItemPosTransform = function(pos) {
		if (pos == -1) {
			return {
				x: playerSprite.x + mapGridWidth * 0.25,
				y: playerSprite.y + mapGridWidth * -0.2,
				scaleX: 0.5 * mapGridWidth / config.UI.object.imageWidth,
				scaleY: 0.5 * mapGridHeight / config.UI.object.imageHeight
			}
		}
		var i = (pos - pos % M) / M;
		var j = pos % M;
		
		return {
			x: mapLeftPos + mapGridWidth * (j + 0.17),
			y: mapTopPos + mapGridHeight * (i - 0.07),
			scaleX: 0.65 * mapGridWidth / config.UI.object.imageWidth,
			scaleY: 0.65 * mapGridHeight / config.UI.object.imageHeight
		};
	};
	
	// Set an item's pos
	var setItemPos = function(sprite, pos) {
		var transform = getItemPosTransform(pos);
		sprite.setTransform(
			transform.x,
			transform.y,
			transform.scaleX,
			transform.scaleY
		);
	};
	
	var runNewItem = function(args) {
		var pos = args.pos;
		if (pos == -1) {
			throw "Not implemented";
		} else {
			if (items[pos] != undefined) {
				throw "Invalid newItem on " + pos;
			}
			if (objectSpriteSheets[args.type] == undefined) {
				throw "Invalid newItem type " + type + " on pos " + pos;
			}
			var s = new createjs.Sprite(objectSpriteSheets[args.type]);
			items[pos] = {
				type: args.type,
				args: args.args,
				sprite: s
			};
			setItemPos(s, pos);
			stage.addChild(s);
		}
		
		setTimeout(setAnimationComplete, 100);
	};
	
	var runAddAnimation = function(args) {
		var pos1 = args.pos1;
		var pos2 = args.pos2;
		if (pos1 == pos2) {
			setTimeout(setAnimationComplete, 100);
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
		createjs.Tween.get(item.sprite).to(getItemPosTransform(pos2), 500, createjs.Ease.getPowInOut(3))
			.call(setAnimationComplete);
	};
	
	// Set player's pos
	var setPlayerPos = function(sprite, pos) {
		var i = (pos - pos % M) / M;
		var j = pos % M;
		
		sprite.setTransform(
			mapLeftPos + mapGridWidth * j,
			mapTopPos + mapGridHeight * i,
			mapGridWidth / config.UI.player.imageWidth,
			mapGridHeight / config.UI.player.imageHeight
		);
	};
	
	// Move player's pos
	var movePlayerPos = function(sprite, pos) {
		var i = (pos - pos % M) / M;
		var j = pos % M;
		
		createjs.Tween.get(sprite).to({
			x: mapLeftPos + mapGridWidth * j,
			y: mapTopPos + mapGridHeight * i,
			scaleX: mapGridWidth / config.UI.player.imageWidth,
			scaleY: mapGridHeight / config.UI.player.imageHeight
		}, 500, createjs.Ease.getPowInOut(3));
	};
	
	var runAddPlayerAnimation = function(args) {
		setPlayerPos(playerSprite, args.pos1);
		playerSprite.gotoAndPlay("a" + args.dir1);
		
		// Move
		if (args.pos1 != args.pos2 && args.dir1 == args.dir2) {
			movePlayerPos(playerSprite, args.pos2);
			createjs.Tween.get(playerSprite).call(setAnimationComplete);
			if (itemOnHead != undefined) {
				createjs.Tween.get(itemOnHead.sprite).to(getItemPosHeadTransform(args.pos2), 500, createjs.Ease.getPowInOut(3));
			}
		} else {
			setTimeout(function() {
				setPlayerPos(playerSprite, args.pos2);
				playerSprite.gotoAndPlay("a" + args.dir2);
			}, 500);
			setTimeout(setAnimationComplete, 1000);
		}
	};
	
	// Below are animation functions, i.e. functions that register animations for later rendering.
	
	var clearItems = function() {
		animationQueue.push({
			type: "clearItems"
		});
	};
	
	var newItem = function(pos, type, args) {
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
	
	var setInput = function(itemList) {
		// TODO
	};
	
	var setOutput = function(itemList) {
		// TODO
	};
	
	var debug = function() {
		console.log(animationRunning);
		console.log(animationQueue);
	};
	
	return {
		doLoad: doLoad,
		start: start,
		loadMap: loadMap,
		loadUserInfo: loadUserInfo,
		loadBlockInfo: loadBlockInfo,
		clearItems: clearItems,
		newItem: newItem,
		deleteItem: deleteItem,
		addAnimation: addAnimation,
		addPlayerAnimation: addPlayerAnimation,
		setInput: setInput,
		setOutput: setOutput,
		debug: debug
	};
}();
