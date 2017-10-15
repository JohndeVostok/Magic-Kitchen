QUnit.test("logic state test", function(assert)
{
	logic.loadLevel([{address: 1, location: 1}, {address: 2, location: 2}, {address: 3, location: 13}], [{type: 1, location: 13}, {type: 1, location: 1}, {type: 1, location: 27}])
	var str = "";
	var map = logic.test();
	for (var i = 0; i < 13; i++)
	{
		for (var j = 0; j < 13; j++)
		{
			str += map[i * 13 + j].address + "" + map[i * 13 + j].itemId + " ";
		}
		str += "\n";
	}
	assert.ok(true, str);
});
