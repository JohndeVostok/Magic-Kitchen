var debug = window.debug;

var network = function() {
	var doLoad = function() {};

	var nRetry = 2;
	var requestTimeout = 500;
	var retryDelay = 1000;

	var getRequest = function(url, contents, callback, retry = nRetry) {
		$.ajax({
			url: url,
			data: contents,
			timeout: requestTimeout,
			success: function(data) {
				callback(data)
			},
			error: function() {
				if (retry > 0)
					setTimeout(function(){getRequest(url, contents, callback, retry - 1);}, retryDelay);
				else callback({
					"status": "failed",
					"error": "network timeout"
				});
			}
		});
	};

	var postRequest = function(url, contents, callback, retry = nRetry) {
		$.ajax({
            method: "POST",
			url: url,
			data: contents,
			timeout: requestTimeout,
			success: function(data) {
				callback(data)
			},
			error: function() {
				if (retry > 0)
					setTimeout(function(){postRequest(url, contents, callback, retry - 1);}, retryDelay);
				else callback({
					"status": "failed",
					"error": "network timeout"
				});
			}
		});
	};

	var register = function(name, password, email, callback) {
		postRequest(
			"/api/register",
			{
				"name": name,
				"password": password,
				"email": email
			},
			callback
		);
	};

	var login = function(name, password, callback) {
		postRequest(
			"/api/login",
			{
				"name": name,
				"password": password
			},
			callback
		);
	};

	var logout = function(callback) {
		postRequest(
			"/api/logout",
			{},
			callback
		);
	};

	var changePasswordByEmail = function(name, callback) {
		postRequest(
			"/api/change_password_by_email",
			{
				"name": name
			},
			callback
		);
	};

	var changePasswordAfterLogin = function(new_password, callback) {
		postRequest(
			"/api/change_password_after_login",
			{
				"new_password": new_password
			},
			callback
		);
	};

	var newDefaultLevel = function(level_id, level_info, callback) {
		postRequest(
			"/api/new_default_level",
			{
				"default_level_id": level_id,
				"level_info": level_info
			},
			callback
		);
	};

	var editDefaultLevel = function(level_id, level_info, callback) {
		postRequest(
			"/api/new_default_level",
			{
				"default_level_id": level_id,
				"level_info": level_info,
				"edit": "True"
			},
			callback
		);
	};

	var getLevelInfo = function(level_id, callback) {
		postRequest(
			"/api/get_level_info",
			{
				"default_level_id": level_id
			},
			callback
		);
	};
	
	return {
		doLoad: doLoad,
		register: register,
		login: login,
		logout: logout,
		changePasswordByEmail: changePasswordByEmail,
		changePasswordAfterLogin: changePasswordAfterLogin,
		newDefaultLevel: newDefaultLevel,
		editDefaultLevel: editDefaultLevel,
		getLevelInfo: getLevelInfo
	};
}();
