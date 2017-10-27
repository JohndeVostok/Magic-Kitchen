var blocks = {
	0: {
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
	1: {
		name: "single_step_forward",
		json: {
			"message0": "向前走一步",
			"tooltip": "按照当前方向向前行进一步",
			"previousStatement": null,
			"nextStatement": null,
			"colour": 90
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 1}];
		}
	},
	2: {
		name: "rotate",
		json: {
			"message0": "向%1转",
			"tooltip": "以当前方向为基准进行转向",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "ANGLE",
					"options": [
						[ "左", "1" ],
						[ "后", "2" ],
						[ "右", "3" ]
					]
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": 180
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{
				typeId: 2,
				dir: parseInt(block.getFieldValue("ANGLE"))
			}];
		}
	},
	3: {
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
			"colour": 160
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 5, dir: parseInt(block.getFieldValue("DIRECTION"))}];
		}
	},
	4: {
		name: "walk_towards_specific_step_number_and_direction",
		json: {
			"message0": "向前走%1步",
			"args0": [
				{"type": "field_input", "name": "STEP", "check": "Number", "text": "若干"}
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "向前走一定步数",
			"colour": 110
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 6, step: parseInt(block.getFieldValue("STEP"))}];
		}
	},
	5: {
		name: "walk_towards_specific_step_number",
		json: {
			"message0": "向%1走%2步",
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
				},
				{"type": "field_input", "name": "STEP", "check": "Number", "text": "若干"}
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "向特定方向走一定步数",
			"colour": 130
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 7, dir: parseInt(block.getFieldValue("DIRECTION")), step: parseInt(block.getFieldValue("STEP"))}];
		}
	},
	6: {
		name: "walk_to_pos",
		json: {
			"message0": "走到%1 %2",
			"args0": [
				{"type": "field_input", "name": "X", "check": "Number", "text": "x"},
				{"type": "field_input", "name": "Y", "check": "Number", "text": "y"}
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "走到这",
			"colour": 140
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 8, x: parseInt(block.getFieldValue("X")), y: parseInt(block.getFieldValue("Y"))}];
		}
	},
	7: {
		name: "pick_up",
		json: {
			"message0": "拿起物品",
			"tooltip": "将所在位置的操作台上的物品拿到头顶",
			"previousStatement": null,
			"nextStatement": null,
			"colour": 270
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 3}];
		}
	},
	8: {
		name: "put_down",
		json: {
			"message0": "放下物品",
			"tooltip": "将头顶的物品放置到所在位置的操作台上",
			"previousStatement": null,
			"nextStatement": null,
			"colour": 360
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 4}];
		}
	},
	9: {
		name: "load",
		json: {
			"message0": "从%1读取",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "address"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "load",
			"colour": 280
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 9, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	10: {
		name: "store",
		json: {
			"message0": "存到%1",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "address"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "load",
			"colour": 350
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 10, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	11: {
		name: "simple_repeat",
		json: {
			"message0": "重复%1次",
			"args0": [
				{"type": "field_input", "name": "TIMES", "check": "Number", "text": "若干"}
			],
			"message1": "进行下列操作:",
			"args1": [],
			"message2": "%1",
			"args2": [
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
	}
};
