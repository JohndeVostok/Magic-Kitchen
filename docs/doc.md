# Doc

## Back-end

### Register
        POST('/api/register'), attributes: name = nameStr, password = passwordStr, email = eamilStr
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
        GET('/api/login?name=nameStr&password=passwordStr')
        return json:
            status = 'succeeded' ---------succeeded
            status = 'failed'  ---------failed
                error = 'user name can't be empty'
                error = 'password can't be empty' 
                error = 'this name does't exist'
                error = 'wrong password'
                error = 'you have already logged in'

### Logout
        GET('/api/logout')
        return json:
            status = 'succeeded' ---------succeeded

### Change Password
        要求用户必须登录后才能用这种方式修改密码，将修改正在登录的用户的密码
        Post('/api/change_password_after_login'), attributes: new_password = new_passwordstr
        return json:
            status = 'succeeded' ---------succeeded
            status = 'failed'
                error = 'please log in first'
                error = 'new password can't be empty'
                error = 'this password is too long'
