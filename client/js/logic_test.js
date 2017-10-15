QUnit.test( "logic step test", function( assert )
{
	for (var i1 = 0; i1 < 13; i1++)
		logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 1});
	for (var i2 = 0; i2 < 13; i2++)
		logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 1});
	for (var i3 = 0; i3 < 13; i3++)
		logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 1});
	for (var i4 = 0; i4 < 13; i4++)
		logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 2});
	for (var i5 = 0; i5 < 13; i5++)
		logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 3});
	for (var i6 = 0; i6 < 13; i6++)
		logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 3});
	for (var i7 = 0; i7 < 13; i7++)
		logic.step({"typeID" : 1});
	logic.step({"typeID": 2, "dir": 3});
	for (var i8 = 0; i8 < 13; i8++)
		logic.step({"typeID" : 1});
	
	assert.ok((logic.getState().x == 0 && logic.getState().y == 0), logic.getState().x + " " + logic.getState().y);
});
