var config = {
	debug: true,

	mapWidth: 7,
	mapHeight: 7,

	// Set `useFakeLevel` to true when you need to load the fake level.
	// If you set it to false to use online level, remember to init the level first.
	// A temporary initialization method is to access test.html
	useFakeLevel: true,
	defaultOnlineLevelId: 0,
	// The fake level used in logic.
	// Please update it when the level specifications change.
	fakeLevelInfo: {
		blockTypes: [9, 10, 21, 22],
		playerInfo: {pos: 7, dir: 0},
		opFloor: [1, 2, 3, 4, 5, 22, 23, 24, 25, 26, 36, 37, 38, 39, 40, 6, 0],
		input: [[{type: 1, value: 1}, {type: 1, value: 2}]],
		output: [[{type: 2}]],
		itemList: [{type: 1, value: 2, pos: 1}, {type: 1, value: 3, pos: 2}]
	},
	offset: [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}],
	
	// Config for UI
	UI: {
		map: {
			images: {
				0: "/images/map/background.png",
				1: "/images/map/obstacles/input.png",
				2: "/images/map/obstacles/output.png",
				3: "/images/map/obstacles/table.png",
				4: "/images/map/obstacles/wall.png"
			},
			imageWidth: 300,
			imageHeight: 300
		},
		object: {
			images: {
				1: "/images/map/objects/apple.png",
				2: "/images/map/objects/banana.png"
			},
			imageWidth: 300,
			imageHeight: 300
		},
		player: {
			images: {
				0: ["/images/map/player/front0.png", "/images/map/player/front1.png"],
				1: ["/images/map/player/right0.png", "/images/map/player/right1.png"],
				2: ["/images/map/player/back0.png", "/images/map/player/back1.png"],
				3: ["/images/map/player/left0.png", "/images/map/player/left1.png"],
			},
			imageWidth: 300,
			imageHeight: 300
		},
	},

	blocklyConstants: {
		overallInitialization: "stacklvl=0;blockID=[];simpleRepeatVars=[];",
		eachInitialization: "blockID[stacklvl] = %1;"
	}
};
