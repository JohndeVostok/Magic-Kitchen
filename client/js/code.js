var debug = window.debug;

var code = function() {
	var doLoad = function() {
		Blockly.JavaScript.STATEMENT_PREFIX = config.blocklyConstants.eachInitialization;
	};

	var setBlockTypes = function(blockIDList) {

		enabledToolbox = $("<xml id=\"toolbox\" style=\"display: none\"></xml>");
		disabledToolbox = $("<xml id=\"toolbox\" style=\"display: none\"></xml>");

		for (var id=0; id<blockIDList.length; id++)
		{
			var blockDef = blocks[blockIDList[id]];

			Blockly.Blocks[blockDef.name] = function(blockDef){
				var init = function() {
					this.jsonInit(blockDef.json);
					blockDef.initExtra(this);
				};
				return {
					init: init
				};
			}(blockDef);

			if (blockDef.generateJS != undefined)
			{
				Blockly.JavaScript[blockDef.name] = blockDef.generateJS;
			}
			else
			{
				Blockly.JavaScript[blockDef.name] = function(blockDef) {
					return function(block) {
						return "extCall1(blockID[stacklvl], " + 
								JSON.stringify(blockDef.generateOps(block)) +
								");";
					}
				}(blockDef);
			}

			var disableBlock = $("<block type=\"" + blockDef.name + "\" disabled=\"true\"></block>");
			disabledToolbox.append(disableBlock);

			var newBlock = $("<block type=\"" + blockDef.name + "\"></block>");
			enabledToolbox.append(newBlock);
		}
		$("#blocklyDiv").children().remove();
		workspace = Blockly.inject('blocklyDiv', {toolbox: enabledToolbox[0]});
	};

    var setLock = function(state){
		if (state) workspace.updateToolbox(disabledToolbox[0]);
		else workspace.updateToolbox(enabledToolbox[0]);
        currentBlocks = workspace.getAllBlocks();
        for (let bid in currentBlocks)
        {
            currentBlocks[bid].setEditable(!state);
            currentBlocks[bid].setMovable(!state);
            currentBlocks[bid].setDeletable(!state);
        }
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
		setLock(true);
		highlight();
		var code = config.blocklyConstants.overallInitialization + Blockly.JavaScript.workspaceToCode(workspace);
		debug.log(code);
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
		setLock(false);
		interpreter = undefined;
	}

	var undo = function() {
		workspace.undo(false);
	}

	var redo = function() {
		workspace.undo(true);
	}

	// Blockly workspace
	var workspace;

	var interpreter;

	var calledLogic;

	var enabledToolbox;
	var disabledToolbox;

	return {
		doLoad: doLoad,
		setBlockTypes: setBlockTypes,
		start: start,
		step: step,
		stop: stop,
		undo: undo,
		redo: redo
	};
}();
