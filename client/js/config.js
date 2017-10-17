var config = {
	mapWidth: 13,
	mapHeight: 13,

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
				return [{typeId: 3}];
			}
		}
	]
};
