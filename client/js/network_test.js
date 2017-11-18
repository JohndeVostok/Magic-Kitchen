QUnit.test( "network register test", function( assert ) {
	var done = assert.async();
	network.logout(function(data){
		network.register("hq", "sb", "sb@163.com",
			function(data) {
				if (data["status"] == msg.getMsgId("Succeeded"))
					assert.ok( true, "register ok" );
				else assert.ok( data["status"] == 1005 , msg.getMessage(data["status"]));
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
				if (data["status"] == msg.getMsgId("Succeeded"))
					assert.ok( true, "login ok" );
				else assert.ok( false, msg.getMessage(data["status"]));
				network.logout(
					function(data) {
						if (data["status"] == msg.getMsgId("Succeeded"))
							assert.ok( true, "logout ok" );
						else assert.ok( false, msg.getMessage(data["status"]));
						done();
					}
				);
			}
		);
	});
});

