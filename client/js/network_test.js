QUnit.test( "network register test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.register("hq", "sb", "sb@163.com",
			function(data) {
				if (data["status"] == "succeeded")
					assert.ok( true, "register ok" );
				else assert.ok( data["error"] == "this name already exists" , data["error"]);
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
				if (data["status"] == "succeeded")
					assert.ok( true, "login ok" );
				else assert.ok( false, data["error"]);
				network.logout(
					function(data) {
						if (data["status"] == "succeeded")
							assert.ok( true, "logout ok" );
						else assert.ok( false, data["error"]);
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
				if (data["status"] == "succeeded")
					assert.ok( true, "change password attempt ok" );
				else assert.ok( false, data["error"]);
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
				if (data["status"] == "succeeded")
					assert.ok( true, "login ok" );
				else assert.ok( false, data["error"]);
				network.changePasswordAfterLogin(
					"nc",
					function(data) {
						if (data["status"] == "succeeded")
							assert.ok( true, "change password attempt ok" );
						else assert.ok( false, data["error"]);
						network.logout(function(data){
							network.changePasswordAfterLogin(
								"nc",
								function(data) {
									if (data["status"] == "succeeded")
										assert.ok(false, "expected please log in first, got succeeded")
									else assert.ok(data["error"] == "please log in first", "got " + data["error"]);
									network.login("hq", "sb", 
										function(data) {
											if (data["status"] == "succeeded")
												assert.ok(false, "expected wrong password, got succeeded")
											else assert.ok(data["error"] == "wrong password", "got " + data["error"]);
											network.login("hq", "nc", 
												function(data) {
													if (data["status"] == "succeeded")
														assert.ok(true, "change password succeeded")
													else assert.ok(false, data["error"]);
													network.changePasswordAfterLogin(
														"sb",
														function(data) {
															if (data["status"] == "succeeded")
																assert.ok( true, "change password attempt ok" );
															else assert.ok( false, data["error"]);
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

QUnit.test( "network level test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.newDefaultLevel(0, JSON.stringify(config.fakeLevelInfo),
			function(data) {
				if (data["status"] == "succeeded")
					assert.ok( true, "new level ok" );
				else assert.ok( data["error"] == "this level id already exists" , data["error"]);
				network.getLevelInfo(0,
					function(data) {
						if (data["status"] == "succeeded")
							assert.ok( data["level_info"] == JSON.stringify(config.fakeLevelInfo), "load level ok" );
						else assert.ok( false , data["error"]);
						done();
					}
				);
			}
		);
	});
});

QUnit.test( "network level test extra", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.newDefaultLevel(1,
			JSON.stringify({
				blockTypes: [1, 2, 3, 4, 6],
				playerInfo: {pos: 3, dir: 1},
				opFloor: [10, 0, 6],
				input: [[{type: 1}, {type: 2}, {type: 1}, {type: 2}]],
				output: [[{type: 2}, {type: 1}, {type: 1}, {type: 2}]],
				itemList: [{type: 2, pos: 10}]
			}),
			function(data) {
				if (data["status"] == "succeeded")
					assert.ok( true, "new level ok" );
				else assert.ok( data["error"] == "this level id already exists" , data["error"]);
				network.getLevelInfo(1,
					function(data) {
						if (data["status"] == "succeeded")
							assert.ok( data["level_info"] != JSON.stringify(config.fakeLevelInfo), "load level ok" );
						else assert.ok( false , data["error"]);
						done();
					}
				);
			}
		);
	});
});
