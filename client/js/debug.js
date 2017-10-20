var config = window.config;

var debug = function(){
	var log = function(info) {
		if (config.debug) {
			console.log(info);
		}
	};

	return {
		log: log
	};
}();
