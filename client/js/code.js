var code = function() {
	var doLoad = function() {
		workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
	};
	
	// Blockly workspace
	var workspace;
	
	return {
		doLoad: doLoad
	};
}();
