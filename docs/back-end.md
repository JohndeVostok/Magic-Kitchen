# Doc

## Back-end

### Register
        POST('/api/register'), attributes: name = nameStr, password = passwordStr, email = emailStr
        return json dict:
            status = 1000
            status = 1002
            status = 1003 
            status = 1004
            status = 1005
            status = 1006
            status = 1007
            status = 1008
            status = 1009
            status = 1010
            status = 1046

### Login
        POST('/api/login'), attributes: name = nameStr, password = passwordStr
        return json dict:
            status = 1000
            status = 1002
            status = 1003
            status = 1010
            status = 1011
            status = 1012
            status = 1046

### Logout
        POST('/api/logout')
        return json dict:
            status = 1000

### Change Password
        一、已登录（知道密码）

        要求用户必须登录后才能用这种方式修改密码，将修改正在登录的用户的密码
        Post('/api/change_password_after_login'), attributes: new_password = new_passwordstr
        return json dict:
            status = 1000
            status = 1001
            status = 1008
            status = 1013
            status = 1047


        二、忘记密码，通过邮箱找回

        首先通过用户名向绑定的邮箱发送验证码。注意，即使邮件发送失败（如网络问题），依然会返回succeeded。
        Post('/api/change_password_by_email'), attributes: name = namestr
        return json dict:
            status = 1000
            status = 1002
            status = 1011
            status = 1046

        之后通过得到的验证码来修改密码。
        Post('/api/change_password_by_identifying_code'), attributes: name = namestr, identifying_code = identCodeStr, new_password = new_passwordstr
        return json dict:
            status = 1000
            status = 1002
            status = 1008
            status = 1011
            status = 1013
            status = 1014
            status = 1015
            status = 1046

### Get Current User Info
        Post('/api/get_current_user_info')
        返回目前登录的用户信息
        注意，solution_dict是一个dict的json字符串，dict格式为{ level_id : solution_id},level_id本应是int，但由于json的key只能是str，所以解析json后，dict的key会是str，如{'2' : 3}
        solution_dict中不保存该用户没有通过的关卡

        return json dict:
            status = 1000
                user_name = user_name_str
                email = email_str
                solution_dict = solution_dict_jsonStr 
                created_level = created_level_id_list_jsonStr
                next_default_level_id = id_Int #返回已创建的默认关卡中default_level_id最小的未通过的关卡，不保证有权限玩（如已经玩完所有非vip关卡，会返回第一个vip关卡）。如已完成所有关卡，则返回-1。
                is_mobile_phone_user = int (1 means is mobile phone user, 0 means is not mobile phone user)
                is_VIP = int (1 means is VIP, 0 means is not VIP)

            status = 1001

### Get Level Info
        Post('/api/get_level_info'), attributes: level_id = idInt, default_level_id = idInt (两个参数只传一个即可)
        注意，这里的参数level_id & default_level_id是一个int类型，但如果传类似'233'这样的string也没问题（加入了类型转换），但是类似'abc'或'2.33'就会引起错误，所以还是建议直接传int类型
        default_level_id是指预置关卡的第id关，例如希望get预置关卡第2关的信息，就传参数default_level_id = 2
        level_id则用来get任意一关（可以是预置关卡，也可以是用户创建关卡，但是建议用来get用户创建关卡）
        关于这两个参数在数据库中的存储：level_id是AutoField，也就是每个level_id唯一对应一个关卡；default_level_id则不是，用户创建的关卡的default_level_id都为-1。
        游戏的前5个关卡提供试玩,用户在登录或未登录状态下均可进行游戏（调用API），从第5关以后的关卡需要用户登录且具有VIP权限。这里的“第五关之后”是指default_level_id>5。
        只有管理员和关卡作者可以获得未分享关卡信息。
        返回值中的level_id表示这个关卡的内置id，用于记录解法等信息。

        return json dict:
            status = 1000
                level_info = json_info_str
				level_id = id
                shared = shared_bool
                block_num = block_num_int(-2 means not default level, -1 means default level have no std solution)
            status = 1001
            status = 1016
            status = 1017
            status = 1018
            status = 1019
            status = 1031
            status = 1051
            

