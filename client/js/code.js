var code = function() {
	var doLoad = function() {
		this.setBlockTypes([0, 1, 3]);
	};

	var setBlockTypes = function(blockIDList) {
		for (var id=0; id<blockIDList.length; id++)
		{
			var blockDef = config.blocks[blockIDList[id]];

			Blockly.Blocks[blockDef.name] = function(blockDef){
				var init = function() {
					this.jsonInit(blockDef.json);
					blockDef.initExtra(this);
				};
				return {
					init: init
				};
			}(blockDef);

			Blockly.JavaScript[blockDef.name] = function(blockDef) {
				return function(block) {
					return blockDef.generateJavaScript(block, operateSequence);
				}
			}(blockDef);

			var newBlock = $("<block type=\"" + blockDef.name + "\"></block>")
			$("xml#toolbox").append(newBlock);
		}
		workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
	};

	var start = function() {
		var code = "operateSequence = [];" + Blockly.JavaScript.workspaceToCode(workspace);
		eval(code);
	};

	var step = function() {
		return operateSequence;
	};

	// Blockly workspace
	var workspace;

	var operateSequence;

	return {
		doLoad: doLoad,
		setBlockTypes: setBlockTypes,
		start: start,
		step: step
	};
}();
