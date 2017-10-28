# Doc

## Msg

msg is a map for message between blocks.
1000-1999 is for back-end.
3000-3999 is for logic.

        1000 succeeded
        1001 please log in first
        1002 user name can't be empty
        1003 password can't be empty
        1004 email can't be empty
        1005 this name already exists
        1006 this email address already exists
        1007 this name is too long
        1008 this password is too long
        1009 this email address is too long
        1010 you have already logged in
        1011 this name doesn't exist
        1012 wrong password
        1013 new password can't be empty
        1014 identifying code can't be empty
        1015 wrong identifying code
        1016 level id and default level id can't be empty in the same time
        1017 this level doesn't exist
        1018 the input default level id needs to be an Integer
        1019 the input level id needs to be an Integer
        1020 default level id can't be empty
        1021 level info can't be empty
        1022 this default level id already exists
        1023 solution info can't be empty
        1024 score can't be empty
        1025 the input score needs to be an Integer
        1026 the input score needs to be in range[0,4]
        1027 level id can't be empty

	Functions for other blocks
		class msg
			changeLanguage(lang)
				lang == 0 English
				lang == 1 Chinese
			getMessage(msgId)
				return message
				Look up msgId from map;
				return message.
