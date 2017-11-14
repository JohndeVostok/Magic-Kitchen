var creator = function() {
	var doLoad = function() {
		ui.doLoadCreator();
		ui.startCreator();
	};
	
	return {
		doLoad: doLoad
	};
}();
