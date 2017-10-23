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
		var itemList = [];
		var map = [];

		this.init = function()
		{
			for (var i = 0; i < config.mapHeight; i++)
				for (var j = 0; j < config.mapWidth; j++)
					map[i * config.mapWidth + j] = {isOpFloor: 0, address: 0, haveItem: 0, itemId: 0};
		};

		var hero = {pos: 0, dir: 0, haveItem: 0, itemId: 0}

		var getFloor = function()
		{
			var x = hero.pos % config.mapWidth, y = Math.floor(hero.pos / config.mapWidth);
			switch(hero.dir)
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

		this.move = function()
		{
			var p = getFloor();
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
			var originalHeroPos = hero.pos;
			hero.pos = getFloor();
			// Add animation to UI.
			ui.addPlayerAnimation(originalHeroPos, hero.pos, hero.dir, hero.dir);
		};

		this.rotate = function(dir)
		{
			var originalHeroDir = hero.dir;
			hero.dir = (hero.dir + dir) % 4;
			// Add animation to UI.
			ui.addPlayerAnimation(hero.pos, hero.pos, originalHeroDir, hero.dir);
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
			if (hero.haveItem)
			{
				invalidOp("I have something!");
				return 0;
			}
			hero.haveItem = 1;
			map[p].haveItem = 0;
			hero.itemId = map[p].itemId;
			map[p].itemId = 0;
			itemList[hero.itemId].location = -1;
			
			// Add animations.
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
			if (!hero.haveItem)
			{
				invalidOp("I have nothing to store!");
				return 0;
			}
			hero.haveItem = 0;
			map[p].haveItem = 1;
			map[p].itemId = hero.itemId;
			hero.itemId = 0;
			itemList[map[p].itemId].location = p;
			
			// Add animations.
			ui.addAnimation(-1, p, undefined);
		};


		//function for test
		this.test = function()
		{
			return{map: map, hero: hero, itemList: itemList};
		};

		this.loadLevel = function(opFloor, itemInList, playerInfo)
		{
			for (var j = 0; j < opFloor.length; j++)
			{
				map[opFloor[j].location].isOpFloor = 1;
				map[opFloor[j].location].address = opFloor[j].address;
			}

			$.extend(itemList, itemInList);
			for (var k = 0; k < itemInList.length; k++)
			{
				map[itemInList[k].location].haveItem = 1;
				map[itemInList[k].location].itemId = k;
			}
			
			// Load player info.
			hero.pos = playerInfo.pos;
			hero.dir = playerInfo.dir;
			hero.hasItem = 0;
			hero.itemId = 0;
		}
	}

	var currentState = new State();
	var opFloor, itemList;

	var initMap = function(opFloorIn, itemListIn, playerInfo)
	{
		currentState.loadLevel(opFloorIn, itemListIn, playerInfo);
		opFloor = $.extend(true, opFloorIn);
		itemList = $.extend(true, itemListIn);
	};

	this.doLoad = function()
	{
		currentState.init();
	};

	this.loadLevel = function(opFloor, itemList, playerInfo)
	{
		initMap(opFloor, itemList, playerInfo);
	};

	//function for test
	this.test = function()
	{
		return currentState.test();
	}

	this.reset = function()
	{
		currentState.loadLevel(opFloor, itemList);
	};

	var singleStepForward = function()
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
				singleStepForward();
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
			default:
			//nothing
			break;
		}
	};
	
	// Render a logic level's map on UI.
	// See `ui` docs for UI's map specifications.
	var renderMap = function(map)
	{
		var uiMap = [];
		var size = config.mapHeight * config.mapWidth;
		
		// Fill with empty cells.
		for (var i = 0; i < size; i++)
		{
			uiMap[i] = 0;
		}
		
		for (var i in map)
		{
			var e = map[i];
			
			// Currently only table is supported.
			uiMap[e.location] = 3;
		}
		
		ui.loadMap(uiMap);
	};
	
	// Render a logic level's items on UI.
	// The items' specifications are consistent.
	// See `ui` docs for more info.
	var renderItems = function(itemList)
	{
		// Clear all items first.
		ui.clearItems();
		
		for (var i in itemList)
		{
			var item = itemList[i];
			
			// Add a item to UI.
			ui.newItem(item.location, item.type, undefined);
		}
	};
	
	// Render the player state on UI.
	var renderPlayer = function(playerInfo)
	{
		// Add an animation with no position change.
		ui.addPlayerAnimation(playerInfo.pos, playerInfo.pos, playerInfo.dir, playerInfo.dir);
	};
	
	// Load a level stored in levelInfo, which sets up the map and Blockly.
	var loadLevelInfo = function(levelInfo)
	{
		// Set Blockly block types.
		code.setBlockTypes(levelInfo.blockTypes);
		
		// Load level in logic.
		logic.loadLevel(levelInfo.map, levelInfo.itemList, levelInfo.playerInfo);
		
		// Tell UI to render the level.
		renderMap(levelInfo.map);
		renderItems(levelInfo.itemList);
		renderPlayer(levelInfo.playerInfo);
	};
	
	// Start a new level, may need grabbing it from server.
	this.startLevel = function()
	{
		if (config.useFakeLevel)
		{
			// Load a fake level for test.
			loadLevelInfo(config.fakeLevelInfo);
		}
		else
		{
			throw "Not implemented";
		}
	};
}

var logic = new Logic();
