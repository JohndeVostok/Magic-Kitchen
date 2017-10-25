var debug = window.debug;
var ui = window.ui;

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
			ui.blockStep();
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
			ui.clearItems();
			for (let i = 0; i < itemList.length; i++)
			{
				var item = itemList[i];
				ui.newItem(item.pos, item.type, undefined);
			}
			ui.addPlayerAnimation(player.pos, player.pos, player.dir, player.dir);
			ui.setInput(input[0]);
			ui.setOutput(output[0]);
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
			return (itemA.type == itemB.type)
		}

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

		this.checkLoad = function(pos)
		{
			if (player.haveItem)
			{
				validator.invalid("I have something in my hand.");
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid("It's not an opFloor!");
				return 0;
			}

			if (!map[pos].haveItem)
			{
				if (map[pos].address == opFloor.length - 1)
				{
					if (input[0].length)
						return 1;
					else
						validator.invalid("It's empty!");
				}
				else
					validator.invalid("I can't load from here.");
				return 0;
			}
			return 1;
		};

		this.checkStore = function(pos)
		{
			if (!player.haveItem)
			{
				validator.invalid("I have nothing to store!");
				return 0;
			}

			if (!map[pos].isOpFloor)
			{
				validator.invalid("It's not an opFloor!");
				return 0;
			}

			if (map[pos].haveItem)
			{
				validator.invalid("Something There!");
				return 0;
			}

			if (map[pos].address == opFloor.length - 2)
			{
				if (output[0].length == 0)
				{
					validator.invalid("It's full.");
					return 0;
				}
				if (!itemEqual(itemList[player.itemId], output[0][0]))
				{
					validator.invalid("It's not what we want!");
					return 0;
				}
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
			return $.extend(true, map[opFloor[address]], {pos: opFloor[address]});
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

			if (map[p].address == opFloor.length - 1)
			{
				player.haveItem = 1;
				itemList.push($.extend(true, input[0].pop(), {pos: -1}));
				player.itemId = itemList.length - 1;
				ui.setInput(input[0]);
				ui.newItem(p, itemList[itemList.length - 1].type, undefined);
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
				validator.invalid("It's out!");
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
		levelInfo = $.extend(true, levelInfoIn);
		code.setBlockTypes(levelInfo.blockTypes);
		reset();
	};

	//function for test
	this.test = function()
	{
		return state.test();
	}

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
			return callback("用户名不能为空！", {status: "failed"});
		}
		if (password == "")
		{
			return callback("密码不能为空！", {status: "failed"});
		}
		network.login(username, password, function(res) {
			if (res.status == "succeeded")
			{
				// TODO: Store user info in logic for further use (e.g. fetching level).

				callback(undefined, {
					status: "succeeded",
					username: username
				});
			}
			else
			{
				var err = "未知错误";
				const arr = [
					["network timeout", "网络超时"],
					["user name can't be empty", "用户名不能为空！"],
					["password can't be empty", "密码不能为空！"],
					["this name doesn't exist", "该用户不存在！"],
					["wrong password", "密码错误！"],
					["you have already logged in", "你已经登录了！"]
				];
				for (var i in arr)
				{
					if (res.error == arr[i][0])
					{
						err = arr[i][1];
					}
				}
				callback(err, {status: "failed"});
			}
		});
	};

	// Do logout with network module
	this.doLogout = function(callback)
	{
		network.logout(function(res) {
			if (res.status == "succeeded")
			{
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				var err = "未知错误";
				if (res.error == "network timeout")
				{
					err = "网络超时";
				}
				callback(err, {status: "failed"});
			}
		});
	}

	// Do register with network module
	this.doRegister = function(username, email, password, password2, callback)
	{
		if (username == "")
		{
			return callback("用户名不能为空！", {status: "failed"});
		}
		if (email == "")
		{
			return callback("邮箱不能为空！", {status: "failed"});
		}
		if (password == "")
		{
			return callback("密码不能为空！", {status: "failed"});
		}
		if (password != password2)
		{
			return callback("两次输入密码不一致！", {status: "failed"});
		}
		network.register(username, password, email, function(res) {
			if (res.status == "succeeded")
			{
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				var err = "未知错误";
				const arr = [
					["network timeout", "网络超时"],
					["user name can't be empty", "用户名不能为空！"],
					["password can't be empty", "密码不能为空！"],
					["email can't be empty", "邮箱不能为空！"],
					["this name is too long", "用户名太长！"],
					["this password is too long", "密码太长！"],
					["this email address is too long", "邮箱太长！"],
					["this name already exists", "该用户已存在！"],
					["this email address already exists", "该邮箱已存在！"],
					["you have already logged in", "你已经登录了！"]
				];
				for (var i in arr)
				{
					if (res.error == arr[i][0])
					{
						err = arr[i][1];
					}
				}
				callback(err, {status: "failed"});
			}
		});
	}

	// Do change password with network module
	this.doChangePassword = function(newPassword, newPassword2, callback)
	{
		if (newPassword == "")
		{
			return callback("密码不能为空！", {status: "failed"});
		}
		if (newPassword != newPassword2)
		{
			return callback("两次输入密码不一致！", {status: "failed"});
		}
		network.changePasswordAfterLogin(newPassword, function(res) {
			if (res.status == "succeeded")
			{
				callback(undefined, {
					status: "succeeded"
				});
			}
			else
			{
				var err = "未知错误";
				const arr = [
					["network timeout", "网络超时"],
					["please log in first", "请先登录！"],
					["password can't be empty", "密码不能为空！"],
					["this password is too long", "密码太长！"]
				];
				for (var i in arr)
				{
					if (res.error == arr[i][0])
					{
						err = arr[i][1];
					}
				}
				callback(err, {status: "failed"});
			}
		});
	}
}

var logic = new Logic();
