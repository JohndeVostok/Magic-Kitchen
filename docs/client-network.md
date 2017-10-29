# Doc

## Client

### Network
		All functions may try 3 times before timeout.
		All callback functions are called with <5s delay.

		network.register(name, password, email, callback)
			name: type = string, content = User Name
			password: type = string, content = Pass Phrase
			email: type = string, content = User Email
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
			return: undefined

		network.login(name, password, callback)
			name: type = string, content = User Name
			password: type = string, content = Pass Phrase
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
			return: undefined

		network.logout(callback)
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
			return: undefined

		network.changePasswordByEmail(name, callback)
			name: type = string, content = User Name
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
			return: undefined

		network.changePasswordAfterLogin(new_password, callback)
			new_password: type = string, content = New Password
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
			return: undefined

		network.newDefaultLevel(level_id, level_info, callback)
			level_id: type = int, range in [0, 100]
			level_info: JSON.stringify(level_data)
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
			return: undefined

		network.editDefaultLevel(level_id, level_info, callback)
			level_id: type = int, range in [0, 100]
			level_info: JSON.stringify(level_data)
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
			return: undefined

		network.getLevelInfo(level_id, callback)
			level_id: type = int, range in [0, 100]
			callback: type = function, content = Callback(result)
				result: type = json
					"status": return code. 1000 for Success, otherwise see client-msg.md for details.
					"level_info":
						JSON format level data from server.
						undefined when "status" != 1000.
