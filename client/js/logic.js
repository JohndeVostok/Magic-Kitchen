function Logic()
{

	var invalidOP = function()
	{
		//TODO
	};


	function State()
	{
		var itemList = [];
		var map = [];

		var hero = {x: 0, y: 0, dir: 0, haveItem: 0, itemId: 0}

		this.moveForward = function()
		{
			switch(hero.dir)
			{
				case 0:
				//down
					if (hero.y + 1 < config.mapHeight)
						hero.y++;
					else
						invalidOP();
				break;
				case 1:
				//right
					if (hero.x + 1 < config.mapWidth)
						hero.x++;
					else
						invalidOP();
				break;
				case 2:
				//up
					if (hero.y > 0)
						hero.y--;
					else
						invalidOP();
				break;
				case 3:
				//left
					if (hero.x > 0)
						hero.x--;
					else
						invalidOP();
				break;
				default:
				//nothing
				break;
			}
		};

		this.rotate = function(dir)
		{
			hero.dir = (hero.dir + dir) % 4;
		}

		//function for test
		this.test = function()
		{
			return map;
		}

		this.init = function(opFloor, itemInList)
		{
			for (var i = 0; i < config.mapHeight; i++)
				for (var j = 0; j < config.mapWidth; j++)
					map[i * config.mapWidth + j] = {isOpFloor: 0, address: 0, haveItem: 0, itemId: 0};

			for (var j = 0; j < opFloor.length; j++)
			{
				map[opFloor[j].location].isOpFloor = 1;
				map[opFloor[j].location].address = opFloor[j].address;
			}

			for (var k = 0; k < itemInList.length; k++)
			{
				map[itemInList[k].location].haveItem = 1;
				map[itemInList[k].location].itemId = k;
				itemList[k] = {location: itemInList[k].location, type: itemInList[k].type}
			}
			console.log(itemList);
		}
	};

	var currentState = new State();
	var originalState = new State();

	var initMap = function(opFloor, itemList)
	{
		currentState.init(opFloor, itemList);
		originalState.init(opFloor, itemList);
	};

	this.doLoad = function()
	{
		//TODO
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

	var reset = function()
	{
		//TODO
	};

	var singleStepForward = function()
	{
		currentState.moveForward();
	};

	var rotate = function(dir)
	{
		currentState.rotate(dir);
	};

	this.step = function(op)
	{
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
			//load
			break;
			case 4:
			//store
			break;
			default:
			//nothing
			break;
		}
	};
};

var logic = new Logic();
