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
		workspace = Blockly.inject('blocklyDiv', {
			toolbox: enabledToolbox[0],
			grid: {
				spacing: 20,
				length: 3,
				colour: "#ccc",
				snap: true
			},
			trashcan: false,
			zoom: {
				controls: false,
				wheel: true,
				startScale: 1.0,
				maxScale: 1.5,
				minScale: 0.3,
				scaleSpeed: 1.2
			}
		});
	};

	var setLock = function(state){
		state = state || alwaysLock;
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
		var ret = [];
		for (var id in ops) ret[id] = logic.step(ops[id]);
		return ret;
	};

	var callCodeOp = function(blockID, op) {
		highlight(blockID);
		switch (op.typeId)
		{
			case 42:
				funcList[op.op] = true;
				calledLogic = true;
			break;
			case 43:
				if (funcList[op.op] == undefined)
				{
					logic.step({typeId: 43, op: msg.getMsgId("No such function.")});
				}
				calledLogic = true;
			break;
		};
	};

	var start = function() {
		setLock(true);
		funcList = {};
		highlight();
		var code = config.blocklyConstants.overallInitialization + 
				Blockly.JavaScript.workspaceToCode(workspace) +
				config.blocklyConstants.overallFinalization;
		debug.log(code);
		interpreter = new Interpreter(code, function(interpreter, scope){
			interpreter.setProperty(scope, 'extCall1', interpreter.createNativeFunction(
				function(blockID, ops) {
					return interpreter.nativeToPseudo(callLogicOps(
						interpreter.pseudoToNative(blockID),
						interpreter.pseudoToNative(ops)
					));
				}
			));
			interpreter.setProperty(scope, 'extCall2', interpreter.createNativeFunction(
				function(blockID, op) {
					return interpreter.nativeToPseudo(callCodeOp(
						interpreter.pseudoToNative(blockID),
						interpreter.pseudoToNative(op)
					));
				}
			));
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

	var dumpSolution = function() {
		return {
			solution: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace)),
			block_num: workspace.getAllBlocks().length
		};
	}

	var loadSolution = function(solution) {
		workspace.clear();
		Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(solution.solution), workspace);
		setLock(false);
	}

	var setAlwaysLock = function() {
		alwaysLock = true;
		setLock(true);
		workspace.clearUndo();
	}

	// Blockly workspace
	var workspace;

	var interpreter;

	var calledLogic;

	var enabledToolbox;
	var disabledToolbox;
	var funcList;

	var alwaysLock = false;

	return {
		doLoad: doLoad,
		setBlockTypes: setBlockTypes,
		start: start,
		step: step,
		stop: stop,
		undo: undo,
		redo: redo,
		dumpSolution: dumpSolution,
		loadSolution: loadSolution,
		setAlwaysLock: setAlwaysLock
	};
}();
