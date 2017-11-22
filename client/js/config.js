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
				src: "/images/new/map/background.png",
				width: 380,
				height: 269,
				x: 0,
				y: 269,
				len: 380
			},
			MAP_INPUT: {
				src: "/images/new/map/input.png",
				width: 380,
				height: 359,
				x: 0,
				y: 359,
				len: 380
			},
			MAP_OUTPUT: {
				src: "/images/new/map/output.png",
				width: 380,
				height: 359,
				x: 0,
				y: 359,
				len: 380
			},
			MAP_TABLE: {
				src: "/images/new/map/table.png",
				width: 380,
				height: 359,
				x: 0,
				y: 359,
				len: 380
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
				src: "/images/new/items/magic_paper.png",
				width: 380,
				height: 269,
				x: 0,
				y: 269,
				len: 380
			},
			ITEM_CAKE: {
				src: "/images/new/items/cake.png",
				width: 380,
				height: 269,
				x: 0,
				y: 269,
				len: 380
			}
		},
		map: {
			images: {
				0: "MAP_BACKGROUND",
				1: "MAP_INPUT",
				2: "MAP_OUTPUT",
				3: "MAP_TABLE",
				4: "MAP_WALL"
			}
		},
		object: {
			images: {
				1: "ITEM_MAGICPAPER",
				2: "ITEM_CAKE"
			}
		},
		player: {
			images: {
				0: ["/images/new/player/front.png", "/images/new/player/front.png"],
				1: ["/images/new/player/right.png", "/images/new/player/right.png"],
				2: ["/images/new/player/back.png", "/images/new/player/back.png"],
				3: ["/images/new/player/left.png", "/images/new/player/left.png"],
			},
			imageWidth: 380,
			imageHeight: 810
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
