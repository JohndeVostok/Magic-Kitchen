# Doc

## Client

### Logic
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
			return: undefined

		logic.getState()
			return: {
				x: character position X, type == int
				y: character position Y, type == int
			}

		logic.doLoad()
			return: undefined

		logic.startLevel()
			Start a new level and tells UI how to initialize it.
			May need to grab it from server.
			Currently the fake level is in use.
			return: undefined

#### Logic Map Specifications

* Map in logic is stored in an object often called `levelInfo`.
* An example is as following:
```JavaScript
fakeLevelInfo: {
	blockTypes: [0, 1, 2, 3, 4],
	playerInfo: {pos: 0, dir: 0},
	opFloorList: [
		{address: 1, pos: 1},
		{address: 2, pos: 2},
		{address: 3, pos: 3},
		{address: 4, pos: 4},
		{address: 5, pos: 5},
		{address: 6, pos: 6},
		{address: 7, pos: 7},
		{address: 8, pos: 8},
		{address: 9, pos: 9},
		{address: 10, pos: 10},
		{address: 11, pos: 11}
	],
	itemList: [
		{type: 1, pos: 1},
		{type: 2, pos: 2},
		{type: 1, pos: 3}
	]
}
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