### New Default Level
        Post('/api/new_default_level'), attributes: default_level_id = idInt, level_info = jsonStr, edit = Int(0 or 1, 0 means create, 1 means edit) 
        创建预置关卡
        若想修改已存在的预置关卡，则传入参数edit = 1;  注意，传入这个参数时要求该关卡已经存在。

        TODO:目前只要POST就可以创建默认关卡，而不需要admin权限或其他手段

        return json dict:
            status = 1000
                level_id = new_level_id_Int
            status = 1001
            status = 1017
            status = 1018
            status = 1020
            status = 1021
            status = 1022
            status = 1031
            
### New Usermade Level
        Post('/api/new_usermade_level'), attributes: level_info = jsonStr
        用户必须登录后才能创建关卡
        普通用户最多创建10个关卡，VIP用户最多创建30个关卡

        return json dict:
            status = 1000
                level_id = new_level_id_Int
            status = 1001
            status = 1021
            status = 1032

### Share Level
        Post('/api/share_level'), attributes: level_id = idInt, share = Int(1 means share)
        目前暂不支持取消分享关卡，所以参数share 只能为1。
        用户必须登录才能分享/取消分享关卡。只有该关卡的创建者或管理员才有操作权限。
        分享解法前需要分享对应关卡。

        return json dict:
            status = 1000
            status = 1001
            status = 1017
            status = 1019
            status = 1027
            status = 1031
            status = 1033
            status = 1034
            status = 1044

### Get All Level
        Post('/api/get_all_level')
        用户必须登录，且具有管理员及以上权限才可以调用该API。
        未登录用户、普通用户及VIP只能看到其他用户分享的关卡，未分享的关卡无法看到。之后会提供获得分享关卡的API。

        return json dict:
            status = 1000
                all_level = all_level_id_list_jsonStr
            status = 1001
            status = 1031

### Get All Private Level
        Post('/api/get_all_private_level')
        返回所有当前用户创建关卡中未被分享的部分。
        如果没有登录，不会报错，但会返回空列表。

        return json dict:
            status = 1000
                all_private_level = all_private_level_id_list_jsonStr

### Get All Shared Level
        Post('/api/get_all_shared_level')
        不需要登录即可调用此API。
        返回所有的非默认关卡中被分享的部分。

        return json dict:
            status = 1000
                all_shared_level = all_shared_level_id_list_jsonStr

### Get All Default Level
        Post('/api/get_all_default_level')

        return json dict:
            status = 1000
                level = list_jsonStr 其格式为[{'default_level_id': id_int, 'status': status_int}, {...}]
                其中，status = 0/1/2，0表示有权限玩但是未通过，1表示没有权限玩vip关卡，2表示已通过


### Change Level Info
        Post('/api/change_level_info'), attributes: level_id = idInt, level_info = jsonStr
        只有关卡创建者及管理员有权限修改关卡信息。
        不能修改已分享的关卡。
        关卡修改后，若已经有之前创建好的解法，则解法得分都将被置0，因为这些解法可能无法再次通过关卡。不过由于只有未分享的关卡可以修改，所以应该只有关卡创建者自己创建过这关的解法。

        return json dict:
            status = 1000
            status = 1001
            status = 1017
            status = 1019
            status = 1021
            status = 1027
            status = 1031
            status = 1045
    
### New Std Solution
        Post('/api/new_std_solution') attributes: default_level_id= idInt, solution_info= jsonStr, edit= Int(0 or 1, 0 means create, 1 means edit) 
        只有管理员可以调用此API。
        因为只有默认关卡才有标准解法，所以传的参数需要是default_level_id而不是level_id。
        若原本该关卡没有标准解法，则无论edit是0还是1，都会创建一个标准解法；但如果原本有标准解法，edit又为0，则会报错。
        由于暂时没有需要显示标准解法的需求，所以为了安全考虑，不会在get_level_info中返回默认关卡的std_solution_id，std solution目前仅用于和用户解法作对比进行打分。
        参数solution_info需要是一个字典的json字符串，字典中必须包含关键字'block_num'，其值即为该解法用的块数(Int)，用于计算得分

        return json dict:
            status = 1000
                solution_id = solution_id_Int
            status = 1001
            status = 1017
            status = 1018
            status = 1020
            status = 1023
            status = 1031
            status = 1038
            status = 1039
            status = 1041
            status = 1042

