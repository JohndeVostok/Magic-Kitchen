QUnit.test( "network register test", function( assert ) {
	var done = assert.async();
	network.register("hq", "sb", "sb@163.com",
		function(data) {
			if (data["status"] == "succeeded")
				assert.ok( true, "register ok" );
			else assert.ok( data["error"] == "this name already exists" , data["error"]);
			done();
		}
	);
});

QUnit.test( "network login test", function( assert ) {
	var done = assert.async();
	network.login("hq", "sb", 
		function(data) {
			if (data["status"] == "succeeded")
				assert.ok( true, "login ok" );
			else assert.ok( false, data["error"]);
			done();
		}
	);
});
