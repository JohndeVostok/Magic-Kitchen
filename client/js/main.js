var main = function() {
	var doLoad = function() {
		ui.doLoad();
		logic.doLoad();
		network.doLoad();
	};
	
	return {
		doLoad: doLoad
	};
}();
