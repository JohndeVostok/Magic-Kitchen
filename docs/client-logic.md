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
					itemList: [{type: int, pos: int}, {type: int, pos: int}...]
						Array of {type, pos}
							type 1, 2 means apple and banana.
							pos means position.
				}

			return: undefined

		logic.initLevel(levelInfo)
			Callback of fetchLevel.
			Init map and render to UI.
			return: undefined

	Functions for playing

		logic.start()
			Start playing.
			Reset map, render to UI and compile code.
			return: undefined

		logic.step(op)
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

			return: undefined

#### Logic operations called by UI

	Functions for user systems

		logic.doLogin(username, password, callback):
			Call network to login and call callback when ready.
			callback = function(err, res)
			err = undefined if no error occurred else error message
			res = {status: "failed|succeeded", username: theUsernameOfUser}

		logic.doLogout(callback):
			Call network to logout and call callback when ready.
			callback = function(err, res)
			err = undefined if no error occurred else error message
			res = {status: "failed|succeeded"}

		logic.doRegister(username, email, password, password2, callback):
			Call network to register and call callback when ready.
			callback = function(err, res)
			err = undefined if no error occurred else error message
			res = {status: "failed|succeeded"}

#### Logic Map Specifications

* Map in logic is stored in an object often called `levelInfo`.
* An example is as following:
```JavaScript
fakeLevelInfo: {
	blockTypes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	playerInfo: {pos: 0, dir: 0},
	opFloor: [8, 9, 10, 11, 12, 22, 23, 24, 25, 26, 36, 37, 38, 39, 40],
	itemList: [
		{type: 1, pos: 8},
		{type: 2, pos: 9},
		{type: 1, pos: 10}
	]
},
```
* The `blockTypes` specifies what kinds of blocks can be used in Blockly.
  * The block-type-ids can be found in `code` module docs.
* The `playerInfo` specifies the initial player state.
  * `pos` means position.
  * `dir` means direction.
  * See `ui` docs for definitions.
* The `map` specifies the objects (tables, walls, etc.) on the map.
  * Currently only table is supported.
  * Consider one `map`'s element, say `e`.
  * `e.pos` means the position on the map. (See `ui` docs for position definitions)
  * If `e` is a table, `e.address` means the table's address in the game.
* The `itemList` specifies the items (apples, bananas, etc.) on the map.
  * Consider an item `i`.
  * `i.type` means the item's type, in an Integer. See `ui` docs for more.
  * `i.pos` means the position on the map.
