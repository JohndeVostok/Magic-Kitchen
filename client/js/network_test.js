QUnit.test( "network register test", function( assert ) {
	network.logout(function(data){});
	var done = assert.async();
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

QUnit.test( "network login & logout test", function( assert ) {
	network.logout(function(data){});
	var done = assert.async();
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

QUnit.test( "network change password by email test", function( assert ) {
	network.logout(function(data){});
	var done = assert.async();
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
