function Msg()
{
	var content = {
		1000: ["Succeeded", "成功"],
		1001: ["Please log in first.", "请先登录"],
		1002: ["User name can't be empty.", "用户名不能为空"],
		1003: ["Password can't be empty.", "密码不能为空"],
		1004: ["Email can't be empty.", "邮箱不能为空"],
		1005: ["This name already exists.", "这个用户名已经被使用"],
		1006: ["This email address already exists.", "这个邮箱已经被使用"],
		1007: ["This name is too long.", "用户名太长"],
		1008: ["This password is too long.", "密码太长"],
		1009: ["This email address is too long.", "邮箱太长"],
		1010: ["You have already logged in.", "你已经登录"],
		1011: ["This name doesn't exist.", "用户名不存在"],
		1012: ["Wrong password.", "密码错误"],
		1013: ["New password can't be empty.", "新密码不能为空"],
		1014: ["Identifying code can't be empty.", "验证码不能为空"],
		1015: ["Wrong identifying code.", "验证码错误"],
		1016: ["Level id and default level id can't be empty in the same time.", "关卡ID和预置关卡ID不能同时为空"],
		1017: ["This level doesn't exist.", "您已通关"],
		1018: ["The input default level id needs to be an Integer.", "默认关卡ID需要是Int类型"],
		1019: ["The input level id needs to be an Integer.", "关卡ID需要是Int类型"],
		1020: ["Default level id can't be empty.", "默认关卡ID不能为空"],
		1021: ["Level info can't be empty.", "关卡ID不能为空"],
		1022: ["This default level id already exists.", "这个默认关卡已经存在"],
		1023: ["Solution info can't be empty.", "解法信息不能为空"],
		1024: ["Score can't be empty.", "得分不能为空"],
		1025: ["The input score needs to be an Integer.", "得分需要是Int类型"],
		1026: ["The input score needs to be in range[0,4].", "得分需要属于[0,4]区间"],
		1027: ["Level id can't be empty.", "关卡ID不能为空"],
		1028: ["Days can't be empty.", "输入天数不能为空"],
		1029: ["The input days needs to be an Integer.", "天数需要是整数类型"],
		1030: ["The input days needs to be in range[1, 99999].", "天数需要属于区间[1,99999]"],
		1031: ["You don't have operation authority.", "你没有操作权限"],
		1032: ["You can't create more level.", "你无法创建更多关卡"],
		1033: ["Share can't be empty.", "是否分享不能为空"],
		1034: ["The input share needs to be 0 or 1.", "输入的\"是否分享\"需要是0或1"],
		1035: ["Solution id can't be empty.", "解法ID不能为空"],
		1036: ["The input solution id needs to be an Integer.", "解法ID需要是Int类型"],
		1037: ["This solution doesn't exist.", "这个解法不存在"],
		1038: ["The input edit needs to be 0 or 1.", "输入的\"是否编辑修改\"需要是0或1"],
		1039: ["This default level has already had one std solution.", "这个默认关卡已经有标准解法"],
		1040: ["Calculate score error, this default level doesn't have one std solution.", "计算得分错误，这个默认关卡还没有标准解法"],
		1041: ["Solution info dict needs to contain key 'block_num'	solution_info.", "字典中需要包含关键字'block_num'"],
		1042: ["'block_num' in solution_info dict needs to be an Integer.", "solution_info 字典中'block_num'关键字对应值需要是Int类型"],
		1043: ["The level need to be shared before sharing the solution.", "分享解法前需要分享对应关卡"],
		1044: ["You can't cancel share the level.", "你无法取消分享该关卡"],
		1045: ["You can't edit shared level.", "你无法编辑已经分享的关卡"],
		1046: ["Username cannot be numeric only.", "用户名不能只含数字"],
		1047: ["Mobile phone login user has no password.", "手机登录用户没有密码"],
		1048: ["Phone number can't be empty.", "手机号码不能为空"],
		1049: ["Phone number needs to be numeric only.", "手机号码只能包含数字"],
		1050: ["The length of phone number needs to be 11.", "手机号码位数需要是11位"],
		1051: ["If you want to play the VIP level, please recharge VIP first.", "充值会员才能玩会员关卡"],

		3000: ["ERROR", "ERROR"],
		3001: ["Target is out of map.", "目标超出地图边界。"],
		3002: ["Target is an operation floor.", "目标是操作台。"],
		3003: ["Invalid address.", "地址不存在"],
		3011: ["Target is not an operation floor.", "目标不是操作台。"],
		3012: ["I have something in my hand.", "我手里有东西。"],
		3013: ["There is nothing there to load.", "那没什么可拿的。"],
		3014: ["Inbox is empty.", "进材口已经空了。"],
		3015: ["I have nothing in my hand.", "我手里没东西。"],
		3016: ["There is something there.", "那已经有东西了。"],
		3017: ["I can't store it there.", "我不能向进材口丢东西。"],
		3018: ["It's not what we want.", "那个不是我们想要的。"],

		3021: ["I can't load with this in my hand.", "我不能拿着这个读。"],
		3022: ["I can't load from here.", "我不能从这读。"],
		3023: ["I can't store here.", "我不能写。"],
		3024: ["I can't store an item.", "我不能写别的东西。"],
		3025: ["I can't calc an item.", "我不能算别的东西。"],
		
		3051: ["Username can't be empty.", "用户名不能为空。"],
		3052: ["Password can't be empty.", "密码不能为空。"],
		3053: ["Email can't be empty.", "邮箱不能为空。"],
		3054: ["Invalid check password.", "两次输入密码不一致。"],

		3101: ["You should save before share.", "你应该先保存再分享。"],
		3102: ["Solutions must be saved before share.", "解法保存后才能分享。"],

		7000: ["No such function.", "没有这个函数。"],

		9000: ["Network timeout.", "网络请求超时。"]
	}
	var language = 1;
	var msgId = {};

	for (id in content)
	{
		msgId[content[id][0]] = id;
	}

	this.changeLanguage = function(lang)
	{
		switch(lang)
		{
			case "en-US":
				language = 0;
			break;
			case "zh-CN":
				language = 1;
			break;
			default:
				language = 0;
			break;
		}
	};

	this.getMsgId = function(message0)
	{
		return msgId[message0];
	};

	this.getMessage = function(msgId)
	{
		var msgStr = content[msgId];
		if (msgStr == undefined)
			return ("INVALID MSG CODE: " + msgId);
		else
			return (msgStr[language]);
	};
}

var msg = new Msg();
