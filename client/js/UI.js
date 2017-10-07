var UI = function() {
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
		
		workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
	};
	
	// CreateJS stage
	var stage;
	
	// Blockly workspace
	var workspace;
	
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
	
	return {
		doLoad: doLoad
	};
}();
