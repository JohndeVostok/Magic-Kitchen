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
				{
					setTimeout(function(){getRequest(url, contents, callback, retry - 1);}, retryDelay);
				}
				else callback({"status": 9000});
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
				{
					setTimeout(function(){postRequest(url, contents, callback, retry - 1);}, retryDelay);
				}
				else callback({"status": 9000});
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

	var getDefaultLevelInfo = function(default_level_id, callback) {
		postRequest(
			"/api/get_level_info",
			{
				"default_level_id": default_level_id
			},
			callback
		);
	};

	var getLevelInfo = function(level_id, callback) {
		postRequest(
			"/api/get_level_info",
			{
				"level_id": level_id
			},
			callback
		);
	};

	var getCurrentUserInfo = function(callback) {
		postRequest(
			"/api/get_current_user_info",
			{},
			callback
		);
	};

	var newUsermadeLevel = function(level_info, callback) {
		postRequest(
			"/api/new_usermade_level",
			{
				"level_info": level_info,
			},
			callback
		);
	};

	var newSolution = function(level_id, solution_info, score, callback) {
		postRequest(
			"/api/new_solution",
			{
				"level_id": level_id,
				"solution_info": solution_info,
				"score": score
			},
			callback
		);
	};

	var getAllLevel = function(callback) {
		postRequest(
			"/api/get_all_level",
			{
			},
			callback
		);
	};

	var vipCharge = function(days, callback) {
		postRequest(
			"/api/vip_charge",
			{
				"days": days
			},
			callback
		);
	};

	var setAdmin = function(name, callback) {
		postRequest(
			"api/set_admin",
			{
				"name": name
			},
			callback
		);
	};

	var shareLevel = function(levelId, callback) {
		postRequest(
			"api/share_level",
			{
				"level_id": levelId,
				"share": 1
			},
			callback
		);
	}
	
	var unshareLevel = function(levelId, callback) {
		postRequest(
			"api/share_level",
			{
				"level_id": levelId,
				"share": 0
			},
			callback
		);
	}

	var getDefaultLevel = function(callback) {
		postRequest(
			"api/get_all_default_level",
			{},
			callback
		);
	}

	var getSharedLevel = function(callback) {
		postRequest(
			"api/get_all_shared_level",
			{},
			callback
		);
	}

	return {
		doLoad: doLoad,
		register: register,
		login: login,
		logout: logout,
		changePasswordByEmail: changePasswordByEmail,
		changePasswordAfterLogin: changePasswordAfterLogin,
		newDefaultLevel: newDefaultLevel,
		editDefaultLevel: editDefaultLevel,
		getDefaultLevelInfo: getDefaultLevelInfo,
		getLevelInfo: getLevelInfo,
		getCurrentUserInfo: getCurrentUserInfo,
		newUsermadeLevel: newUsermadeLevel,
		shareLevel: shareLevel,
		unshareLevel: unshareLevel,
		newSolution: newSolution,
		getAllLevel: getAllLevel,
		getSharedLevel: getSharedLevel,
		getDefaultLevel: getDefaultLevel,
		vipCharge: vipCharge,
		setAdmin: setAdmin
	};
}();
