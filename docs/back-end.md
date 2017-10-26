# Doc

## Back-end

### Register
        POST('/api/register'), attributes: name = nameStr, password = passwordStr, email = emailStr
        return json:
            status = 'succeeded' ---------succeeded
            status = 'failed'  ---------failed
                error = 'user name can't be empty'
                error = 'password can't be empty' 
                error = 'email can't be empty'
                error = 'this name is too long'
                error = 'this password is too long'
                error = 'this email address is too long'
                error = 'this name already exists'
                error = 'this email address already exists'
                error = 'you have already logged in'

### Login
        POST('/api/login'), attributes: name = nameStr, password = passwordStr
        return json:
            status = 'succeeded' ---------succeeded
            status = 'failed'  ---------failed
                error = 'user name can't be empty'
                error = 'password can't be empty' 
                error = 'this name doesn't exist'
                error = 'wrong password'
                error = 'you have already logged in'

### Logout
        POST('/api/logout')
        return json:
            status = 'succeeded' ---------succeeded

### Change Password
        一、已登录（知道密码）

        要求用户必须登录后才能用这种方式修改密码，将修改正在登录的用户的密码
        Post('/api/change_password_after_login'), attributes: new_password = new_passwordstr
        return json:
            status = 'succeeded' ---------succeeded
            status = 'failed'
                error = 'please log in first'
                error = 'new password can't be empty'
                error = 'this password is too long'


        二、忘记密码，通过邮箱找回

        首先通过用户名向绑定的邮箱发送验证码。注意，即使邮件发送失败（如网络问题），依然会返回succeeded。
        Post('/api/change_password_by_email'), attributes: name = namestr
        return json:
        status = 'succeeded' ---------succeeded
        status = 'failed'  ---------failed
            error = 'user name can't be empty'
            error = 'this name doesn't exist'

        之后通过得到的验证码来修改密码。
        Post('api/change_password_by_identifyingCode'), attributes: name = namestr, identifyingCode = identCodeStr, new_password = new_passwordstr
        return json:
        status = 'succeeded' ---------succeeded
        status = 'failed'  ---------failed
            error = 'user name can't be empty'
            error = 'identifying code can't be empty'
            error = 'new password can't be empty'
            error = 'this name doesn't exist'
            error = 'this password is too long'
            error = 'wrong identifying code'



### Get Level Info
        Post('/api/get_level_info'), attributes: level_id = idInt, default_level_id = idInt (两个参数只传一个即可)
        注意，这里的参数level_id & default_level_id是一个int类型，但如果传类似'233'这样的string也没问题（加入了类型转换），但是类似'abc'或'2.33'就会引起错误，所以还是建议直接传int类型
        default_level_id是指预置关卡的第id关，例如希望get预置关卡第2关的信息，就传参数default_level_id = 2
        level_id则用来get任意一关（可以是预置关卡，也可以是用户创建关卡，但是建议用来get用户创建关卡）
        关于这两个参数在数据库中的存储：level_id是AutoField，也就是每个level_id唯一对应一个关卡；default_level_id则不是，用户创建的关卡的default_level_id都为-1。
        

        return json:
        status = 'succeeded' ---------succeeded
            level_info = json_info_str

        status = 'failed'  ---------failed
            error = level id and default level id can't be empty in the same time'
            error = 'this level doesn't exist'
            error = 'the input level id needs to be an Integer' 类型转换发生错误ValueError时将返回这个error信息
            error = 'the input default level id needs to be an Integer'
            

### New Default Level
        Post('/api/new_default_level'), attributes: default_level_id = idInt, level_info = jsonStr
        创建预置关卡

        TODO:目前只要POST就可以创建默认关卡，而不需要admin权限或其他手段

        return json:
        status = 'succeeded' ---------succeeded

        status = 'failed'  ---------failed
            error = 'default level id can't be empty'
            error = 'level info can't be empty'
            error = 'this default level id already exists'
            error = 'the input default level id needs to be an Integer' 类型转换发生错误ValueError时将返回这个error信息

### New Usermade Level
        Post('/api/new_usermade_level'), attributes: level_info = jsonStr
        用户必须登录后才能创建关卡

        return json:
        status = 'succeeded' ---------succeeded

        status = 'failed'  ---------failed
            error = 'please log in first'
            error = 'level info can't be empty'
    
### New Solution
        c.post('/api/new_solution') , attributes: level_id: idInt, solution_info: jsonStr, score: scoreInt
        其中，score应该是[0,4]的整数，0表示未通过，1～3表示评级，4表示通过（用户自定义关卡仅记是否通过，不评级）
        必须登录才能够post，会将session作为username存入该Solution

        return json:
        status = 'succeeded' ---------succeeded

        status = 'failed'  ---------failed
            error = 'please log in first'
            error = 'level id can't be empty'
            error = 'solution info can't be empty'
            error = 'score can't be empty'
            error = 'this level doesn't exist'
            error = 'the input level id needs to be an Integer' 类型转换发生错误ValueError时将返回这个error信息
            error = 'the input score needs to be an Integer'
            error = 'the input score needs to be in range[0,4]'