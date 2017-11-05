# Doc

## Client

### Logic

	Functions for initialization.

		logic.doLoad()
			Init an empty map.
			return: undefined

		logic.loadLevel()
			fetch level from back-end or use fake level.

			levelInfoFormat:
				fakeLevelInfo:
				{
					blockTypes: [int, int...],
						Array of int.
						Check doc of client-code for meaning.
					playerInfo: {pos: int, dir: int},
						Player's position and direction.
					opFloor: [int, int...],
						Index means address.
						int means position.
					input: [[{type: typeId0}, {type: typeId1}, ...], ...]
						Array of test inputs.
						Each input is an array of items.
					output: [[{type: typeId0}, {type: typeId1}, ...], ...]
						Array of test outputs.
						Each output is an array of items.
					itemList: [{type: int, pos: int}, {type: int, pos: int}...]
						Array of {type, pos}
							type 1, 2 means apple and banana.
							pos means position.
				}

			return: undefined

		initLevel(levelInfo)
			Callback of fetchLevel.
			Init map and render to UI.
			Can't be called.
			return: undefined

	Functions for UI

		logic.start()
			Start playing.
			Reset map, render to UI and compile code.
			return: undefined

		logic.step(op)
			Single step run of code.
			Must be called after logic.start.
			op["typeID"]: type == int
				0: nop
				1: moveforward
				2: rotate
					op["dir"]: type == int
						1 = +pi/2
						2 = +pi
						3 = +3pi/2
						etc.
					dir = 0 means down, dir = 1 means right, dir = 2 means up, dir = 3 means left.
				3: load
					load from opFloor front.
				4: store
					store to opFloor front.
				5: step with dir
					op["dir"]: type == int
						1 = +pi/2
						2 = +pi
						3 = +3pi/2
						etc.
					single step to dir.
				6: move with step number
					op["step"]: type == int
					move forward for step steps.
				7: move with dir and step number
					op["dir"]: type == int
						1 = +pi/2
						2 = +pi
						3 = +3pi/2
						etc.
					op["step"]: type == int
					move toward dir for step steps.
				8: move to position
					op["x"]: type == int
					op["y"]: type == int
					move to pos(x, y).
				9: load from address
					op["address"]: type == int
					load from address.
				10: store to address
					op["address"]: type == int
					store to address

				21: load from address for paper
					op["address"]: type == int
					load from address.
				22: store to address for paper
					op["address"]: type == int
					store to address
				23: add operator for paper
					op["address"]: type == int
					add paper in hand to paper in address.
				24: sub operator for paper
					op["address"]: type == int
					sub paper in hand to paper in address.
				25: inc paper
					op["address"]: type == int
					inc paper in address and copy
				26: dec paper
					op["address"]: type == int
					dec paper in address and copy
					
				31: inbox
					input
				32: outbox
					output
				41: if
					return result of expr
				50: finish
					end of code.

#### Logic operations called by UI

	Functions for user systems

		logic.doLogin(username, password, callback):
			Call network to login and call callback when ready.
			callback = function(err, res)
			err = undefined if no error occurred else error message
			res = {status: "failed"|"succeeded", username: theUsernameOfUser}

		logic.doLogout(callback):
			Call network to logout and call callback when ready.
			callback = function(err, res)
			err = undefined if no error occurred else error message
			res = {status: "failed"|"succeeded"}

		logic.doRegister(username, email, password, password2, callback):
			Call network to register and call callback when ready.
			callback = function(err, res)
			err = undefined if no error occurred else error message
			res = {status: "failed"|"succeeded"}

		logic.doChangePassword(newPassword, newPassword2, callback):
			Call network to change password while logged in and call callback when ready.
			callback = function(err ,res)
			err = undefined if no error occurred else error message
			res = {status: "failed"|"succeeded"}

#### Logic Map Specifications

* Map in logic is stored in an object often called "levelInfo".
* An example is as following:

JavaScript
	fakeLevelInfo: {
		blockTypes: [9, 10, 21, 22, 31, 32],
		playerInfo: {pos: 7, dir: 0},
		opFloor: [1, 2, 3, 4, 5, 22, 23, 24, 25, 26, 36, 37, 38, 39, 40, 6, 0],
		input: [[{type: 1, value: 1}, {type: 1, value: 2}]],
		output: [[{type: 1, value: 2}, {type: 1, value: 1}]],
		itemList: [{type: 1, value: 2, pos: 1}, {type: 1, value: 3, pos: 2}]
	},

* The "blockTypes" specifies what kinds of blocks can be used in Blockly.
	* The "block-type-id"s can be found in "code" module docs.
* The "playerInfo" specifies the initial player state.
	* "pos" means position.
	* "dir" means direction.
	* See "ui" docs for definitions.
* The "opFloor" specifies the opFloor (tables, inbox, outbox) on the map.
	* opFloor[opFloor.length - 1] is inbox.
	* opFloor[opFloor.length - 2] is outbox.
	* opFloor has it's address on it.
	* Player can't access inbox and outbox by address.
* The "itemList" specifies the items (magic paper, apples, bananas, etc.) on the map.
	* Consider an item "i".
	* "i.type" means the item's type, in an Integer.
		* "i.type" == 1 means it's a magic paper.
			* Now magic paper looks like an apple now. But it contains magic. (integer). "i.value" is an integer.
			* Magic paper should be like a paper with a number on it.
			* Magic paper support load store, add and sub.
			* load(loc): When player hold a magic paper or have nothing in hand. Copy from loc.
			* store(loc): When opFloor has a magic paper or nothing on it. Copy to loc.
			* add(loc): Add magic paper on loc to magic paper on hand.
			* sub(loc): Sub magic paper on loc to magic paper on hand.
		* "i.type" != 1. It's just for kids.
	* "i.pos" means the position on the map.
