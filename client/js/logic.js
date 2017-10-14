var logic = function()
{
	var stateGen = function()
	{
		var map = new Array(config.mapWidth * config.mapHeight);
		var positionX = 0, positionY = 0, direction = 0;

		var moveForward() = function()
		{
			switch(direction)
			{
				case 0:
				//down
					if (positionY + 1 < config.mapHeight) positionY++; else envalidOp;
				break;
				case 1:
				//right
					if (positionX + 1 < config.mapWidth) positionX++; else envalidOp;
				break;
				case 2:
				//up
					if (positionY > 0) positionY--; else envalidOp;
				break;
				case 3:
				//left
					if (positionX > 0) positionX--; else envalidOp;
				break;
			}
		};

		var rotate = function(dir)
		{
			direction = (direction + dir) % 4;
		}

		return
		{
			map: map;
			positionX: positionX;
			positionY: positionY;
			direction: direction;
			moveForward: moveForward;
			rotate: rotate;
		};
	};

	var currentState = stateGen();
	var originState = stateGen();

	var initMap = function()
	{
		for (var i = 0; i < config.mapWidth; i++) for (var j = 0; j < config.mapHeight; j++) currentState.map[13 * i + j] = 0;
//		ui.loadMap(levelData);
//		ui.loadUserInfo("");
	};

	var doLoad = function()
	{
	};

	var loadLevel = function()
	{
		initMap();//tem test without network
//		network.fetchLevel(initMap);
	};
	
	var reset = function()
	{
	};

	var envalidOP = function()
	{
		console.log("out");
	};

	var singleStepForward = function()
	{
		state.moveForward();
		console.log("fo");
	};

	var rotate = function(dir)
	{
		state.rotate(dir);
		console.log("dir");
	};

	var step = function(op)
	{
		switch (op["typeID"])
		{
			case 0:
			//nop
			break;
			case 1:
			//singleStepForward
				singleStepForward();
			break;
			case 2:
			//rotate
				rotate(op["info"]);
			break;
			case 3:
			//load
			break;
			case 4:
			//store
			break;
		}
	};

	return
	{
		initMap: initMap,
		doLoad: doLoad
	};
}();
