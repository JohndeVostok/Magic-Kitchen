QUnit.test("logic state test", function(assert)
{
	logic.doLoad();

	var map = [];
	for (var i = 1; i < 12; i++)
		map.push({address: i, location: i});

	var itemList = [{type: 1, location: 13}, {type: 1, location: 1}, {type: 1, location: 27}];
	logic.loadLevel(map, itemList);

	var mp = "";
	state = logic.test();

	for (var i = 0; i < 13; i++)
	{
		mp += "<p>";
		for (var j = 0; j < 13; j++)
		{
			if (i == state.hero.y && j == state.hero.x)
				mp += "x0  ";
			else
				mp += state.map[13*i + j].isOpFloor + "" + state.map[13 * i + j].itemId + "  ";
		}
		mp += "</p>";
	}
	
	document.write("<div id = 'map'></div>");
	var t = document.getElementById("map");
	t.innerHTML = mp;

	$('body').bind('keypress',getKeyCode);

	function getKeyCode(e)
	{
		var evt = e || window.event;
		var keyCode = evt.keyCode || evt.which || evt.charCode;
		if (keyCode == 49) logic.step({typeId: 1});
		if (keyCode == 50) logic.step({typeId: 2, dir: 1});
		mp = "";
		state = logic.test();
	
		for (var i = 0; i < 13; i++)
		{
			mp += "<p>";
			for (var j = 0; j < 13; j++)
			{
				if (i == state.hero.y && j == state.hero.x)
					mp += "x0  ";
				else
					mp += state.map[13*i + j].isOpFloor + "" + state.map[13 * i + j].itemId + "  ";
			}
			mp += "</p>";
		}
		t.innerHTML = mp;
	}
	assert.ok(true, "");
});
