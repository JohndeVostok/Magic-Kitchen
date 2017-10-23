var debug = window.debug;

function Logic()
{

	function Validator()
	{
		var flag = 0;
		var str = ""
		this.init = function()
		{
			flag = 0;
			str = "";
		};
		this.invalid = function(s)
		{
			flag = 1;
			str = s;
		};
		this.validate = function()
		{
			if (flag)
				debug.log(str);
			return flag;
		};
	}

	var validator = new Validator();

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

		this.step = function()
		{
			var p = getFloor();
			var q = player.pos;
			if (p == -1)
			{
				validator.invalid("It's out!");
				return 0;
			}
			if (map[getFloor()].isOpFloor)
			{
				validator.invalid("It's a opFloor!");
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
				validator.invalid("It's out!");
				return 0;
			}
			if (!map[p].haveItem)
			{
				validator.invalid("Nothing There!");
				return 0;
			}
			if (player.haveItem)
			{
				validator.invalid("I have something!");
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
				validator.invalid("It's out!");
				return 0;
			}
			if (map[p].haveItem)
			{
				validator.invalid("Something There!");
				return 0;
			}
			if (!player.haveItem)
			{
				validator.invalid("I have nothing to store!");
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
	
	var state = new State();
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
		state.init();
	};

	var renderLevel = function()
	{
		state.render()
	}

	var initLevel = function(levelInfoIn)
	{
		levelInfo = $.extend(true, levelInfoIn);
		code.setBlockTypes(levelInfo.blockTypes);
		state.loadLevel(levelInfo.opFloorList, levelInfo.itemList, levelInfo.playerInfo);
		renderLevel();
	};

	//function for test
	this.test = function()
	{
		return state.test();
	}

//play


	var reset = function()
	{
		state.loadLevel(levelInfo.opFloorList, levelInfo.itemList, levelInfo.playerInfo);
		renderLevel();
	};

	var stepForward = function()
	{
		validator.init();
		state.step();
		validator.validate();
	};

	var rotate = function(dir)
	{
		validator.init();
		state.rotate(dir);
		validator.validate();
	};

	var loadItem = function()
	{
		validator.init();
		state.loadItem();
		validator.validate();
	};
	var storeItem = function()
	{
		validator.init();
		state.storeItem();
		validator.validate();
	};

	var stepWithDir = function(dir)
	{
		validator.init();
		var d = (4 + dir - state.getDir() % 4);
		state.rotate(d);
		if (validator.validate()) return undefined;
		state.step();
		validator.validate();
	};

	var moveForward = function(step)
	{
		console.log("!!!");
		validator.init();
		for (var i = 0; i < step; i++)
		{
			state.step();
			if (validator.validate()) return undefined;
		}
	};

	var move = function(dir, step)
	{
		console.log("???");
		console.log(dir, step);
		validator.init();
		var d = (4 + dir - state.getDir() % 4);
		state.rotate(d);
		if (validator.validate()) return undefined;
		for (var i = 0; i < step; i++)
		{
			state.step();
			if (validator.validate()) return undefined;
		}
	};

	var moveToPos = function(pos)
	{

	}

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
			case 6:
				moveForward(op.step);
			break;
			case 7:
				move(op.dir, op.step);
			break;
			default:
			//nothing
			break;
		}
	};


}

var logic = new Logic();
