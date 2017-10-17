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