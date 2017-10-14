QUnit.test( "logic step test", function( assert ) {
	var done = assert.async();
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 1});
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 1});
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 1});
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 2});
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 3});
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 3});
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 3});
	for (var i = 0; i < 13; i++) logic.step({"typeID" : 1});
	
	assert.ok((logic.getState().y == 0 && logic.getState().y == 0), logic.getState().x + " " + logic.getState().y);
});
