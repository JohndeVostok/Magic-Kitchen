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

		var hero = {x: 0, y: 0, dir: 0, haveItem: 0, itemId: 0}

		var valid = function(x, y)
		{
			if (x < 0 || x >= config.mapWidth) return false;
			if (y < 0 || y >= config.mapHeight) return false;
			if (map[y * config.mapWidth + x].isOpFloor == 1) return false;
			return true;
		};

		this.moveForward = function()
		{
			switch(hero.dir)
			{
				case 0:
				//down
					if (valid(hero.x, hero.y + 1))
						hero.y++;
					else
						invalidOp("I can't reach there!");
				break;
				case 1:
				//right
					if (valid(hero.x + 1, hero.y))
						hero.x++;
					else
						invalidOp("I can't reach there!");
				break;
				case 2:
				//up
					if (valid(hero.x, hero.y - 1))
						hero.y--;
					else
						invalidOp("I can't reach there!");
				break;
				case 3:
				//left
					if (valid(hero.x - 1, hero.y))
						hero.x--;
					else
						invalidOp("I can't reach there!");
				break;
				default:
				//nothing
				break;
			}
		};

		this.rotate = function(dir)
		{
			hero.dir = (hero.dir + dir) % 4;
		};

		//function for test
		this.test = function()
		{
			return{map: map, hero: hero};
		};

		this.loadLevel = function(opFloor, itemInList)
		{
			for (var j = 0; j < opFloor.length; j++)
			{
				map[opFloor[j].location].isOpFloor = 1;
				map[opFloor[j].location].address = opFloor[j].address;
			};

			for (var k = 0; k < itemInList.length; k++)
			{
				map[itemInList[k].location].haveItem = 1;
				map[itemInList[k].location].itemId = k;
				itemList[k] = {location: itemInList[k].location, type: itemInList[k].type}
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
		currentState.moveForward();

		console.log(currentState.test().hero);

		if (opFlag != "none")
			console.log(opFlag);
		else
			console.log("Forward!");
	};

	var rotate = function(dir)
	{
		currentState.rotate(dir);
		console.log("I rotated!");
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
