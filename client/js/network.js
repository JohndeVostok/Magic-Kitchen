var network = function() {
	var doLoad = function() {};

	var nRetry = 3;

	var getRequest = function(url, contents, callback, retry = nRetry) {
		$.ajax({
			url: url,
			data: contents,
			timeout: 500,
			success: function(data) {
				callback(data)
			},
			error: function() {
				if (retry > 0) getRequest(url, contents, callback, retry - 1);
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
			timeout: 500,
			success: function(data) {
				callback(data)
			},
			error: function() {
				if (retry > 0) getRequest(url, contents, callback, retry - 1);
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
	
	return {
		doLoad: doLoad,
		register: register,
		login: login,
		logout: logout,
		changePasswordByEmail: changePasswordByEmail
	};
}();
