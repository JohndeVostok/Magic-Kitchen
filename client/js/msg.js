function Msg()
{
	var content = {
		logic: [
			["ERROR", "ERROR"],
			["Target is out of map.", "目标超出地图边界。"],
			["Target is an operation floor.", "目标是操作台。"],
			["Invalid address.", "地址不存在"],
			[],[],[],[],[],[],[],
			["Target is not an operation floor.", "目标不是操作台。"],
			["I have something in my hand.", "我手里有东西。"],
			["There is nothing there to load", "那没什么可拿的。"],
			["Inbox in empty.", "进材口已经空了。"],
			["I have nothing in my hand.", "我手里没东西。"],
			["There is something there.", "那已经有东西了。"],
			["I can't store to there.", "我不能向进材口丢东西。"],
			["It's not what we want.", "那个不是我们想要的。"]
		]
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
		if (3000 <= msgId && msgId < 4000)
		{
			return content.logic[msgId - 3000][language];
		}
		return undefined;
	};
}

var msg = new Msg();
