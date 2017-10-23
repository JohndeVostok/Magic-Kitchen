var debug = window.debug;

function Logic()
{

	var opFlag = "none";

	var initOp = function()
	{
		opFlag = "none";
	}

	var invalidOp = function(str)
	{
		opFlag = str;
	};

	function State()
	{
		var player = {pos: 0, dir: 0, haveItem: 0, itemId: 0}
		var itemList = [];
		var map = [];

		this.init = function()
		{
			for (var i = 0; i < config.mapHeight; i++)
				for (var j = 0; j < config.mapWidth; j++)
					map[i * config.mapWidth + j] = {isOpFloor: 0, address: 0, haveItem: 0, itemId: 0};
		};

		this.loadLevel = function(opFloor, itemInList, playerInfo)
		{
			for (var j = 0; j < opFloor.length; j++)
			{
				map[opFloor[j].pos].isOpFloor = 1;
				map[opFloor[j].pos].address = opFloor[j].address;
			}

			$.extend(itemList, itemInList);
			for (var k = 0; k < itemInList.length; k++)
			{
				map[itemInList[k].pos].haveItem = 1;
				map[itemInList[k].pos].itemId = k;
			}
			
			// Load player info.
			player.pos = playerInfo.pos;
			player.dir = playerInfo.dir;
			player.hasItem = 0;
			player.itemId = 0;
		}

		this.render = function()
		{
			var mp = [];
			for (var i in map)
			{
				var floorInfo = map[i];
				if (map[i].isOpFloor)
					mp[i] = 3;
				else
					mp[i] = 0;
			}
			ui.loadMap(mp);
			ui.clearItems();
			for (var i in itemList)
			{
				var item = itemList[i];
				ui.newItem(item.pos, item.type, undefined);
			}
			ui.addPlayerAnimation(player.pos, player.pos, player.dir, player.dir);
		}

		//function for test

	//functions for play

		var getFloor = function()
		{
			var x = player.pos % config.mapWidth, y = Math.floor(player.pos / config.mapWidth);
			switch(player.dir)
			{
				case 0:
				//down
					y++;
				break;
				case 1:
				//right
					x++;
				break;
				case 2:
				//up
					y--;
				break;
				case 3:
				//left
					x--;
				break;
				default:
				//nothing
				break;
			}
			if (x < 0 || x >= config.mapWidth)
				return -1;
			if (y < 0 || y >= config.mapHeight)
				return -1;
			return (y * config.mapWidth + x);
		};

		this.getDir = function()
		{
			return player.dir;
		};

		this.move = function()
		{
			var p = getFloor();
			var q = player.pos;
			if (p == -1)
			{
				invalidOp("It's out!");
				return 0;
			}
			if (map[getFloor()].isOpFloor)
			{
				invalidOp("It's a opFloor!");
				return 0;
			}
			player.pos = getFloor();
			ui.addPlayerAnimation(q, p, player.dir, player.dir);
		};

		this.rotate = function(dir)
		{
			var d = player.dir;
			player.dir = (player.dir + dir) % 4;
			ui.addPlayerAnimation(player.pos, player.pos, d, player.dir);
		};

		this.loadItem = function()
		{
			var p = getFloor();
			if (p == -1)
			{
				invalidOp("It's out!");
				return 0;
			}
			if (!map[p].haveItem)
			{
				invalidOp("Nothing There!");
				return 0;
			}
			if (player.haveItem)
			{
				invalidOp("I have something!");
				return 0;
			}
			player.haveItem = 1;
			map[p].haveItem = 0;
			player.itemId = map[p].itemId;
			map[p].itemId = 0;
			itemList[player.itemId].pos = -1;
			ui.addAnimation(p, -1, undefined);
		}

		this.storeItem = function()
		{
			var p = getFloor();
			if (p == -1)
			{
				invalidOp("It's out!");
				return 0;
			}
			if (map[p].haveItem)
			{
				invalidOp("Something There!");
				return 0;
			}
			if (!player.haveItem)
			{
				invalidOp("I have nothing to store!");
				return 0;
			}
			player.haveItem = 0;
			map[p].haveItem = 1;
			map[p].itemId = player.itemId;
			player.itemId = 0;
			itemList[map[p].itemId].pos = p;
			ui.addAnimation(-1, p, undefined);
		};
	}

//prepare for playing
	
	var currentState = new State();
	var levelInfo;

	
	// Load a level stored in levelInfo, which sets up the map and Blockly.
	// Start a new level, may need grabbing it from server.
	this.loadLevel = function()
	{
		if (config.useFakeLevel)
			initLevel(config.fakeLevelInfo);
		//TODO
		//Ture Level
	};

	this.doLoad = function()
	{
		currentState.init();
	};

	var renderLevel = function()
	{
		currentState.render()
	}

	var initLevel = function(levelInfoIn)
	{
		levelInfo = $.extend(true, levelInfoIn);
		code.setBlockTypes(levelInfo.blockTypes);
		currentState.loadLevel(levelInfo.opFloorList, levelInfo.itemList, levelInfo.playerInfo);
		renderLevel();
	};

	//function for test
	this.test = function()
	{
		return currentState.test();
	}

//play


	var reset = function()
	{
		currentState.loadLevel(levelInfo.opFloorList, levelInfo.itemList, levelInfo.playerInfo);
		renderLevel();
	};

	var stepForward = function()
	{
		initOp();
		currentState.move();
	};

	var rotate = function(dir)
	{
		currentState.rotate(dir);
	};

	var loadItem = function()
	{
		currentState.loadItem();
	};
	var storeItem = function()
	{
		currentState.storeItem();
	};

	var stepWithDir = function(dir)
	{
		var d = (4 + dir - currentState.getDir() % 4);
		currentState.rotate(d);
		currentState.move();
	};

	this.start = function()
	{
		reset();
		code.start();
	}

	this.step = function(op)
	{
		if (op == undefined)
		{
			code.step();
			return;
		}
		switch (op.typeId)
		{
			case 0:
			break;
			case 1:
				stepForward();
			break;
			case 2:
				rotate(op.dir);
			break;
			case 3:
				loadItem();
			break;
			case 4:
				storeItem();
			break;
			case 5:
				stepWithDir(op.dir);
			break;
			default:
			//nothing
			break;
		}
	};


}

var logic = new Logic();
