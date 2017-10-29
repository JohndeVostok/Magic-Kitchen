var config = window.config;

var debug = function(){
	var log = function(info) {
		if (config.debug) {
			console.log(JSON.stringify(info));
		}
	};

	return {
		log: log
	};
}();
