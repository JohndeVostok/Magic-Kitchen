var debug = window.debug;
var ui = window.ui;
var code = window.code;
var msg = window.msg;

function Logic()
{
	function Validator()
	{
		var flag = 0;
		var msgId = 3000;
		this.init = function()
		{
			flag = 0;
			msgId = 3000;
		};
		this.invalid = function(id)
		{
			flag = 1;
			msgId = id;
		};
		this.validate = function()
		{
			if (flag)
				ui.blockStep(msg.getMessage(msgId));
			return flag;
		};
	}

	var validator = new Validator();

	function User()
	{
		var status = false;
		var username = "";
		var content = "";
		var levelId = 0;

		this.status = function()
		{
			return status;
		}

		this.login = function(usernameIn)
		{
			status = true;
			username = usernameIn;
			editLevel = "";
		};

		this.logout = function()
		{
			status = false;
			username = "";
		}

		this.editContent = function(str)
		{
			content = str;
		}

		this.getContent = function()
		{
			return content;
		};

		this.setLevelId = function(id)
		{
			levelId = id;
		};

		this.getLevelId = function()
		{
			return levelId;
		};
	}

	var user = new User();

	function State()
	{
		var player = {pos: 0, dir: 0, haveItem: 0, itemId: 0}
		var itemList = [];
		var opFloor = [];
		var input = [], output = [];
		var map = [];

		this.init = function()
		{
			for (let i = 0; i < config.mapHeight; i++)
				for (let j = 0; j < config.mapWidth; j++)
					map[i * config.mapWidth + j] = {isOpFloor: 0, address: 0, haveItem: 0, itemId: 0};
		};

		this.loadLevel = function(levelInfo)
		{
			this.init();
			player.pos = levelInfo.playerInfo.pos;
			player.dir = levelInfo.playerInfo.dir;
			player.haveItem = 0;
			player.itemId = 0;

			opFloor = $.extend(true, [], levelInfo.opFloor);
			for (let i = 0; i < opFloor.length; i++)
			{
				map[opFloor[i]].isOpFloor = 1;
				map[opFloor[i]].address = i;
			}

			itemList = $.extend(true, [], levelInfo.itemList);
			for (let i = 0; i < itemList.length; i++)
			{
				map[itemList[i].pos].haveItem = 1;
				map[itemList[i].pos].itemId = i;
			}

			input = $.extend(true, [], levelInfo.input);
			output = $.extend(true, [], levelInfo.output);
		}

		this.render = function()
		{
			var mp = [];
			for (let i = 0; i < map.length; i++)
			{
				if (map[i].isOpFloor)
				{
					switch (map[i].address)
					{
						case opFloor.length - 1:
							mp[i] = 1;
						break;
						case opFloor.length - 2:
							mp[i] = 2;
						break;
						default:
							mp[i] = 3;
						break;
					}
				}
				else
					mp[i] = 0;
			}
			ui.loadMap(mp);
			for (let i = 0; i < map.length; i++)
				if (map[i].isOpFloor && map[i].address < opFloor.length - 2)
					ui.setMapGridValue(i, map[i].address);
			ui.clearItems();
			for (let i = 0; i < itemList.length; i++)
			{
				var item = itemList[i];
				ui.newItem(item.pos, item.type, undefined);
				if (item.type == 1)
					ui.setItemValue(item.pos, item.value);
			}
			ui.addPlayerAnimation(player.pos, player.pos, player.dir, player.dir);
			ui.setInput(input[0]);
			ui.setOutput(output[0]);
		}

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

		var checkFloor = function(x, y)
		{
			if (x < 0 || x >= config.mapWidth || y < 0 || y >= config.mapHeight)
				return 1;
			var pos = y * config.mapWidth + x;
			if (map[pos].isOpFloor)
				return 2;
			return 0;
		};

		var itemEqual = function(itemA, itemB)
		{
			if (itemA.type == itemB.type)
			{
				if (itemA.type == 1)
				{
					if (itemA.value == itemB.value)
						return 1;
					else
						return 0;
				}
				else
					return 1;
			}
			else
				return 0;
		}

		this.getPlayer = function()
		{
			return player;
		};

		this.checkTarget = function(x, y)
		{
			if (x < 0 || x >= config.mapWidth || y < 0 || y >= config.mapHeight)
			{
				validator.invalid(3001);
				return undefined;
			}
			var pos = y * config.mapWidth + x;
			if (map[pos].isOpFloor)
			{
				validator.invalid(3002);
				return undefined;
			}
		};

		this.checkAddress = function(address)
		{
			if (address >= opFloor.length || address < 0)
				return 0;
			if (address == opFloor.length - 1)
				return 2;
			if (address == opFloor.length - 2)
				return 3;
			if (address < opFloor.length - 2)
				return 1;
		};

		this.checkLoad = function(pos)
		{
			if (player.haveItem)
			{
				validator.invalid(3012);
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(3011);
				return 0;
			}

			if (!map[pos].haveItem)
			{
				if (map[pos].address == opFloor.length - 1)
				{
					if (input[0].length)
						return 1;
					else
						validator.invalid(3014);
				}
				else
					validator.invalid(3013);
				return 0;
			}
			return 1;
		};

		this.checkStore = function(pos)
		{
			if (!player.haveItem)
			{
				validator.invalid(3015);
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(3011);
				return 0;
			}

			if (map[pos].haveItem)
			{
				validator.invalid(3016);
				return 0;
			}

			if (map[pos].address == opFloor.length - 2)
			{
				if (output[0].length == 0)
				{
					validator.invalid(3018);
					return 0;
				}
				if (!itemEqual(itemList[player.itemId], output[0][0]))
				{
					validator.invalid(3018);
					return 0;
				}
			}

			if (map[pos].address == opFloor.length - 1)
			{
				validator.invalid(3017);
				return 0;
			}
			return 1;
		};

		this.checkLoadPaper = function(pos)
		{
			if (player.haveItem && itemList[player.itemId].type != 1)
			{
				validator.invalid(3021);
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(3011);
				return 0;
			}

			if (!map[pos].haveItem)
			{
				validator.invalid(3022);
				return 0;
			}
			if (itemList[map[pos].itemId].type != 1)
			{
				validator.invalid(3022);
				return 0;
			}
			return 1;
		};

		this.checkStorePaper = function(pos)
		{
			if (!player.haveItem || itemList[player.itemId].type != 1)
			{
				validator.invalid(3023);
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(3011);
				return 0;
			}

			if (map[pos].haveItem && itemList[map[pos].itemId].type != 1)
			{
				validator.invalid(3024);
				return 0;
			}
			return 1;
		};

		this.checkOperatePaper = function(pos)
		{
			if (!player.haveItem || itemList[player.itemId].type != 1)
			{
				validator.invalid(3023);
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(3011);
				return 0;
			}

			if (!map[pos].haveItem || itemList[map[pos].itemId].type != 1)
			{
				validator.invalid(3025);
				return 0;
			}
			return 1;
		};

		this.checkFinished = function()
		{
			return (output[0].length == 0);
		};

		this.getFloor = function(address)
		{
			if (this.checkAddress(address) != 1)
			{
				validator.invalid(3003);
				return undefined;
			}
			return $.extend(true, {}, map[opFloor[address]], {pos: opFloor[address]});
		}

		this.getInbox = function()
		{
			return $.extend(true, {}, map[opFloor[opFloor.length - 1]], {pos: opFloor[opFloor.length - 1]});
		}

		this.getOutbox = function()
		{
			return $.extend(true, {}, map[opFloor[opFloor.length - 2]], {pos: opFloor[opFloor.length - 2]});
		}

		this.route = function(tp)
		{
			var tx = tp % config.mapWidth, ty = Math.floor(tp / config.mapWidth);
			var mp = [];
			for (let i = 0; i < config.mapWidth; i++)
				for (let j = 0; j < config.mapHeight; j++)
					if (checkFloor(i, j))
						mp[j * config.mapWidth + i] = -1;
					else
						mp[j * config.mapWidth + i] = 0;

			var pos = player.pos;
			var x, y;
			mp[pos] = 1;
			var q = [];
			var l = 0, r = 1, flag = 0;
			q[0] = {pos: pos, f: -1};
			while (l < r)
			{
				pos = q[l].pos;
				x = pos % config.mapWidth;
				y = Math.floor(pos / config.mapHeight);

				for (let i = 0; i < config.offset.length; i++)
				{
					x += config.offset[i].x;
					y += config.offset[i].y;
					if (x == tx && y == ty)
					{
						flag = 1;
						break;
					}
					if (!checkFloor(x, y) && !mp[y * config.mapWidth + x])
					{
						mp[y * config.mapWidth + x] = mp[pos] + 1;
						q[r++] = {pos: y * config.mapWidth + x, f: l};
					}
					x -= config.offset[i].x;
					y -= config.offset[i].y;
				}
				if (flag)
					break;
				l++;
			}
			var p = [];
			var opList = [];
			while (l != -1)
			{
				p.unshift(q[l].pos);
				l = q[l].f;
			}
			p.push(ty * config.mapWidth + tx);
			var d = player.dir;
			for (let i = 1; i < p.length; i++)
			{
				switch(p[i] - p[i - 1])
				{
					case -config.mapWidth:
						if (d != 2)
						{
							opList.push({op: "r", dir: (6 - d) % 4});
							d = 2;
						}
					break;
					case -1:
						if (d != 3)
						{
							opList.push({op: "r", dir: (7 - d) % 4});
							d = 3;
						}
					break;
					case 1:
						if (d != 1)
						{
							opList.push({op: "r", dir: (5 - d) % 4});
							d = 1;
						}
					break;
					case config.mapWidth:
						if (d != 0)
						{
							opList.push({op: "r", dir: (4 - d) % 4});
							d = 0;
						}
					break;
					default:
					//nothing
					break;
				}
				opList.push({op: "s"});
			}
			opList.pop();
			return opList;
		};

		this.step = function()
		{
			var p = getFront();
			var q = player.pos;
			if (p == -1)
			{
				validator.invalid(3001);
				return undefined;
			}
			if (map[getFront()].isOpFloor)
			{
				validator.invalid(3002);
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
				validator.invalid(3001);
				return undefined;
			}
			if (!this.checkLoad(p))
				return undefined;

			if (map[p].address == opFloor.length - 1)
			{
				player.haveItem = 1;
				itemList.push($.extend(true, {}, input[0].shift(), {pos: -1}));
				player.itemId = itemList.length - 1;
				ui.setInput(input[0]);
				ui.newItem(p, itemList[itemList.length - 1].type, undefined);
				if (itemList[itemList.length - 1].type == 1)
					ui.setItemValue(p, itemList[itemList.length - 1].value);
				ui.addAnimation(p, -1, undefined);
			}
			else
			{
				player.haveItem = 1;
				map[p].haveItem = 0;
				player.itemId = map[p].itemId;
				map[p].itemId = 0;
				itemList[player.itemId].pos = -1;
				ui.addAnimation(p, -1, undefined);
			}
		}

		this.storeItem = function()
		{
			var p = getFront();
			if (p == -1)
			{
				validator.invalid(3001);
				return undefined;
			}
			if (!this.checkStore(p))
				return undefined;


			if (map[p].address == opFloor.length - 2)
			{
				player.haveItem = 0;
				itemList[player.itemId].pos = -2;
				player.itemId = 0;
				output[0].shift();
				ui.addAnimation(-1, p, undefined);
				ui.deleteItem(p, undefined);
				ui.setOutput(output[0]);
			}
			else
			{
				player.haveItem = 0;
				map[p].haveItem = 1;
				map[p].itemId = player.itemId;
				player.itemId = 0;
				itemList[map[p].itemId].pos = p;
				ui.addAnimation(-1, p, undefined);
			}
		};

		this.loadPaper = function()
		{
			var p = getFront();

			if (player.haveItem == 0)
			{
				player.haveItem = 1;
				player.itemId = itemList.length;
				itemList.push($.extend(true, {}, itemList[map[p].itemId], {pos: -1}));
				ui.addAnimation(p, -1, undefined);
				ui.newItem(p, 1, undefined);
				ui.setItemValue(p, itemList[map[p].itemId].value);
			}
			else
			{
				itemList[player.itemId].value = itemList[map[p].itemId].value;
				ui.deleteItem(-1, undefined);
				ui.addAnimation(p, -1, undefined);
				ui.newItem(p, 1, undefined);
				ui.setItemValue(p, itemList[map[p].itemId].value);
			}
		};

		this.storePaper = function()
		{
			var p = getFront();

			if (map[p].haveItem == 0)
			{
				map[p].haveItem = 1;
				map[p].itemId = itemList.length;
				itemList.push($.extend(true, {}, itemList[player.itemId], {pos: p}));
				ui.addAnimation(-1, p, undefined);
				ui.newItem(-1, 1, undefined);
				ui.setItemValue(-1, itemList[player.itemId].value);
			}
			else
			{
				itemList[map[p].itemId].value = itemList[player.itemId].value;
				ui.deleteItem(p, undefined);
				ui.addAnimation(-1, p, undefined);
				ui.newItem(-1, 1, undefined);
				ui.setItemValue(-1, itemList[player.itemId].value);
			}
		};
		
		this.addPaper = function()
		{
			var p = getFront();
			itemList[player.itemId].value = itemList[player.itemId].value + itemList[map[p].itemId].value;
			ui.deleteItem(p, undefined);
			ui.addAnimation(-1, p, undefined);
			ui.addAnimation(p, -1, undefined);
			ui.newItem(p, 1, undefined);
			ui.setItemValue(p, itemList[map[p].itemId].value);
			ui.setItemValue(-1, itemList[player.itemId].value);
		};

		this.subPaper = function()
		{
			var p = getFront();
			itemList[player.itemId].value = itemList[player.itemId].value - itemList[map[p].itemId].value;
			ui.deleteItem(p, undefined);
			ui.addAnimation(-1, p, undefined);
			ui.addAnimation(p, -1, undefined);
			ui.newItem(p, 1, undefined);
			ui.setItemValue(p, itemList[map[p].itemId].value);
			ui.setItemValue(-1, itemList[player.itemId].value);
		};

		this.incPaper = function()
		{
			var p = getFront();
			itemList[map[p].itemId].value++;
			ui.setItemValue(p, itemList[map[p].itemId].value);
			this.loadPaper();
		};

		this.decPaper = function()
		{
			var p = getFront();
			itemList[map[p].itemId].value--;
			ui.setItemValue(p, itemList[map[p].itemId].value);
			this.loadPaper();
		};

		this.getPlayerItemValue = function()
		{
			return itemList[player.itemId].value;
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

	this.loadLevel = function(levelId)
	{
		if (levelId == undefined)
		{
			if (config.useFakeLevel)
				initLevel(config.fakeLevelInfo);
			else
			{
				levelId = config.defaultOnlineLevelId;
				network.getDefaultLevelInfo(levelId, function(data){
					if (data["status"] == 1000)
					{
						user.setLevelId(levelId);
						initLevel(JSON.parse(data["level_info"]));
					}
					else alert(msg.getMessage(data["status"]));
				});
			}
		}
		else network.getLevelInfo(
			levelId,
			function(data){
				if (data["status"] == 1000)
				{
					user.setLevelId(levelId);
					initLevel(JSON.parse(data["level_info"]));
				}
				else alert(msg.getMessage(data["status"]));
			}
		);
	};

	var renderLevel = function()
	{
		state.render()
	}

	var reset = function()
	{
		state.loadLevel(levelInfo);
		renderLevel();
	};

	var initLevel = function(levelInfoIn)
	{
		levelInfo = $.extend(true, {}, levelInfoIn);
		code.setBlockTypes(levelInfo.blockTypes);
		reset();
	};

//function for playing
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
		if (validator.validate())
			return undefined;
		state.step();
		validator.validate();
	};

	var moveForward = function(step)
	{
		validator.init();
		for (let i = 0; i < step; i++)
		{
			state.step();
			if (validator.validate())
				return undefined;
		}
	};

	var move = function(dir, step)
	{
		validator.init();
		var d = (4 + dir - state.getPlayer().dir % 4);
		state.rotate(d);
		if (validator.validate())
			return undefined;
		for (let i = 0; i < step; i++)
		{
			state.step();
			if (validator.validate())
				return undefined;
		}
	};

	var moveToPos = function(tx, ty)
	{
		validator.init();
		state.checkTarget(tx, ty);
		if (validator.validate())
			return undefined;

		var p = state.route(ty * config.mapWidth + tx);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.step();
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

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
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

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.storeItem();
	}

	var loadPaper = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;

		state.checkLoadPaper(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.loadPaper();
	};

	var storePaper = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;

		state.checkStorePaper(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.storePaper();
	};

	var addPaper = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;

		state.checkOperatePaper(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.addPaper();
	};

	var subPaper = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;

		state.checkOperatePaper(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.subPaper();
	};

	var incPaper = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;

		state.checkLoadPaper(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.incPaper();
	};

	var decPaper = function(address)
	{
		validator.init();
		var f = state.getFloor(address);
		if (validator.validate())
			return undefined;

		state.checkLoadPaper(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.decPaper();
	};

	var inbox = function()
	{
		validator.init();
		var f = state.getInbox();
		state.checkLoad(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")
				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.loadItem();
	}

	var outbox = function()
	{
		validator.init();
		var f = state.getOutbox();
		state.checkStore(f.pos);
		if (validator.validate())
			return undefined;

		var p = state.route(f.pos);
		for (let i = 0; i < p.length; i++)
		{
			if (p[i].op == "s")

				state.step();
			if (p[i].op == "r")
				state.rotate(p[i].dir);
		}
		state.storeItem();
	}

	var finish = function()
	{
		if (state.checkFinished())
			ui.finishLevel();
		else
			ui.unfinishLevel();
	};

	var branch = function(op)
	{
		switch (op)
		{
			case 0: return (state.getPlayerItemValue() < 0); break;
			case 1: return (state.getPlayerItemValue() == 0); break;
			case 2: return (state.getPlayerItemValue() > 0); break;
		}
	}

	var raiseErr = function(op)
	{
		validator.invalid(op);
		validator.validate();
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
			return code.step();
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
			case 21:
				loadPaper(op.address);
			break;
			case 22:
				storePaper(op.address);
			break;
			case 23:
				addPaper(op.address);
			break;
			case 24:
				subPaper(op.address);
			break;
			case 25:
				incPaper(op.address);
			break;
			case 26:
				decPaper(op.address);
			break;
			case 31:
				inbox();
			break;
			case 32:
				outbox();
			break;
			case 50:
				finish();
			break;
			case 41:
				return branch(op.op);
			break;
			case 43:
				return raiseErr(op.op);
			default:
			//nothing
			break;
		}
	};

	// Do login using network module
	this.doLogin = function(username, password, callback)
	{
		if (username == "")
		{
			return callback(msg.getMessage(3051), {status: "failed"});
		}
		if (password == "")
		{
			return callback(msg.getMessage(3052), {status: "failed"});
		}
		network.login(username, password, function(res) {
			if (res.status == 1000)
			{
				user.login(username);
				callback(undefined, {
					status: "succeeded",
					username: username
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	};

	// Do logout with network module
	this.doLogout = function(callback)
	{
		user.logout();
		network.logout(function(res) {
			if (res.status == 1000)
			{
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	// Do register with network module
	this.doRegister = function(username, email, password, password2, callback)
	{
		if (username == "")
		{
			return callback(msg.getMessage(3051), {status: "failed"});
		}
		if (email == "")
		{
			return callback(msg.getMessage(3053), {status: "failed"});
		}
		if (password == "")
		{
			return callback(msg.getMessage(3052), {status: "failed"});
		}
		if (password != password2)
		{
			return callback(msg.getMessage(3054), {status: "failed"});
		}
		network.register(username, password, email, function(res) {
			if (res.status == 1000)
			{
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	// Do change password with network module
	this.doChangePassword = function(newPassword, newPassword2, callback)
	{
		if (newPassword == "")
		{
			return callback(msg.getMessage(3052), {status: "failed"});
		}
		if (newPassword != newPassword2)
		{
			return callback(msg.getMessage(3054), {status: "failed"});
		}
		network.changePasswordAfterLogin(newPassword, function(res) {
			if (res.status == 1000)
			{
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	this.doNewLevel = function(content, callback)
	{
		user.setLevelId(0);
		user.editContent(content);
		callback(undefined, {status: "succeeded"});
	};

	this.runNewLevel = function(content)
	{
		initLevel(JSON.parse(content));
	};

	this.getUserContent = function()
	{
		if (user.status() == false || user.getContent() == "")
			return JSON.stringify(config.emptyLevelInfo);
		else
			return user.getContent();
	}

	this.doSaveLevel = function(callback)
	{
		var content = user.getContent();
		network.newUsermadeLevel(content, function(res) {
			if (res.status == 1000)
			{
				user.setLevelId(res.level_id);
				alert(res.level_id);
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	this.doShareLevel = function(callback)
	{
		var id = user.getLevelId();
		if (id == 0)
		{
			return callback(msg.getMessage(3101), {status: "failed"});
		}
		network.shareLevel(id, function(res) {
			if (res.status == 1000)
			{
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	this.doGetSharedLevel = function(callback)
	{
		network.getSharedLevel(function(res) {
			if (res.status == 1000)
			{
				callback(undefined, {
					status: "succeeded",
					levelList: JSON.parse(res.all_shared_level)
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}
}

var logic = new Logic();
