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
