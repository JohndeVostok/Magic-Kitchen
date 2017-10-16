var main = function() {
	var doLoad = function() {
		ui.doLoad();
		code.doLoad();
		logic.doLoad();
		network.doLoad();
	};
	
	return {
		doLoad: doLoad
	};
}();
