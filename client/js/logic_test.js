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
				mp += ["v", ">", "^", "<"][state.hero.dir];
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


function playTest()
{
	logic.doLoad();
	code.doLoad();
	code.setBlockTypes([0, 1, 2, 3, 4]);

	var map = [];
	for (var i = 1; i < 12; i++)
		map.push({address: i, location: i});

	var itemList = [{type: 1, location: 1}, {type: 2, location: 2}, {type: 1, location: 3}];
	var playerInfo = {pos: 0, dir: 0};
	logic.loadLevel(map, itemList, playerInfo);

	var t = document.getElementById("map");
	t.innerHTML = getmp();
}	

function start()
{
	logic.reset();
	code.start();
	var t = document.getElementById("map");
	t.innerHTML = getmp();
}

function step()
{
	logic.step();
	var t = document.getElementById("map");
	t.innerHTML = getmp();
}
