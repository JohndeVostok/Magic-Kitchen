# Doc

## Msg

msg is a map for message between blocks.
1000-1999 is for back-end.
3000-3999 is for logic.
7000-7999 is for code.
9000-9999 is for network.

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
        1021 level info can't be empty    关卡信息不能为空
        1022 this default level id already exists    这个默认关卡已经存在
        1023 solution info can't be empty    解法信息不能为空
        1024 score can't be empty    得分不能为空
        1025 the input score needs to be an Integer    得分需要是Int类型
        1026 the input score needs to be in range[0,4]    得分需要属于[0,4]区间
        1027 level id can't be empty    关卡ID不能为空
        1028 days can't be empty    输入天数不能为空
        1029 the input days needs to be an Integer    天数需要是整数类型
        1030 the input days needs to be in range[1, 99999]    天数需要属于区间[1,99999]
        1031 you don't have operation authority    你没有操作权限
        1032 you can't create more level    你无法创建更多关卡
        1033 share can't be empty    是否分享不能为空
        1034 the input share needs to be 0 or 1 输入的"是否分享"需要是0或1
        1035 solution id can't be empty    解法ID不能为空
        1036 the input solution id needs to be an Integer    解法ID需要是Int类型
        1037 this solution doesn't exist    这个解法不存在
        1038 the input edit needs to be 0 or 1    输入的"是否编辑修改"需要是0或1
        1039 this default level has already had one std solution    这个默认关卡已经有标准解法
        1040 calculate score error, this default level doesn't have one std solution    计算得分错误，这个默认关卡还没有标准解法
        1041 solution info dict needs to contain key 'block_num'    solution_info 字典中需要包含关键字'block_num'
        1042 'block_num' in solution_info dict needs to be an Integer    solution_info 字典中'block_num'关键字对应值需要是Int类型
        1043 the level need to be shared before sharing the solution    分享解法前需要分享对应关卡
        1044 you can't cancel share the level    你无法取消分享该关卡
        1045 you can't edit shared level    你无法编辑已经分享的关卡
        1046 username cannot be numeric only    用户名不能只含数字
        1047 mobile phone login user has no password    手机登录用户没有密码
        1048 phone number can't be empty    手机号码不能为空
        1049 phone number needs to be numeric only    手机号码只能包含数字
        1050 the length of phone number needs to be 11    手机号码位数需要是11位
        1051 if you want to play the VIP level, please recharge VIP first    充值会员才能玩会员关卡

	Functions for other blocks
		class msg
			changeLanguage(lang)
				lang == 0 English
				lang == 1 Chinese
			getMessage(msgId)
				return message
				Look up msgId from map;
				return message.
