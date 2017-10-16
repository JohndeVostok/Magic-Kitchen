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
					return blockDef.generateJavaScript(block);
				}
			}(blockDef);

			var newBlock = $("<block type=\"" + blockDef.name + "\"></block>")
			$("xml#toolbox").append(newBlock);
		}
		workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
	};

	var test = function() {
		var code = Blockly.JavaScript.workspaceToCode(workspace);
		$("p#test").text(code);
	};
	
	// Blockly workspace
	var workspace;
	
	return {
		doLoad: doLoad,
		setBlockTypes: setBlockTypes,
		test: test
	};
}();
