var logic = function()
{
	var mapGen = function()
	{
		map = new Array(169);

	};

	var map = mapGen();
	var originMap = mapGen();

	var initMap = function()
	{
		for (var i = 0; i < 13; i++) for (var j = 0; j < 13; j++) map[13 * i + j] = 0;
	};
	
	var doLoad = function() {};
	
	var reset = function()
	{
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
			break;
			case 2:
			//rotate
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
