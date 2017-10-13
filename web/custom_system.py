from models import User
import json
from django.http import HttpResponse 

def json_response(info):
    return HttpResponse(json.dumps(info), content_type="application/json")

def get_session(request):
    return request.session.get('name', None)

def change_password_to(_name, _password):
    name_filter = User.objects.filter(name = _name)
    user = name_filter[0]
    user.password = _password
    user.save()

#this request need to be POST
def register(request): 
    #TODO email verification

    content = request.POST

    ret = {}
    ret['status'] = 'failed'

    session = get_session(request)
    if (session != None):
        ret['error'] = 'you have already logged in'
        return json_response(ret)

    if not 'name' in content:
        ret['error'] = 'user name can\'t be empty'
        return json_response(ret)

    if not 'password' in content:
        ret['error'] = 'password can\'t be empty'
        return json_response(ret)

    if not 'email' in content:
        ret['error'] = 'email can\'t be empty'
        return json_response(ret)

    _name = content['name']
    _email = content['email']
    _password = content['password']

    if len(_name) >= 20:
        ret['error'] = 'this name is too long'
        return json_response(ret)

    if len(_password) >= 20:
        ret['error'] = 'this password is too long'
        return json_response(ret)

    if len(_email) >= 50:
        ret['error'] = 'this email address is too long'
        return json_response(ret)

    name_filter = User.objects.filter(name = _name)
    if len(name_filter) >= 1:
        ret['error'] = 'this name already exists'
        return json_response(ret)

    email_filter = User.objects.filter(email = _email)
    if len(email_filter) >= 1:
        ret['error'] = 'this email address already exists'
        return json_response(ret)

    User.objects.create(name = _name, password = _password, email = _email)
    ret['status'] = 'succeeded'
    return json_response(ret)

def login(request):
    #TODO return user info(such as email, level ...)

    content = request.GET

    ret = {}
    ret['status'] = 'failed'

    session = get_session(request)
    if (session != None):
        ret['error'] = 'you have already logged in'
        return json_response(ret)

    if not 'name' in content:
        ret['error'] = 'user name can\'t be empty'
        return json_response(ret)

    if not 'password' in content:
        ret['error'] = 'password can\'t be empty'
        return json_response(ret)

    _name = content['name']
    _password = content['password']

    name_filter = User.objects.filter(name = _name)

    if len(name_filter) == 0:
        ret['error'] = 'this name does\'t exist'
        return json_response(ret)

    user = name_filter[0]
    if user.password != _password:
        ret['error'] = 'wrong password'
        return json_response(ret)

    request.session['name'] = _name
    ret['status'] = 'succeeded'
    return json_response(ret)

def logout(request):
    ret = {}
    session = get_session(request)
    if (session != None):
        del request.session['name']
    ret['status'] = 'succeeded'
    return json_response(ret)

def change_password_after_login(request):
    content = request.POST

    ret = {}
    ret['status'] = 'failed'

    session = get_session(request)
    if (session == None):
        ret['error'] = 'please log in first'
        return json_response(ret)

    if not 'new_password' in content:
        ret['error'] = 'new password can\'t be empty'
        return json_response(ret)

    _new_password = content['new_password']
    if len(_new_password) >= 20:
        ret['error'] = 'this password is too long'
        return json_response(ret)

    change_password_to(session, _new_password)
    ret['status'] = 'succeeded'
    return json_response(ret)