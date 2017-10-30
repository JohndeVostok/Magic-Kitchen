QUnit.test( "network register test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.register("hq", "sb", "sb@163.com",
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "register ok" );
				else assert.ok( data["status"] == 1005 , data["status"]);
				network.logout(function(data){});
				done();
			}
		);
	});
});

QUnit.test( "network login & logout test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.login("hq", "sb", 
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "login ok" );
				else assert.ok( false, data["status"]);
				network.logout(
					function(data) {
						if (data["status"] == 1000)
							assert.ok( true, "logout ok" );
						else assert.ok( false, data["status"]);
						done();
					}
				);
			}
		);
	});
});

QUnit.test( "network change password by email test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.changePasswordByEmail(
			"hq",
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "change password attempt ok" );
				else assert.ok( false, data["status"]);
				done();
			}
		);
	});
});

QUnit.test( "network change password after login test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.login("hq", "sb", 
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "login ok" );
				else assert.ok( false, data["status"]);
				network.changePasswordAfterLogin(
					"nc",
					function(data) {
						if (data["status"] == 1000)
							assert.ok( true, "change password attempt ok" );
						else assert.ok( false, data["status"]);
						network.logout(function(data){
							network.changePasswordAfterLogin(
								"nc",
								function(data) {
									if (data["status"] == 1000)
										assert.ok(false, "expected 1001, got 1000")
									else assert.ok(data["status"] == 1001, "got " + data["status"]);
									network.login("hq", "sb", 
										function(data) {
											if (data["status"] == 1000)
												assert.ok(false, "expected 1012 , got 1000")
											else assert.ok(data["status"] == 1012, "got " + data["status"]);
											network.login("hq", "nc", 
												function(data) {
													if (data["status"] == 1000)
														assert.ok(true, "change password succeeded")
													else assert.ok(false, data["status"]);
													network.changePasswordAfterLogin(
														"sb",
														function(data) {
															if (data["status"] == 1000)
																assert.ok( true, "change password attempt ok" );
															else assert.ok( false, data["status"]);
															network.logout(function(data){});
															done();
														}
													);
												}
											);
										}
									);
								}
							);
						});
					}
				);
			}
		);
	});
});

QUnit.test( "network default level test", function( assert ) {
	var done = assert.async();
	var jsonLevel = JSON.stringify(config.fakeLevelInfo);
	network.logout(function(data){
		network.newDefaultLevel(0, jsonLevel,
			function(data) {
				if (data["status"] == 1000) {
					assert.ok( true, "new level ok" );
					network.getDefaultLevelInfo(0,
						function(data) {
							if (data["status"] == 1000)
								assert.ok( data["level_info"] == jsonLevel, "load level ok" );
							else assert.ok( false , data["status"]);
							done();
						}
					);
				}
				else if (data["status"] == 1022) {
					assert.ok( true, "got exist, trying to edit level")
					network.editDefaultLevel(0, jsonLevel,
						function(data) {
							assert.ok( data["status"] == 1000, "edit level ok");
							network.getDefaultLevelInfo(0,
								function(data) {
									if (data["status"] == 1000)
										assert.ok( data["level_info"] == jsonLevel, "load level ok" );
									else assert.ok( false , data["status"]);
									done();
								}
							);
						}
					);
				}
				else assert.ok( false , data["status"]);
			}
		);
	});
});

QUnit.test( "network default level test extra", function( assert ) {
	var done = assert.async();
	var jsonLevel = JSON.stringify({
		blockTypes: [2, 5, 7, 8, 11],
		playerInfo: {pos: 3, dir: 1},
		opFloor: [10, 0, 6],
		input: [[{type: 1}, {type: 2}, {type: 1}, {type: 2}]],
		output: [[{type: 2}, {type: 1}, {type: 1}, {type: 2}]],
		itemList: [{type: 2, pos: 10}]
	});
	network.logout(function(data){
		network.newDefaultLevel(1, jsonLevel,
			function(data) {
				if (data["status"] == 1000) {
					assert.ok( true, "new level ok" );
					network.getDefaultLevelInfo(1,
						function(data) {
							if (data["status"] == 1000)
								assert.ok( data["level_info"] == jsonLevel, "load level ok" );
							else assert.ok( false , data["status"]);
							done();
						}
					);
				}
				else if (data["status"] == 1022) {
					assert.ok( true, "got exist, trying to edit level")
					network.editDefaultLevel(1, jsonLevel,
						function(data) {
							assert.ok( data["status"] == 1000, "edit level ok");
							network.getDefaultLevelInfo(1,
								function(data) {
									if (data["status"] == 1000)
										assert.ok( data["level_info"] == jsonLevel, "load level ok" );
									else assert.ok( false , data["status"]);
									done();
								}
							);
						}
					);
				}
				else assert.ok( false , data["status"]);
			}
		);
	});
});

QUnit.test( "network userinfo test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.login("hq", "sb", 
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "login ok" );
				else assert.ok( false, data["status"]);
				network.getCurrentUserInfo(
					function(data) {
						if (data["status"] == 1000)
							assert.ok( true, "got user info" )
						else assert.ok(false, data["status"]);
						if (data["user_name"] == "hq" && data["email"] == "sb@163.com")
							assert.ok(true, "user info correct");
						else assert.ok(false, JSON.stringify(data));
						network.logout(function(data){});
						done();
					}
				);
			}
		);
	});
});

QUnit.test( "network usermade level test", function( assert ) {
	var done = assert.async();
	var jsonLevel = JSON.stringify({
		blockTypes: [2, 5, 7, 8, 11],
		playerInfo: {pos: 3, dir: 1},
		opFloor: [10, 0, 6],
		input: [[{type: 1}, {type: 2}]],
		output: [[{type: 2}, {type: 2}]],
		itemList: [{type: 2, pos: 10}]
	});
	network.logout(function(data){
		network.login("hq", "sb", 
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "login ok" );
				else assert.ok( false, data["status"]);
				network.newUsermadeLevel(jsonLevel,
					function(data) {
						if (data["status"] == 1000)
							assert.ok( true, "new usermade level success" )
						else assert.ok(false, data["status"]);
						network.getUsermadeLevelInfo(
							function(data) {
								if (data["status"] == 1000)
									assert.ok( data["level_info"] == jsonLevel, "load: " + data["level_info"] );
								else assert.ok( false , data["status"]);
								network.logout(function(data){});
								done();
							}
						);
					}
				);
			}
		);
	});
});

QUnit.test( "network usermade level test extra", function( assert ) {
	var done = assert.async();
	var jsonLevel = JSON.stringify({
		blockTypes: [2, 5, 7, 8, 11],
		playerInfo: {pos: 3, dir: 1},
		opFloor: [10, 0, 6],
		input: [[{type: 1}, {type: 2}]],
		output: [[{type: 2}, {type: 1}]],
		itemList: [{type: 2, pos: 10}]
	});
	network.logout(function(data){
		network.login("hq", "sb", 
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "login ok" );
				else assert.ok( false, data["status"]);
				network.newUsermadeLevel(jsonLevel,
					function(data) {
						if (data["status"] == 1000)
							assert.ok( true, "new usermade level success" )
						else assert.ok(false, data["status"]);
						network.getUsermadeLevelInfo(
							function(data) {
								if (data["status"] == 1000)
									assert.ok( data["level_info"] == jsonLevel, "load: " + data["level_info"] );
								else assert.ok( false , data["status"]);
								network.logout(function(data){});
								done();
							}
						);
					}
				);
			}
		);
	});
});
