var ui = function() {
	var doLoad = function() {
		loadStage();
		
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
	
	var start = function() {
		// TODO: implement this after logic is implemented
	};
	
	var loadMap = function(mapData) {
		
	};
	
	var loadUserInfo = function(userInfo) {
		// TODO: implement this
	};
	
	var loadBlockInfo = function(blockInfo) {
		// TODO: implement this
	};
	
	// Below are animation functions, i.e. functions that register animations for later rendering.
	
	var clearItems = function() {
		
	};
	
	var newItem = function(pos, type, args) {
		
	};
	
	var deleteItem = function(pos, args) {
		
	};
	
	var addAnimation = function(pos1, pos2, args) {
		
	};
	
	var addPlayerAnimation = function(pos1, pos2, dir1, dir2) {
		
	};
	
	var setInput = function(itemList) {
		
	};
	
	var setOutput = function(itemList) {
		
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
