var config = {
	mapWidth: 13,
	mapHeight: 13,

	// Set `useFakeLevel` to true when you need to load the fake level.
	useFakeLevel: true,
	// The fake level used in logic.
	// Please update it when the level specifications change.
	fakeLevelInfo: {
		blockTypes: [0, 1, 2, 3, 4],
		playerInfo: {pos: 0, dir: 0},
		map: [
			{address: 1, location: 1},
			{address: 2, location: 2},
			{address: 3, location: 3},
			{address: 4, location: 4},
			{address: 5, location: 5},
			{address: 6, location: 6},
			{address: 7, location: 7},
			{address: 8, location: 8},
			{address: 9, location: 9},
			{address: 10, location: 10},
			{address: 11, location: 11}
		],
		itemList: [
			{type: 1, location: 1},
			{type: 2, location: 2},
			{type: 1, location: 3}
		]
	},
	
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

	blocks: [
		{
			name: "nop",
			json: {
				"message0": "空指令",
				"tooltip": "什么也不做",
				"previousStatement": null,
				"nextStatement": null,
				"colour": 0
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 0}];
			}
		},
		{
			name: "single_step_forward",
			json: {
				"message0": "向前一步",
				"tooltip": "按照当前方向向前行进一步",
				"previousStatement": null,
				"nextStatement": null,
				"colour": 120
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 1}];
			}
		},
		{
			name: "rotate",
			json: {
				"message0": "旋转： %1",
				"tooltip": "以当前方向为基准进行转向",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "ANGLE",
						"options": [
							[ "逆时针90度", "1" ],
							[ "180度", "2" ],
							[ "顺时针90度", "3" ]
						]
					}
				],
				"previousStatement": null,
				"nextStatement": null,
				"colour": 300
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{
					typeId: 2,
					dir: parseInt(block.getFieldValue("ANGLE"))
				}];
			}
		},
		{
			name: "pick_up",
			json: {
				"message0": "拿起物品",
				"tooltip": "将所在位置的操作台上的物品拿到头顶",
				"previousStatement": null,
				"nextStatement": null,
				"colour": 180
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 3}];
			}
		},
		{
			name: "put_down",
			json: {
				"message0": "放下物品",
				"tooltip": "将头顶的物品放置到所在位置的操作台上",
				"previousStatement": null,
				"nextStatement": null,
				"colour": 240
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 4}];
			}
		}
	]
};
