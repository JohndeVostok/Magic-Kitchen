# Doc

## Msg

msg is a map for message between blocks.
1000-1999 is for back-end.
3000-3999 is for logic.

	Functions for other blocks
		class msg
			changeLanguage(lang)
				lang == 0 English
				lang == 1 Chinese
			getMessage(msgId)
				return message
				Look up msgId from map;
				return message.
