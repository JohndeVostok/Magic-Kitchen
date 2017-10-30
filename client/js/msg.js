function Msg()
{
	var content = {
		1000: ["succeeded", "成功"],
		1001: ["please log in first.", "请先登录"],
		1002: ["user name can't be empty.", "用户名不能为空"],
		1003: ["password can't be empty.", "密码不能为空"],
		1004: ["email can't be empty.", "邮箱不能为空"],
		1005: ["this name already exists.", "这个用户名已经被使用"],
		1006: ["this email address already exists.", "这个邮箱已经被使用"],
		1007: ["this name is too long.", "用户名太长"],
		1008: ["this password is too long.", "密码太长"],
		1009: ["this email address is too long.", "邮箱太长"],
		1010: ["you have already logged in.", "你已经登录"],
		1011: ["this name doesn't exist.", "用户名不存在"],
		1012: ["wrong password.", "密码错误"],
		1013: ["new password can't be empty.", "新密码不能为空"],
		1014: ["identifying code can't be empty.", "验证码不能为空"],
		1015: ["wrong identifying code.", "验证码错误"],
		1016: ["level id and default level id can't be empty in the same time.", "关卡ID和预置关卡ID不能同时为空"],
		1017: ["this level doesn't exist.", "这个关卡不存在"],
		1018: ["the input default level id needs to be an Integer.", "默认关卡ID需要是Int类型"],
		1019: ["the input level id needs to be an Integer.", "关卡ID需要是Int类型"],
		1020: ["default level id can't be empty.", "默认关卡ID不能为空"],
		1021: ["level info can't be empty.", "关卡ID不能为空"],
		1022: ["this default level id already exists.", "这个默认关卡已经存在"],
		1023: ["solution info can't be empty.", "解法信息不能为空"],
		1024: ["score can't be empty.", "得分不能为空"],
		1025: ["the input score needs to be an Integer.", "得分需要是Int类型"],
		1026: ["the input score needs to be in range[0,4].", "得分需要属于[0,4]区间"],
		1027: ["level id can't be empty.", "关卡ID不能为空"],

		3000: ["ERROR", "ERROR"],
		3001: ["Target is out of map.", "目标超出地图边界。"],
		3002: ["Target is an operation floor.", "目标是操作台。"],
		3003: ["Invalid address.", "地址不存在"],
		3011: ["Target is not an operation floor.", "目标不是操作台。"],
		3012: ["I have something in my hand.", "我手里有东西。"],
		3013: ["There is nothing there to load", "那没什么可拿的。"],
		3014: ["Inbox in empty.", "进材口已经空了。"],
		3015: ["I have nothing in my hand.", "我手里没东西。"],
		3016: ["There is something there.", "那已经有东西了。"],
		3017: ["I can't store it there.", "我不能向进材口丢东西。"],
		3018: ["It's not what we want.", "那个不是我们想要的。"],
		3051: ["Username can't be empty.", "用户名不能为空。"],
		3052: ["Password can't be empty.", "密码不能为空。"],
		3053: ["Email can't be empty.", "邮箱不能为空。"],
		3054: ["Invalid check password.", "两次输入密码不一致。"],
		9000: ["Network timeout.", "网络请求超时。"]
	}
	var language = 0;

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

	this.getMessage = function(msgId)
	{
		var msgStr = content[msgId];
		var str = "";
		if (msgStr == undefined)
			str = "INVALID MSG CODE: " + msgId;
		else
			str = msgStr[language];
		return str;
	};
}

var msg = new Msg();