### New Solution
        Post('/api/new_solution') , attributes: level_id: idInt, solution_info= jsonStr
        必须登录才能够post，会将session作为username存入该Solution
        一个用户对同一个关卡只保存一个解法，最新创建的解法将覆盖之前对该关卡的解法
        参数solution_info需要是一个字典的json字符串，字典中必须包含关键字'block_num'，其值即为该解法用的块数(Int)，用于计算得分
        如果level_id对应的是一个默认关卡，则要求该默认关卡已经有标准解法（否则无法计算得分）
        关卡修改后，若已经有之前创建好的解法，则解法得分都将被置0，因为这些解法可能无法再次通过关卡。不过由于只有未分享的关卡可以修改，所以应该只有关卡创建者自己创建过这关的解法。

        return json dict:
            status = 1000
                solution_id = solution_id_Int
            status = 1001
            status = 1017
            status = 1019
            status = 1023
            status = 1027
            status = 1040
            status = 1041
            status = 1042

### Get Solution Info
        Post('/api/get_solution_info'), attributes: solution_id = solution_id_Int
        只有管理员和关卡作者可以获得未分享解法信息。

        return json dict:
            status = 1000
                solution_info = solution_info_jsonStr
                score = score_Int([0,4])
                level_id = level_id_Int (this solution belongs to)
                author = author_name_Str
                shared = shared_Bool
            status = 1001
            status = 1031
            status = 1035
            status = 1036
            status = 1037

### Share Solution
        Post('/api/share_solution'), attributes: solution_id = solution_id_Int, share = Int(0 or 1, 0 means not share, 1 means share)
        用户必须登录才能分享/取消分享解法。只有该解法的创建者或管理员才有操作权限。
        分享解法前需要分享对应关卡。

        return json dict:
            status = 1000
            status = 1001
            status = 1031
            status = 1033
            status = 1034
            status = 1035
            status = 1036
            status = 1037
            status = 1043

### Get All Shared Solution
        Post('/api/get_all_shared_solution')
        不需要登录即可调用此API。

        return json dict:
            status = 1000
                all_shared_solution = all_shared_solution_id_list_jsonStr

### VIP Charge
        Post('/api/vip_charge'), attributes: days = day_num_Int
        要求days属于区间[1,99999]

        return json dict:
            status = 1000
            status = 1001
            status = 1028
            status = 1029
            status = 1030

### Set Admin
        Post('/api/set_admin'), attributes: name = user_name_str
        要求已登录，且拥有超级管理员权限。参数name为待设置为管理员的用户名。

        关于创建超级管理员的方法：我在网上找到的创建django自带超级管理员的方法好像不能使用我们自己的model，所以现在并没有找到太好的办法，暂时可以先直接操作数据库来创建，方法如下：
            python manage.py shell < create_super_admin.py
        运行脚本 run.sh也可以创建超级管理员，同时更新启动服务器。
        超级管理员用户名为super_admin，初始密码为pw。
        若之前创建过超级管理员，则不会再次创建。
        等忙完手里的活，我再看一下有没有更好的（例如通过配置文件）创建自己model的超级管理员的方法。

        return json dict:
            status = 1000
            status = 1001
            status = 1002
            status = 1011
            status = 1031

### Send Code To Mobile Phone User
        Post('/api/send_code_to_mobile_phone_user'), attributes: phone_number = number_str (numeric only, length = 11)

        return json dict:
            status = msgid.SUCCESS
            status = msgid.ALREADY_LOGIN
            status = msgid.PHONE_NUMBER_EMPTY
            status = msgid.PHONE_NUMBER_NUMERIC_ONLY
            status = msgid.PHONE_NUMBER_LENGTH_WRONG

### Login With Phone Number
        Post('/api/login_with_phone_number'), attributes: phone_number = number_str (numeric only, length = 11), identifying_code = identCode_str

        return json dict:
            status = msgid.SUCCESS
            status = msgid.ALREADY_LOGIN
            status = msgid.PHONE_NUMBER_EMPTY
            status = msgid.PHONE_NUMBER_NUMERIC_ONLY
            status = msgid.PHONE_NUMBER_LENGTH_WRONG
            status = msgid.IDENTIFY_CODE_EMPTY
            status = msgid.WRONG_IDENTIFY_CODE
