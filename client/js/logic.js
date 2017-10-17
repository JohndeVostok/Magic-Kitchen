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
			if (x < 0 || x >= config.mapWidth) return -1;
			if (y < 0 || y >= config.mapHeight) return -1;
			return (y * config.mapWidth + x);
		};

		this.move = function()
		{
			var p = getFloor();
			if (p == -1)
			{
				invalidOp("It's out!");
				return 0;
			};
			if (map[getFloor()].isOpFloor)
			{
				invalidOp("It's a opFloor!");
				return 0;
			};
			hero.pos = getFloor();
		};

		this.rotate = function(dir)
		{
			hero.dir = (hero.dir + dir) % 4;
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
		};


		//function for test
		this.test = function()
		{
			return{map: map, hero: hero, itemList: itemList};
		};

		this.loadLevel = function(opFloor, itemInList)
		{
			for (var j = 0; j < opFloor.length; j++)
			{
				map[opFloor[j].location].isOpFloor = 1;
				map[opFloor[j].location].address = opFloor[j].address;
			};

			$.extend(itemList, itemInList);
			for (var k = 0; k < itemInList.length; k++)
			{
				map[itemInList[k].location].haveItem = 1;
				map[itemInList[k].location].itemId = k;
			};
		}
	};

	var currentState = new State();
	var originalState = new State();

	var initMap = function(opFloor, itemList)
	{
		currentState.loadLevel(opFloor, itemList);
		originalState.loadLevel(opFloor, itemList);
	};

	this.doLoad = function()
	{
		currentState.init();
		originalState.init();
		//code.init();
		//ui.loadLevel();
	};

	this.loadLevel = function(opFloor, itemList)
	{
		//tmp test without network
		initMap(opFloor, itemList);
	};

	//function for test
	this.test = function()
	{
		return currentState.test();
	}

	this.reset = function()
	{
		$.extend(currentState, originalState);
		//ui.loadLevel();
		console.log("The world changed!");
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
		code.step();
		switch (op["typeId"])
		{
			case 0:
			break;
			case 1:
				singleStepForward();
			break;
			case 2:
				rotate(op["dir"]);
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
		if (opFlag != "none")
			console.log(opFlag);
	};
};

var logic = new Logic();
