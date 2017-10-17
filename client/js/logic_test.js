QUnit.test("logic state test", function(assert)
{
	logic.doLoad();

	var map = [];
	for (var i = 1; i < 12; i++)
		map.push({address: i, location: i});

	var itemList = [{type: 1, location: 1}, {type: 2, location: 2}, {type: 1, location: 3}];
	logic.loadLevel(map, itemList);

	function getmp()
	{
		var mp = "";
		state = logic.test();
		for (var i = 0; i < 13; i++)
		{
			mp += "<p>";
			for (var j = 0; j < 13; j++)
			{
				if (i * 13 + j == state.hero.pos)
				{
					mp += "x";
					if (state.hero.haveItem)
						mp += state.itemList[state.hero.itemId].type + "  ";
					else
						mp += "0  ";
				}
				else
				{
					mp += state.map[13 * i + j].isOpFloor + "";
					if (state.map[13 * i + j].haveItem == 1)
						mp += state.itemList[state.map[13 * i + j].itemId].type + "  ";
					else
						mp += "0  ";
				}
			}
			mp += "</p>";
		}
		return mp;
	}

	document.write("<div id = 'map'></div>");
	var t = document.getElementById("map");
	t.innerHTML = getmp();

	$('body').bind('keypress',getKeyCode);

	function getKeyCode(e)
	{
		var evt = e || window.event;
		var keyCode = evt.keyCode || evt.which || evt.charCode;
		if (keyCode == 49) logic.step({typeId: 1});
		if (keyCode == 50) logic.step({typeId: 2, dir: 1});
		if (keyCode == 51) logic.step({typeId: 2, dir: 3});
		if (keyCode == 52) logic.step({typeId: 3});
		if (keyCode == 53) logic.step({typeId: 4});
		t.innerHTML = getmp();
	}
	assert.ok(true, "");
});
