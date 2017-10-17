var ui = function() {
	var doLoad = function() {
		loadStage();
		
		loadConfig();
		initUI();
		
		// Test CreateJS and Blockly
		
		for (var i = 0; i < 1; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50 / (i + 1));
			circle.x = 100 + i * 50;
			circle.y = 100 + (5 - i) * (5 - i) * 10;
			stage.addChild(circle);
		}
		stage.update();
	};
	
	// CreateJS stage
	var stage;
	
	var loadStage = function() {
		stage = new createjs.Stage("gameCanvas");
		adjustStageSize();
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
	};
	
	var start = function() {
		// TODO: implement this after logic is implemented
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
		if (pos < -1 || pos >= mapSize) {
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
		if (pos < 0 || pos >= mapSize) {
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
	
	// Below are animation functions, i.e. functions that register animations for later rendering.
	
	var clearItems = function() {
		animationQueue.push({
			type: "clearItems"
		});
		for (var i = 0; i < mapSize; i++) {
			items[i] = undefined;
		}
		itemOnHead = undefined;
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
		setOutput: setOutput
	};
}();
