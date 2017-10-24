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
		var opFloor = [];
		var map = [];

		this.init = function()
		{
			for (var i = 0; i < config.mapHeight; i++)
				for (var j = 0; j < config.mapWidth; j++)
					map[i * config.mapWidth + j] = {isOpFloor: 0, address: 0, haveItem: 0, itemId: 0};
		};

		this.loadLevel = function(opFloorIn, itemListIn, playerInfo)
		{
			player.pos = playerInfo.pos;
			player.dir = playerInfo.dir;
			player.hasItem = 0;
			player.itemId = 0;

			opFloor = $.extend(true, [], opFloorIn);
			for (var i = 0; i < opFloor.length; i++)
			{
				map[opFloor[i]].isOpFloor = 1;
				map[opFloor[i]].address = i;
			}

			itemList = $.extend(true, [], itemListIn);
			for (var i = 0; i < itemList.length; i++)
			{
				map[itemList[i].pos].haveItem = 1;
				map[itemList[i].pos].itemId = i;
			}
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

		var getFront = function()
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

		this.getPlayer = function()
		{
			return player;
		};

		this.checkTarget = function(x, y)
		{
			if (x < 0 || x >= config.mapWidth || y < 0 || y >= config.mapHeight)
			{
				validator.invalid("Target is out!");
				return undefined;
			}
			var pos = y * config.mapWidth + x;
			if (map[pos].isOpFloor)
			{
				validator.invalid("Target is opFloor!");
				return undefined;
			}
		};

		this.checkFloor = function(x, y)
		{
			if (x < 0 || x >= config.mapWidth || y < 0 || y >= config.mapHeight)
				return 1;
			var pos = y * config.mapWidth + x;
			if (map[pos].isOpFloor)
				return 2;
			return 0;
		};

		this.checkLoad = function(pos)
		{
			if (!map[pos].haveItem)
			{
				validator.invalid("Nothing There!");
				return 0;
			}
			if (player.haveItem)
			{
				validator.invalid("I have something!");
				return 0;
			}
			return 1;
		};

		this.checkStore = function(pos)
		{
			if (map[pos].haveItem)
			{
				validator.invalid("Something There!");
				return 0;
			}
			if (!player.haveItem)
			{
				validator.invalid("I have nothing to store!");
				return 0;
			}
			return 1;
		};

		this.getFloor = function(address)
		{
			if (address >= opFloor.length)
			{
				validator.invalid("Address doesn't exist.");
				return undefined;
			}
			var ans = $.extend(true, map[opFloor[address]], {pos: opFloor[address]});
			return ans;
		}

		this.step = function()
		{
			var p = getFront();
			var q = player.pos;
			if (p == -1)
			{
				validator.invalid("It's out!");
				return undefined;
			}
			if (map[getFront()].isOpFloor)
			{
				validator.invalid("It's a opFloor!");
				return undefined;
			}
			player.pos = getFront();
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
			var p = getFront();
			if (p == -1)
			{
				validator.invalid("It's out!");
				return undefined;
			}
			if (!this.checkLoad(p))
				return undefined;
			player.haveItem = 1;
			map[p].haveItem = 0;
			player.itemId = map[p].itemId;
			map[p].itemId = 0;
			itemList[player.itemId].pos = -1;
			ui.addAnimation(p, -1, undefined);
		}

		this.storeItem = function()
		{
			var p = getFront();
			if (p == -1)
			{
				validator.invalid("It's out!");
				return undefined;
			}
			if (!this.checkStore(p))
				return undefined;
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
	this.doLoad = function()
	{
		state.init();
	};

	this.loadLevel = function()
	{
		if (config.useFakeLevel)
			initLevel(config.fakeLevelInfo);
		//TODO
		//Ture Level
		else
		{
		}
	};

	var renderLevel = function()
	{
		state.render()
	}

	var initLevel = function(levelInfoIn)
	{
		levelInfo = $.extend(true, levelInfoIn);
		code.setBlockTypes(levelInfo.blockTypes);
		state.loadLevel(levelInfo.opFloor, levelInfo.itemList, levelInfo.playerInfo);
		renderLevel();
	};

	//function for test
	this.test = function()
	{
		return state.test();
	}

//function for playing
	var reset = function()
	{
		state.loadLevel(levelInfo.opFloor, levelInfo.itemList, levelInfo.playerInfo);
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
		var d = (4 + dir - state.getPlayer().dir % 4);
		state.rotate(d);
		if (validator.validate()) return undefined;
		state.step();
		validator.validate();
	};

	var moveForward = function(step)
	{
		validator.init();
		for (var i = 0; i < step; i++)
		{
			state.step();
			if (validator.validate()) return undefined;
		}
	};

	var move = function(dir, step)
	{
		validator.init();
		var d = (4 + dir - state.getPlayer().dir % 4);
		state.rotate(d);
		if (validator.validate()) return undefined;
		for (var i = 0; i < step; i++)
		{
			state.step();
			if (validator.validate()) return undefined;
		}
	};

	var moveToPos = function(tx, ty)
	{
		validator.init();
		state.checkTarget(tx, ty);
		if (validator.validate()) return undefined;
		var mp = [];
		for (var i = 0; i < config.mapWidth; i++)
			for (var j = 0; j < config.mapHeight; j++)
				if (state.checkFloor(i, j))
					mp[j * config.mapWidth + i] = -1;
		var x = state.getPlayer().pos % config.mapWidth, y = Math.floor(state.getPlayer().pos / config.mapWidth);
		mp[y * config.mapWidth + x] = 1;
		var q = [];
		var l = 0, r = 1;
		q[0] = {pos: y * config.mapWidth + x, f: -1};
		while (l < r)
		{
			x = q[l].pos % config.mapWidth;
			y = Math.floor(q[l].pos / config.mapHeight);

			if (x == tx && y == ty) break;
			
			y++;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			y--;
			x++;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			x--;
			y--;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			y++;
			x--;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			x++;
			l++;
		}
		var p = []
		while (l != -1)
		{
			p.unshift(q[l].pos);
			l = q[l].f;
		}
		for (var i = 1; i < p.length; i++)
		{
			var d = state.getPlayer().dir;
			switch(p[i] - p[i - 1])
			{
				case -config.mapWidth:
					state.rotate((6 - d) % 4);
				break;
				case -1:
					state.rotate((7 - d) % 4);
				break;
				case 1:
					state.rotate((5 - d) % 4);
				break;
				case config.mapWidth:
					state.rotate((4 - d) % 4);
				break;
				default:
				//nothing
				break;
			}
			state.step();
		}
	}

	var load = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;
		state.checkLoad(f.pos);
		if (validator.validate())
			return undefined;

		var mp = [];
		for (var i = 0; i < config.mapWidth; i++)
			for (var j = 0; j < config.mapHeight; j++)
				if (state.checkFloor(i, j))
					mp[j * config.mapWidth + i] = -1;
		var x = state.getPlayer().pos % config.mapWidth, y = Math.floor(state.getPlayer().pos / config.mapWidth);
		mp[y * config.mapWidth + x] = 1;
		var q = [];
		var l = 0, r = 1;
		q[0] = {pos: y * config.mapWidth + x, f: -1};
		while (l < r)
		{
			x = q[l].pos % config.mapWidth;
			y = Math.floor(q[l].pos / config.mapHeight);

			
			y++;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			y--;
			x++;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			x--;
			y--;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			y++;
			x--;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			x++;
			l++;
		}
		var p = []
		while (l != -1)
		{
			p.unshift(q[l].pos);
			l = q[l].f;
		}
		for (var i = 1; i < p.length; i++)
		{
			var d = state.getPlayer().dir;
			switch(p[i] - p[i - 1])
			{
				case -config.mapWidth:
					state.rotate((6 - d) % 4);
				break;
				case -1:
					state.rotate((7 - d) % 4);
				break;
				case 1:
					state.rotate((5 - d) % 4);
				break;
				case config.mapWidth:
					state.rotate((4 - d) % 4);
				break;
				default:
				//nothing
				break;
			}
			state.step();
		}
		var d = state.getPlayer().dir;
		switch(f.pos - p[p.length - 1])
		{
			case -config.mapWidth:
				state.rotate((6 - d) % 4);
			break;
			case -1:
				state.rotate((7 - d) % 4);
			break;
			case 1:
				state.rotate((5 - d) % 4);
			break;
			case config.mapWidth:
				state.rotate((4 - d) % 4);
			break;
			default:
			//nothing
			break;
		}
		state.loadItem();
	}

	var store = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;
		state.checkStore(f.pos);
		if (validator.validate())
			return undefined;

		var mp = [];
		for (var i = 0; i < config.mapWidth; i++)
			for (var j = 0; j < config.mapHeight; j++)
				if (state.checkFloor(i, j))
					mp[j * config.mapWidth + i] = -1;
		var x = state.getPlayer().pos % config.mapWidth, y = Math.floor(state.getPlayer().pos / config.mapWidth);
		mp[y * config.mapWidth + x] = 1;
		var q = [];
		var l = 0, r = 1;
		q[0] = {pos: y * config.mapWidth + x, f: -1};
		while (l < r)
		{
			x = q[l].pos % config.mapWidth;
			y = Math.floor(q[l].pos / config.mapHeight);

			
			y++;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			y--;
			x++;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			x--;
			y--;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			y++;
			x--;
			if (state.checkFloor(x, y) == 2 && y * config.mapWidth + x == f.pos) break;
			if (!state.checkFloor(x, y) && !mp[y * config.mapWidth + x])
			{
				mp[y * config.mapWidth + x] = mp[q[l].pos] + 1;
				q[r++] = {pos: y * config.mapWidth + x, f: l};
			}
			x++;
			l++;
		}
		var p = []
		while (l != -1)
		{
			p.unshift(q[l].pos);
			l = q[l].f;
		}
		for (var i = 1; i < p.length; i++)
		{
			var d = state.getPlayer().dir;
			switch(p[i] - p[i - 1])
			{
				case -config.mapWidth:
					state.rotate((6 - d) % 4);
				break;
				case -1:
					state.rotate((7 - d) % 4);
				break;
				case 1:
					state.rotate((5 - d) % 4);
				break;
				case config.mapWidth:
					state.rotate((4 - d) % 4);
				break;
				default:
				//nothing
				break;
			}
			state.step();
		}
		var d = state.getPlayer().dir;
		switch(f.pos - p[p.length - 1])
		{
			case -config.mapWidth:
				state.rotate((6 - d) % 4);
			break;
			case -1:
				state.rotate((7 - d) % 4);
			break;
			case 1:
				state.rotate((5 - d) % 4);
			break;
			case config.mapWidth:
				state.rotate((4 - d) % 4);
			break;
			default:
			//nothing
			break;
		}
		state.storeItem();
	}

//functions for UI

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
			case 8:
				moveToPos(op.x, op.y);
			break;
			case 9:
				load(op.address);
			break;
			case 10:
				store(op.address);
			break;
			default:
			//nothing
			break;
		}
	};
}

var logic = new Logic();
