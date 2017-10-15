function Logic()
{

	var invalidOP = function()
	{
		//TODO
	};


	function State()
	{
		var map = new Array([config.mapWidth * config.mapHeight]);
		var positionX = 0, positionY = 0, direction = 0;

		this.moveForward = function()
		{
			switch(direction)
			{
				case 0:
				//down
					if (positionY + 1 < config.mapHeight)
						positionY++;
					else
						invalidOP();
				break;
				case 1:
				//right
					if (positionX + 1 < config.mapWidth)
						positionX++;
					else
						invalidOP();
				break;
				case 2:
				//up
					if (positionY > 0)
						positionY--;
					else
						invalidOP();
				break;
				case 3:
				//left
					if (positionX > 0)
						positionX--;
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
			direction = (direction + dir) % 4;
		}

		this.getX = function()
		{
			return positionX;
		}

		this.getY = function()
		{
			return positionY;
		}

		this.init = function()
		{
			for (var i = 0; i < config.mapHeight; i++)
				for (var j = 0; j < config.mapWidth; j++)
					map[i * mapWidth + j] = 0;
		}
	};

	var currentState = new State();
	//not used now
	var originalState = new State();

	var initMap = function()
	{
		currentState.init();
	};

	this.doLoad = function()
	{
		//TODO
	};

	this.loadLevel = function()
	{
		//tmp test without network
		initMap();
	};

	//function for test
	this.getState = function()
	{
		return {
			x: currentState.getX(),
			y: currentState.getY()
		}
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
		switch (op["typeID"])
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
