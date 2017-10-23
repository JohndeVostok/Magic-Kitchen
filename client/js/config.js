var config = {
	debug: false,

	mapWidth: 7,
	mapHeight: 7,

	// Set `useFakeLevel` to true when you need to load the fake level.
	useFakeLevel: true,
	// The fake level used in logic.
	// Please update it when the level specifications change.
	fakeLevelInfo: {
		blockTypes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		playerInfo: {pos: 0, dir: 0},
		opFloorList: [
			{address: 1, pos: 8},
			{address: 2, pos: 9},
			{address: 3, pos: 10},
			{address: 4, pos: 11},
			{address: 5, pos: 12},
			{address: 6, pos: 22},
			{address: 7, pos: 23},
			{address: 8, pos: 24},
			{address: 9, pos: 25},
			{address: 10, pos: 26},
			{address: 11, pos: 36},
			{address: 12, pos: 37},
			{address: 13, pos: 38},
			{address: 14, pos: 39},
			{address: 15, pos: 40},
		],
		itemList: [
			{type: 1, pos: 8},
			{type: 2, pos: 9},
			{type: 1, pos: 10}
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

	blocklyConstants: {
		overallInitialization: "stacklvl=0;blockID=[];simpleRepeatVars=[];",
		eachInitialization: "blockID[stacklvl] = %1;"
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
		},
		{
			name: "walk_towards_specific_direction",
			json: {
				"message0": "向%1走一步",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DIRECTION",
						"options": [
							[ "下", "0" ],
							[ "右", "1" ],
							[ "上", "2" ],
							[ "左", "3" ]
						]
					}
				],
				"tooltip": "向指定方向移动一格，移动后你将面向这个方向",
				"previousStatement": null,
				"nextStatement": null,
				"colour": 60
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 5, dir: parseInt(block.getFieldValue("DIRECTION"))}];
			}
		},
		{
			name: "simple_repeat",
			json: {
				"message0": "重复%1次",
				"args0": [
					{"type": "field_input", "name": "TIMES", "check": "Number", "text": "若干"}
				],
				"message1": "进行下列操作: %1",
				"args1": [
					{"type": "input_statement", "name": "DO"}
				],
				"previousStatement": null,
				"nextStatement": null,
				"tooltip": "最基本的循环，重复执行同一组指令若干次",
				"colour": 30
			},
			initExtra: function(block){},
			generateJS: function(block) {
				return "extCall1(blockID[stacklvl++], []);" + 
					"for (simpleRepeatVars[stacklvl-1]=0; simpleRepeatVars[stacklvl-1]<" +  
					block.getFieldValue("TIMES") +
					"; simpleRepeatVars[stacklvl-1]++) {" + 
					Blockly.JavaScript.statementToCode(block, "DO") +
					"extCall1(blockID[stacklvl-1], []);}stacklvl--;";
			}
		},
		{
			name: "walk_towards_specific_step_number_and_direction",
			json: {
				"message0": "向前走%1步",
				"args0": [
					{"type": "field_input", "name": "STEP", "check": "Number", "text": "若干"}
				],
				"previousStatement": null,
				"nextStatement": null,
				"tooltip": "向前走一定步数",
				"colour": 30
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 6, step: parseInt(block.getFieldValue("STEP"))}];
			}
		},
		{
			name: "walk_towards_specific_step_number",
			json: {
				"message0": "向%1走",
				"args0": [
					{
						"type": "field_dropdown",
						"name": "DIRECTION",
						"options": [
							[ "下", "0" ],
							[ "右", "1" ],
							[ "上", "2" ],
							[ "左", "3" ]
						]
					}
				],
				"message1": "%1步",
				"args1": [
					{"type": "field_input", "name": "STEP", "check": "Number", "text": "若干"}
				],
				"previousStatement": null,
				"nextStatement": null,
				"tooltip": "向特定方向走一定步数",
				"colour": 30
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 7, dir: parseInt(block.getFieldValue("DIRECTION")), step: parseInt(block.getFieldValue("STEP"))}];
			}
		},
		{
			name: "walk_to_pos",
			json: {
				"message0": "移动到%1 %2",
				"args0": [
					{"type": "field_input", "name": "X", "check": "Number", "text": "x"},
					{"type": "field_input", "name": "Y", "check": "Number", "text": "y"}
				],
				"previousStatement": null,
				"nextStatement": null,
				"tooltip": "走到这",
				"colour": 30
			},
			initExtra: function(block){},
			generateOps: function(block){
				return [{typeId: 8, x: parseInt(block.getFieldValue("X")), y: parseInt(block.getFieldValue("Y"))}];
			}
		}
	]
};
