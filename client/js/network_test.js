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
	network.logout(function(data){
		network.newDefaultLevel(0, JSON.stringify(config.fakeLevelInfo),
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "new level ok" );
				else assert.ok( data["status"] == 1022 , data["status"]);
				network.getLevelInfo(0,
					function(data) {
						if (data["status"] == 1000)
							assert.ok( data["level_info"] == JSON.stringify(config.fakeLevelInfo), "load level ok" );
						else assert.ok( false , data["status"]);
						done();
					}
				);
			}
		);
	});
});

QUnit.test( "network default level test extra", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.newDefaultLevel(1,
			JSON.stringify({
				blockTypes: [2, 5, 7, 8, 11],
				playerInfo: {pos: 3, dir: 1},
				opFloor: [10, 0, 6],
				input: [[{type: 1}, {type: 2}, {type: 1}, {type: 2}]],
				output: [[{type: 2}, {type: 1}, {type: 1}, {type: 2}]],
				itemList: [{type: 2, pos: 10}]
			}),
			function(data) {
				if (data["status"] == 1000)
					assert.ok( true, "new level ok" );
				else assert.ok( data["status"] == 1022 , data["status"]);
				network.getLevelInfo(1,
					function(data) {
						if (data["status"] == 1000)
							assert.ok( data["level_info"] != JSON.stringify(config.fakeLevelInfo), "load level ok" );
						else assert.ok( false , data["status"]);
						done();
					}
				);
			}
		);
	});
});
