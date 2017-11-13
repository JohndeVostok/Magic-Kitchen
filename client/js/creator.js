var main = function() {
	var doLoad = function() {
		ui.doLoad();
		code.doLoad();
		logic.doLoad();
		network.doLoad();
		
		// Start the main loop of UI.
		ui.start();
	};
	
	return {
		doLoad: doLoad
	};
}();
