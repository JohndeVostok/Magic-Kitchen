function Msg()
{
	var content = {
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
		3017: ["I can't store to there.", "我不能向进材口丢东西。"],
		3018: ["It's not what we want.", "那个不是我们想要的。"]
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
			str = "INVALID MSG CODE";
		else
			str = msgStr[language];
		return str;
	};
}

var msg = new Msg();
