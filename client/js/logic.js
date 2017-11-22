var debug = window.debug;
var ui = window.ui;
var code = window.code;
var msg = window.msg;

function Logic()
{
	function Validator()
	{
		var flag = 0;
		var msgId = msg.getMsgId("ERROR");
		this.init = function()
		{
			flag = 0;
			msgId = msg.getMsgId("ERROR");
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
		var solutionId = 0;
		var inputBuf = [];
		var outputBuf = [];

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
			solutionId = 0;
		};

		this.getLevelId = function()
		{
			return levelId;
		};

		this.setSolutionId = function(id)
		{
			solutionId = id;
		};

		this.getSolutionId = function()
		{
			return solutionId;
		};

		this.clearInput = function()
		{
			inputBuf = [];
		}

		this.pushInput = function(index)
		{
			if (index != "" && !isNaN(index))
				inputBuf.push({type: 1, value: parseInt(index)});
		}

		this.popInput = function()
		{
			if (inputBuf.length > 0)
				inputBuf.pop();
		}

		this.getInput = function()
		{
			return $.extend(true, [], inputBuf);
		}

		this.clearOutput = function()
		{
			outputBuf = [];
		}

		this.pushOutput = function(index)
		{
			if (index != "" && !isNaN(index))
				outputBuf.push({type: 1, value: parseInt(index)});
		}

		this.popOutput = function()
		{
			if (outputBuf.length > 0)
				outputBuf.pop();
		}

		this.getOutput = function()
		{
			return $.extend(true, [], outputBuf);
		}
	}

	var user = new User();

	function State()
	{
		var player = {pos: 0, dir: 0, haveItem: 0, itemId: 0}
		var itemList = [];
		var opFloor = [];
		var input = [], output = [];
		var map = [];
		var description = "";

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
			ui.setDescription(description);
		}

	//Functions for creator.

		this.initCreator = function()
		{
			for (let i = 0; i < config.mapHeight; i++)
				for (let j = 0; j < config.mapWidth; j++)
					map[i * config.mapWidth + j] = {isOpFloor: 0, address: 0, haveItem: 0, itemId: 0};
			opFloor = [-1, -1];
		}

		this.renderCreator = function()
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
			ui.addPlayerAnimation(7, 7, 0, 0);
			ui.setDescription(description);
		}

		this.refreshCreator = function()
		{
			this.init();
			for (let i = 0; i < opFloor.length - 2; i++)
			{
				map[opFloor[i]].isOpFloor = 1;
				map[opFloor[i]].address = i;
			}
			if (opFloor[opFloor.length - 2] != -1)
			{
				map[opFloor[opFloor.length - 2]].isOpFloor = 1;
				map[opFloor[opFloor.length - 2]].address = opFloor.length - 2;
			}
			if (opFloor[opFloor.length - 1] != -1)
			{
				map[opFloor[opFloor.length - 1]].isOpFloor = 1;
				map[opFloor[opFloor.length - 1]].address = opFloor.length - 1;
			}

			for (let i = 0; i < itemList.length; i++)
			{
				map[itemList[i].pos].haveItem = 1;
				map[itemList[i].pos].itemId = i;
			}
		}

		var sortInt = function (a, b)
		{
			return a - b;
		}

		this.remarkCreator = function()
		{
			var tmp1 = opFloor.pop();
			var tmp2 = opFloor.pop();
			opFloor.sort(sortInt);
			opFloor.push(tmp2);
			opFloor.push(tmp1);
			this.refreshCreator();
		}

		this.newCreatorFloor = function(pos)
		{
			if (pos == 7)
				return undefined;
			if (map[pos].isOpFloor)
				return undefined;
			opFloor.unshift(pos);
			this.remarkCreator();
			this.renderCreator();
		}

		this.newCreatorItem = function(item)
		{
			if (item.pos == 7)
				return undefined;
			if (!map[item.pos].isOpFloor)
				return undefined;
			if (map[item.pos].haveItem)
				return undefined;
			if (item.pos == opFloor[opFloor.length - 2])
				return undefined;
			if (item.pos == opFloor[opFloor.length - 1])
				return undefined;
			map[item.pos].haveItem = 1;
			map[item.pos].itemId = itemList.length;
			itemList.push($.extend(true, {}, item));
			ui.newItem(item.pos, item.type, undefined);
			if (item.type == 1)
				ui.setItemValue(item.pos, item.value);
		}

		this.setInbox = function(pos)
		{
			if (pos == 7)
				return undefined;
			if (map[pos].isOpFloor && map[pos].address != opFloor.length - 1)
				return undefined;
			opFloor[opFloor.length - 1] = pos;
			this.refreshCreator();
			this.renderCreator();
		}

		this.setOutbox = function(pos)
		{
			if (pos == 7)
				return undefined;
			if (map[pos].isOpFloor && map[pos].address != opFloor.length - 2)
				return undefined;
			opFloor[opFloor.length - 2] = pos;
			this.refreshCreator();
			this.renderCreator();
		}

		this.setInput = function(list)
		{
			input[0] = $.extend(true, [], list);
			ui.setInput(list);
		}

		this.setOutput = function(list)
		{
			output[0] = $.extend(true, [], list);
			ui.setOutput(list);
		}

		this.setDescription = function(index)
		{
			description = index;
			ui.setDescription(description);
		}

		this.eraseCreator = function(pos)
		{
			if (map[pos].isOpFloor)
			{
				if (map[pos].address < opFloor.length - 2)
					opFloor.splice(map[pos].address, 1);
				else
					opFloor[map[pos].address] = -1;

			}
			if (map[pos].haveItem)
				itemList.splice(map[pos].itemId, 1);
			map[pos].isOpFloor = 0;
			map[pos].address = 0;
			map[pos].haveItem = 0;
			map[pos].itemId = 0;
			this.refreshCreator();

			this.renderCreator();
		}

		this.test = function()
		{
		}

		this.checkCreator = function()
		{
			if (opFloor[opFloor.length - 1] == -1)
				return false;
			if (opFloor[opFloor.length - 2] == -1)
				return false;
			if (output.length == 0 || output[0].length == 0)
				return false;
			return true;
		}

		this.dumpLevel = function()
		{
			level = {
				blockTypes: [21, 22, 23, 24, 25, 26, 31, 32, 41, 42, 43, 11],
				playerInfo: {pos: 7, dir: 0},
				opFloor: opFloor,
				input: input,
				output: output,
				itemList: itemList,
				description: description
			}
			return JSON.stringify(level)
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
				validator.invalid(msg.getMsgId("Target is out of map."));
				return undefined;
			}
			var pos = y * config.mapWidth + x;
			if (map[pos].isOpFloor)
			{
				validator.invalid(msg.getMsgId("Target is an operation floor."));
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
				validator.invalid(msg.getMsgId("I have something in my hand."));
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(msg.getMsgId("Target is not an operation floor."));
				return 0;
			}

			if (!map[pos].haveItem)
			{
				if (map[pos].address == opFloor.length - 1)
				{
					if (input[0].length)
						return 1;
					else
						validator.invalid(msg.getMsgId("Inbox is empty."));
				}
				else
					validator.invalid(msg.getMsgId("There is notiong there to load."));
				return 0;
			}
			return 1;
		};

		this.checkStore = function(pos)
		{
			if (!player.haveItem)
			{
				validator.invalid(msg.getMsgId("I have nothing in my hand."));
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(msg.getMsgId("Target is not an operation floor."));
				return 0;
			}

			if (map[pos].haveItem)
			{
				validator.invalid(msg.getMsgId("There is something there."));
				return 0;
			}

			if (map[pos].address == opFloor.length - 2)
			{
				if (output[0].length == 0)
				{
					validator.invalid(msg.getMsgId("It's not what we want."));
					return 0;
				}
				if (!itemEqual(itemList[player.itemId], output[0][0]))
				{
					validator.invalid(msg.getMsgId("It's not what we want."));
					return 0;
				}
			}

			if (map[pos].address == opFloor.length - 1)
			{
				validator.invalid(msg.getMsgId("I can't store it there."));
				return 0;
			}
			return 1;
		};

		this.checkLoadPaper = function(pos)
		{
			if (player.haveItem && itemList[player.itemId].type != 1)
			{
				validator.invalid(msg.getMsgId("I can't load with this in my hand."));
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(msg.getMsgId("Target is not an operation floor."));
				return 0;
			}

			if (!map[pos].haveItem)
			{
				validator.invalid(msg.getMsgId("I can't load from here."));
				return 0;
			}
			if (itemList[map[pos].itemId].type != 1)
			{
				validator.invalid(msg.getMsgId("I can't load from here."));
				return 0;
			}
			return 1;
		};

		this.checkStorePaper = function(pos)
		{
			if (!player.haveItem || itemList[player.itemId].type != 1)
			{
				validator.invalid(msg.getMsgId("I can't store here."));
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(msg.getMsgId("Target is not an operation floor."));
				return 0;
			}

			if (map[pos].haveItem && itemList[map[pos].itemId].type != 1)
			{
				validator.invalid(msg.getMsgId("I can't store an item."));
				return 0;
			}
			return 1;
		};

		this.checkOperatePaper = function(pos)
		{
			if (!player.haveItem || itemList[player.itemId].type != 1)
			{
				validator.invalid(msg.getMsgId("I can't store here."));
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid(msg.getMsgId("Target is not an operation floor."));
				return 0;
			}

			if (!map[pos].haveItem || itemList[map[pos].itemId].type != 1)
			{
				validator.invalid(msg.getMsgId("I can't calc an item."));
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
				validator.invalid(msg.getMsgId("Invalid address."));
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
				validator.invalid(msg.getMsgId("Target is out of map."));
				return undefined;
			}
			if (map[getFront()].isOpFloor)
			{
				validator.invalid(msg.getMsgId("Target is an operation floor."));
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
				validator.invalid(msg.getMsgId("Target is out of map."));
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
				validator.invalid(msg.getMsgId("Target is out of map."));
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
	var bestBlockNum;
	
	// Load a level stored in levelInfo, which sets up the map and Blockly.
	// Start a new level, may need grabbing it from server.
	this.loadLevel = function(levelId, afterwards)
	{
		var compLevel = function(data) {
			if (data["status"] == msg.getMsgId("Succeeded"))
			{
				user.setLevelId(levelId);
				ui.setLevelId(levelId);
				initLevel(JSON.parse(data["level_info"]));
				bestBlockNum = data["block_num"];
				network.getCurrentUserInfo(function(data){
					if (data["status"] == msg.getMsgId("Succeeded"))
					{
						var solution_id = JSON.parse(data["solution_dict"])[levelId];
						if (solution_id != undefined)
						{
							logic.loadSolution(solution_id, afterwards);
						}
					}
					else
					{
						if (afterwards != undefined) afterwards();
					}
				});
			}
			else alert(msg.getMessage(data["status"]));
		};
		network.getLevelInfo(levelId, compLevel);
	};

	this.loadDefaultLevel = function(levelId, afterwards)
	{
		var compLevel = function(data) {
			if (data["status"] == msg.getMsgId("Succeeded"))
			{
				user.setLevelId(data["level_id"]);
				ui.setDefaultLevelId(levelId);
				initLevel(JSON.parse(data["level_info"]));
				bestBlockNum = data["block_num"];
				network.getCurrentUserInfo(function(data){
					if (data["status"] == msg.getMsgId("Succeeded"))
					{
						var solution_id = JSON.parse(data["solution_dict"])[user.getLevelId()];
						if (solution_id != undefined)
						{
							logic.loadSolution(solution_id, afterwards);
						}
					}
					else
					{
						if (afterwards != undefined) afterwards();
					}
				});
			}
			else
			{
				alert(msg.getMessage(data["status"]));
				logic.loadDefaultLevel(1, afterwards);
			}
		};
		network.getDefaultLevelInfo(levelId, compLevel);
	};

	this.loadSolution = function(solutionId, afterwards){
		network.getSolutionInfo(
			solutionId,
			function(data){
				if (data["status"] == msg.getMsgId("Succeeded"))
				{
					code.loadSolution(JSON.parse(data["solution_info"]));
					if (afterwards != undefined) afterwards();
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

// Functions for creator

	this.doLoad = function()
	{
		state.init();
	};

	this.initCreator = function()
	{
		state.initCreator();
		state.renderCreator();
		user.clearInput();
	}

	this.newFloor = function(pos)
	{
		state.newCreatorFloor(pos);
	}

	this.newItem = function(obj)
	{
		state.newCreatorItem(obj);
	}

	this.setInbox = function(pos)
	{
		state.setInbox(pos);
	}

	this.setOutbox = function(pos)
	{
		state.setOutbox(pos);
	}

	this.setInput = function(list)
	{
		state.setInput(list);
	}

	this.setOutput = function(list)
	{
		state.setOutput(list);
	}

	this.erase = function(pos)
	{
		state.eraseCreator(pos);
	}

	this.pushInput = function(index)
	{
		user.pushInput(index);
		this.setInput(user.getInput());
	}

	this.popInput = function()
	{
		user.popInput();
		this.setInput(user.getInput());
	}

	this.clearInput = function()
	{
		user.clearInput();
		this.setInput(user.getInput());
	}

	this.pushOutput = function(index)
	{
		user.pushOutput(index);
		this.setOutput(user.getOutput());
	}

	this.popOutput = function()

	{
		user.popOutput();
		this.setOutput(user.getOutput());
	}

	this.clearOutput = function()
	{
		user.clearOutput();
		this.setOutput(user.getOutput());
	}

	this.setDescription = function(index)
	{
		state.setDescription(index);
	}

	this.checkCreator = function()
	{
		return state.checkCreator();
	}

	this.dumpLevel = function()
	{
		return state.dumpLevel();
	}

	this.test = function()
	{
		return validator.validate();
	}

// Functions for network

	// Do login using network module
	this.doLogin = function(username, password, callback)
	{
		if (username == "")
		{
			return callback(msg.getMessage(msg.getMsgId("Username can't be empty.")), {status: "failed"});
		}
		if (password == "")
		{
			return callback(msg.getMessage(msg.getMsgId("Password can't be empty.")), {status: "failed"});
		}
		network.login(username, password, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
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

	this.doPhoneGetCode = function(phoneNumber, callback) {
		network.sendCodeToMobilePhoneUser(phoneNumber, function(res){
			if (res.status == msg.getMsgId("Succeeded"))
			{
				callback(undefined, {
					status: "succeeded",
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	this.doPhoneLogin = function(username, identifyingCode, callback)
	{
		network.loginWithPhoneNumber(username, identifyingCode, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
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
			if (res.status == msg.getMsgId("Succeeded"))
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
			return callback(msg.getMessage(msg.getMsgId("Username can't be empty.")), {status: "failed"});
		}
		if (email == "")
		{
			return callback(msg.getMessage(msg.getMsgId("Email can't be empty.")), {status: "failed"});
		}
		if (password == "")
		{
			return callback(msg.getMessage(msg.getMsgId("Password can't be empty.")), {status: "failed"});
		}
		if (password != password2)
		{
			return callback(msg.getMessage(msg.getMsgId("Invalid check password.")), {status: "failed"});
		}
		network.register(username, password, email, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
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
			return callback(msg.getMessage(msg.getMsgId("Password can't be empty.")), {status: "failed"});
		}
		if (newPassword != newPassword2)
		{
			return callback(msg.getMessage(msg.getMsgId("Invalid check password.")), {status: "failed"});
		}
		network.changePasswordAfterLogin(newPassword, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
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
		if (!user.status() || user.getContent() == "")
			return JSON.stringify(config.emptyLevelInfo);
		else
			return user.getContent();
	}

	this.doSaveLevel = function(callback)
	{
		var content = this.dumpLevel();
		network.newUsermadeLevel(content, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
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
			return callback(msg.getMessage(msg.getMsgId("You should save before share.")), {status: "failed"});
		}
		network.shareLevel(id, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
			{
				callback(undefined, {
					status: "succeeded",
					level_id: id
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	this.doSaveSolution = function(callback)
	{
		var level_id = user.getLevelId();
		var content = JSON.stringify(code.dumpSolution());
		network.newSolution(level_id, content, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
			{
				user.setSolutionId(res.solution_id);
				alert(res.solution_id);
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

	this.doShareSolution = function(callback)
	{
		var id = user.getSolutionId();
		if (id == 0)
		{
			return callback(msg.getMessage(msg.getMsgId("Solutions must be saved before share.")), {status: "failed"});
		}
		network.shareSolution(id, function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
			{
				callback(undefined, {
					status: "succeeded",
					level_id: user.getLevelId(),
					solution_id: id
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
			if (res.status == msg.getMsgId("Succeeded"))
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

	var getDefaultLevelList = function(list, callback)
	{
		network.getDefaultLevel(function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
			{
				var ans = $.extend(true, {}, list, {defaultLevelList: JSON.parse(res.level)});
				callback(undefined, ans);
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	var getSharedLevelList = function(list, callback)
	{
		network.getSharedLevel(function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
			{
				var ans = $.extend(true, {}, list, {sharedLevelList: JSON.parse(res.all_shared_level)});
				getDefaultLevelList(ans, callback);
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}

	var getPrivateLevelList = function(list, callback)
	{
		network.getPrivateLevel(function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
			{
				var ans = $.extend(true, {}, list, {privateLevelList: JSON.parse(res.all_private_level)});
				getSharedLevelList(ans, callback);
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	}


	this.doGetLevelList = function(callback)
	{
		getPrivateLevelList({}, callback);
	}

	this.doPayVip = function(callback)
	{
		network.pay(function(res) {
			if (res.status == msg.getMsgId("Succeeded"))
			{
				callback(undefined, {
					status: "succeeded",
				});
			}
			else
			{
				callback(msg.getMessage(res.status), {status: "failed"});
			}
		});
	};

	this.doStarEvaluation = function()
	{
		var usedNum = code.dumpSolution()["block_num"];
		var bestNum = bestBlockNum;
		var star;
		if (bestBlockNum < 0) {
			star = 4;
			bestNum = "-";
		}
		else if (usedNum <= bestBlockNum) star = 3;
		else if (usedNum <= bestBlockNum * 2) star = 2;
		else star = 1;
		return {used_num: usedNum, best_num: bestNum, result: star};
	}
}

var logic = new Logic();
