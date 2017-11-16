var creator = function() {
	var doLoad = function() {
		ui.doLoad();
		ui.startCreator();
	};
	
	return {
		doLoad: doLoad
	};
}();
