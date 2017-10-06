from models import User

def register(_name, _password, _email):
    #TODO email verification

    if len(_name) >= 20:
        return 'this name is too long'
    if len(_password) >= 20:
        return 'this password is too long'
    if len(_email) >= 50:
        return 'this email is too long'
    name_filter = User.objects.filter(name = _name)
    if len(name_filter) >= 1:
        return 'this name already exists'
    email_filter = User.objects.filter(email = _email)
    if len(email_filter) >= 1:
        return 'this email already exists'
    User.objects.create(name = _name, password = _password, email = _email)
    return 'success'

def login(_name, _password):
    #TODO return user info(such as email, level ...)

    name_filter = User.objects.filter(name = _name)
    if name_filter == 0:
        return 'this name does not exist'
    user = name_filter[0]
    if user.password != _password:
        return 'wrong password'
    return 'success'