function Msg()
{
	var content = {
		logic: [
			["ERROR", "ERROR"],
			["Target is out of map.", "目标超出地图边界。"],
			["Target is an opFloor.", "目标是操作台。"]
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
