# Doc

## Client

### Network
		network.register(name, password, email, callback)
			name: type = string, content = User Name
			password: type = string, content = Pass Phrase
			email: type = string, content = User Email
			callback: type = function, content = Callback(result)
				result: type = json
					"status": "succeeded" / "failed"
					"error":
						undefined (when "status" == "succeeded")
						message (when server return "failed")
						"network timeout" (when server fail to response)
			return: undefined

		network.login(name, password, callback)
			name: type = string, content = User Name
			password: type = string, content = Pass Phrase
			callback: type = function, content = Callback(result)
				result: type = json
					"status": "succeeded" / "failed"
					"error":
						undefined (when "status" == "succeeded")
						message (when server return "failed")
						"network timeout" (when server fail to response)
			return: undefined

		network.logout(callback)
			callback: type = function, content = Callback(result)
				result: type = json
					"status": "succeeded" / "failed"
					"error":
						undefined (when "status" == "succeeded")
						message (when server return "failed")
						"network timeout" (when server fail to response)
			return: undefined

		network.changePasswordByEmail(name, callback)
			name: type = string, content = User Name
			callback: type = function, content = Callback(result)
				result: type = json
					"status": "succeeded" / "failed"
					"error":
						undefined (when "status" == "succeeded")
						message (when server return "failed")
						"network timeout" (when server fail to response)
			return: undefined
