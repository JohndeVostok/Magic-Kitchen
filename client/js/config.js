var config = {
	debug: false,

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
		blockTypes: [21, 22, 23, 24, 25, 26, 31, 32, 41, 42, 43, 11],
		playerInfo: {pos: 7, dir: 0},
		opFloor: [1, 2, 3, 4, 5, 22, 23, 24, 25, 26, 36, 37, 38, 39, 40, 6, 0],
		input: [[{type: 1, value: 1}, {type: 1, value: 2}]],
		output: [[{type: 1, value: 2}, {type: 1, value: 1}]],
		itemList: [{type: 1, value: 2, pos: 1}, {type: 1, value: 3, pos: 2}]
	},
	emptyLevelInfo: {
		blockTypes: [21, 22, 23, 24, 25, 26, 31, 32, 41, 42, 43, 11],
		playerInfo: {pos: 7, dir: 0},
		opFloor: [1, 3, 5, 6, 0],
		input: [[{type: 1, value: 3}, {type: 1, value: 3}]],
		output: [[{type: 1, value: 2}, {type: 1, value: 2}]],
		itemList: []
	},
	offset: [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}],
	
	// Config for UI
	UI: {
		images: {
			MAP_BACKGROUND: {
				src: "/images/map/background.png",
				width: 300,
				height: 300,
				x: 0,
				y: 300,
				len: 300
			},
			MAP_INPUT: {
				src: "/images/map/obstacles/input.png",
				width: 300,
				height: 300,
				x: 0,
				y: 300,
				len: 300
			},
			MAP_OUTPUT: {
				src: "/images/map/obstacles/output.png",
				width: 300,
				height: 300,
				x: 0,
				y: 300,
				len: 300
			},
			MAP_TABLE: {
				src: "/images/map/obstacles/table.png",
				width: 300,
				height: 300,
				x: 0,
				y: 300,
				len: 300
			},
			MAP_WALL: {
				src: "/images/map/obstacles/wall.png",
				width: 300,
				height: 300,
				x: 0,
				y: 300,
				len: 300
			},
			ITEM_MAGICPAPER: {
				src: "/images/map/objects/magic_paper.png",
				width: 300,
				height: 300,
				x: 0,
				y: 300,
				len: 300
			},
			ITEM_BANANA: {
				src: "/images/map/objects/banana.png",
				width: 300,
				height: 300,
				x: 0,
				y: 300,
				len: 300
			}
		},
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
				1: "/images/map/objects/magic_paper.png",
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
		eachInitialization: "blockID[stacklvl] = %1;",
		overallFinalization: "extCall1(\"\", [{\"typeId\": 50}]);",
		userDefinedNamePacker: function(userDefinedName) {
			var name_chars = userDefinedName.split("");
			var safe_strs = [];
			for (let i in name_chars)
			{
				safe_strs[i] = name_chars[i].charCodeAt(0) + "Sep";
			}
			return "userDefinedName" + safe_strs.join("");
		}
	}
};
