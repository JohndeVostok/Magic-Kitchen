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

### Login
        GET('/api/login?name=nameStr&password=passwordStr')
        return json:
            status = 'succeeded' ---------succeeded
            status = 'failed'  ---------failed
                error = 'user name can't be empty'
                error = 'password can't be empty' 
                error = 'this name does't exist'
                error = 'wrong password'
