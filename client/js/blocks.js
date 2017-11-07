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
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
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
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
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
	},
	21: {
		name: "loadPaper",
		json: {
			"message0": "从操作台%1读取数值",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "操作台上必须放置有数值，手上必须是空的或者有数值。如果手上有数值，旧的数值会被覆盖。操作台上的数值不变",
			"colour": 0
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 21, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	22: {
		name: "storePaper",
		json: {
			"message0": "将数值存放到操作台%1",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "手上必须有数值，操作台必须是空的或者有数值。如果操作台上有数值，旧的数值会被覆盖。手上的数值不变",
			"colour": 0
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 22, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	23: {
		name: "addPaper",
		json: {
			"message0": "将手上的数值加上操作台%1的数值",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "手上和操作台上必须有数值。操作台的数值不会变化",
			"colour": 0
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 23, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	24: {
		name: "subPaper",
		json: {
			"message0": "将手上的数值减去操作台%1的数值",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "手上和操作台上必须有数值。操作台的数值不会变化",
			"colour": 0
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 24, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	25: {
		name: "incPaper",
		json: {
			"message0": "使操作台%1的数值增加1",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "复合操作，操作台上必须有数值，让这个数自增1后再读取到手中。手上必须是空的或者数字，如果是数字则会被覆盖。",
			"colour": 0
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 25, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	26: {
		name: "decPaper",
		json: {
			"message0": "使操作台%1的数值减少1",
			"args0": [
				{"type": "field_input", "name": "ADDRESS", "check": "Number", "text": "0"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "复合操作，操作台上必须有数值，让这个数自减1后再读取到手中。手上必须是空的或者数字，如果是数字则会被覆盖。",
			"colour": 0
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 26, address: parseInt(block.getFieldValue("ADDRESS"))}];
		}
	},
	31: {
		name: "inbox",
		json: {
			"message0": "从进货口拿取",
			"tooltip": "手上必须是空的。进货序列在地图上方。",
			"previousStatement": null,
			"nextStatement": null,
			"colour": 90
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 31}];
		}
	},
	32: {
		name: "outbox",
		json: {
			"message0": "向出货口放置",
			"tooltip": "手上的东西必须是出货口所需要的。需求序列在地图上方。",
			"previousStatement": null,
			"nextStatement": null,
			"colour": 90
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 32}];
		}
	},
	50: {
		name: "fin",
		json: {
			"message0": "fin",
			"tooltip": "fin",
			"previousStatement": null,
			"nextStatement": null,
			"colour": 180
		},
		initExtra: function(block){},
		generateOps: function(block){
			return [{typeId: 50}];
		}
	},
	41: {
		name: "simple_branch",
		json: {
			"message0": "如果手上的数%1零",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "OP",
					"options": [
						[ "小于", "0" ],
						[ "等于", "1" ],
						[ "大于", "2" ]
					]
				}
			],
			"message1": "进行下列操作:",
			"args1": [],
			"message2": "%1",
			"args2": [
				{"type": "input_statement", "name": "DO"}
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "最基本的判断，满足条件时执行",
			"colour": 130
		},
		initExtra: function(block){},
		generateJS: function(block) {
			return "ifBranchOp=[{typeId: 41, op: " +  
				block.getFieldValue("OP") +
				"}];ifBranchRet=extCall1(blockID[stacklvl++], ifBranchOp); if (ifBranchRet[0]) {" + 
				Blockly.JavaScript.statementToCode(block, "DO") +
				"extCall1(blockID[stacklvl-1], []);}stacklvl--;";
		}
	},
	42: {
		name: "simple_procedure",
		json: {
			"message0": "定义函数%1",
			"args0": [
				{"type": "field_input", "name": "NAME", "text": "function_name"},
			],
			"message1": "%1",
			"args1": [
				{"type": "input_statement", "name": "DO"}
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "最基本的函数，调用时执行函数内的语句",
			"colour": 250
		},
		initExtra: function(block){},
		generateJS: function(block) {
			var fun_name = "userDefinedSimpleProcedureWithName" + 
				config.blocklyConstants.userDefinedNamePacker(block.getFieldValue("NAME"));
			return "extCall2(blockID[stacklvl], {typeId: 42, op: \"" +
				fun_name +
				"\"});" +
				fun_name +
				" = function(blockId){return function(){" + 
				"extCall1(blockId, []);" + 
				Blockly.JavaScript.statementToCode(block, "DO") + 
				"extCall1(blockId, []);" + 
				"};}(blockID[stacklvl]);";
		}
	},
	43: {
		name: "call_simple_procedure",
		json: {
			"message0": "调用函数%1",
			"args0": [
				{"type": "field_input", "name": "NAME", "text": "function_name"},
			],
			"previousStatement": null,
			"nextStatement": null,
			"tooltip": "调用你所定义的函数",
			"colour": 270
		},
		initExtra: function(block){},
		generateJS: function(block) {
			var fun_name = "userDefinedSimpleProcedureWithName" + 
				config.blocklyConstants.userDefinedNamePacker(block.getFieldValue("NAME"));
			return "extCall2(blockID[stacklvl++], {typeId: 43, op: \"" + 
				fun_name +
				"\"});" + 
				fun_name +
				"();extCall1(blockID[--stacklvl], []);";
		}
	}
};
