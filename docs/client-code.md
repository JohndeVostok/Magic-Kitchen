# Doc

## Client

### Code
		code.setBlockTypes(blockIDList)
			blockIDList: type = list of int
				0: nop
				1: single_step_forward
				2: rotate
				3: pick_up
				4: put_down
				5: walk_towards_specific_direction (currently NOT implemented in logic)
				6: simple_repeat
			return: undefined
		
		code.start()
			Setup interpreter.
			*TODO: Disable movements of blocks.*
			return: undefined

		code.step()
			return: typ = boolean
				true: default
				false: code not started or finished or stopped

		code.stop()
			Discard interpreter.
			Disable highlight of current block.
			*TODO: Reenable movements of blocks.*
			return: undefined

#### Tests
		
		0. (Optional) Add console.log to logic.step. This can make sure the function is properly called.
		1. Access codechef.html.
		2. Call code.setBlockTypes(blockIDList). e.g. code.setBlockTypes([0, 1, 2, 4]).
		3. Grab the blocks to form a simple code.
		4. Call code.start(), code.step(), code.stop() in various ways.
