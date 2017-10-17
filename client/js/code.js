var code = function() {
	var doLoad = function() {
		Blockly.JavaScript.STATEMENT_PREFIX = "blockID = %1;";
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
					return "extCall1(blockID, " + 
							JSON.stringify(blockDef.generateOps(block)) +
							");";
				}
			}(blockDef);

			var newBlock = $("<block type=\"" + blockDef.name + "\"></block>")
			$("xml#toolbox").append(newBlock);
		}
		workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
	};

	var highlight = function(id) {
		workspace.highlightBlock(id);
	};

	var callLogicOps = function(blockID, ops) {
		calledLogic = true;
		highlight(blockID);
		for (var id in ops.a) logic.step(ops.a[id].a);
	}

	var start = function() {
		highlight();
		var code = Blockly.JavaScript.workspaceToCode(workspace);
		interpreter = new Interpreter(code, function(interpreter, scope){
			interpreter.setProperty(scope, 'extCall1', interpreter.createNativeFunction(callLogicOps));
		});
	};

	var step = function() {
		if (interpreter == undefined) return false;
		calledLogic = false;
		while (!calledLogic) {
			if (!interpreter.step())
			{
				highlight();
				return false;
			}
		}
		return true;
	};

	var stop = function() {
		highlight();
		interpreter = undefined;
	}

	// Blockly workspace
	var workspace;

	var interpreter;

	var calledLogic;

	return {
		doLoad: doLoad,
		setBlockTypes: setBlockTypes,
		start: start,
		step: step,
		stop: stop,
	};
}();
