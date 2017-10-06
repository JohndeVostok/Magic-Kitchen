var main = function() {
	var doLoad = function() {
		UI.doLoad();
		logic.doLoad();
		network.doLoad();
	};
	
	return {
		doLoad: doLoad
	};
}();
