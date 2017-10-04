var main = function() {
	var doLoad = function() {
		// Test CreateJS and Blockly
		
		var stage = new createjs.Stage("gameCanvas");
		for (var i = 0; i < 1; i++) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50 / (i + 1));
			circle.x = 100 + i * 50;
			circle.y = 100 + (5 - i) * (5 - i) * 10;
			stage.addChild(circle);
		}
		stage.update();
		
		var workspacePlayground = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
	};
	
	return {
		doLoad: doLoad
	};
}();
