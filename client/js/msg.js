function Msg()
{
	var content = {
		EMPTY_USERNAME: ["Username can't be empty.", "用户名不能为空！"],
		EMPTY_PASSWORD: ["Password can't be empty.", "密码不能为空！", ]
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

	this.getMessage = function(str)
	{
		var s = content[str][language];
		if (s == undefined)
			return undefined;
		else
			return s;
	};
}

var msg = new Msg();
