# Doc

## Msg

msg is a map for message between blocks.
1000-1999 is for back-end.
3000-3999 is for logic.

        1000 succeeded    成功
        1001 please log in first    请先登录
        1002 user name can't be empty    用户名不能为空
        1003 password can't be empty    密码不能为空
        1004 email can't be empty    邮箱不能为空
        1005 this name already exists    这个用户名已经被使用
        1006 this email address already exists    这个邮箱已经被使用
        1007 this name is too long    用户名太长
        1008 this password is too long    密码太长
        1009 this email address is too long    邮箱太长
        1010 you have already logged in    你已经登录
        1011 this name doesn't exist    用户名不存在
        1012 wrong password    密码错误
        1013 new password can't be empty    新密码不能为空
        1014 identifying code can't be empty    验证码不能为空
        1015 wrong identifying code    验证码错误
        1016 level id and default level id can't be empty in the same time    关卡ID和预置关卡ID不能同时为空
        1017 this level doesn't exist    这个关卡不存在
        1018 the input default level id needs to be an Integer    默认关卡ID需要是Int类型
        1019 the input level id needs to be an Integer    关卡ID需要是Int类型
        1020 default level id can't be empty    默认关卡ID不能为空
        1021 level info can't be empty    关卡ID不能为空
        1022 this default level id already exists    这个默认关卡已经存在
        1023 solution info can't be empty    解法信息不能为空
        1024 score can't be empty    得分不能为空
        1025 the input score needs to be an Integer    得分需要是Int类型
        1026 the input score needs to be in range[0,4]    得分需要属于[0,4]区间
        1027 level id can't be empty    关卡ID不能为空
        1028 days can't be empty    输入天数不能为空
        1029 the input days needs to be an Integer    天数需要是整数类型
        1030 the input days needs to be in range[1, 99999]    天数需要属于区间[1,99999]

	Functions for other blocks
		class msg
			changeLanguage(lang)
				lang == 0 English
				lang == 1 Chinese
			getMessage(msgId)
				return message
				Look up msgId from map;
				return message.
