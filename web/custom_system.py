from models import User
import json
from django.http import HttpResponse 
from send_email import email_thread

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

    session = get_session(request)
    if (session != None):
        ret['status'] = 1010 #'you have already logged in'
        return json_response(ret)

    if not 'name' in content:
        ret['status'] = 1002 #'user name can't be empty'
        return json_response(ret)

    if not 'password' in content:
        ret['status'] = 1003 #'password can't be empty'
        return json_response(ret)

    if not 'email' in content:
        ret['status'] = 1004 #'email can't be empty'
        return json_response(ret)

    _name = content['name']
    _email = content['email']
    _password = content['password']

    if len(_name) >= 20:
        ret['status'] = 1007 #'this name is too long'
        return json_response(ret)

    if len(_password) >= 20:
        ret['status'] = 1008 #'this password is too long'
        return json_response(ret)

    if len(_email) >= 50:
        ret['status'] = 1009 #'this email address is too long'
        return json_response(ret)

    name_filter = User.objects.filter(name = _name)
    if len(name_filter) >= 1:
        ret['status'] = 1005 #'this name already exists'
        return json_response(ret)

    email_filter = User.objects.filter(email = _email)
    if len(email_filter) >= 1:
        ret['status'] = 1006 #'this email address already exists'
        return json_response(ret)

    User.objects.create(name = _name, password = _password, email = _email)
    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def login(request):
    #TODO return user info(such as email, level ...)

    content = request.POST

    ret = {}

    session = get_session(request)
    if (session != None):
        ret['status'] = 1010 #'you have already logged in'
        return json_response(ret)

    if not 'name' in content:
        ret['status'] = 1002 #'user name can't be empty'
        return json_response(ret)

    if not 'password' in content:
        ret['status'] = 1003 #'password can't be empty'
        return json_response(ret)

    _name = content['name']
    _password = content['password']

    name_filter = User.objects.filter(name = _name)

    if len(name_filter) == 0:
        ret['status'] = 1011 #'this name doesn't exist'
        return json_response(ret)

    user = name_filter[0]
    if user.password != _password:
        ret['status'] = 1012 #'wrong password'
        return json_response(ret)

    request.session['name'] = _name
    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def logout(request):
    ret = {}
    session = get_session(request)
    if (session != None):
        del request.session['name']
    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def change_password_after_login(request):
    content = request.POST

    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = 1001 #'please log in first'
        return json_response(ret)

    if not 'new_password' in content:
        ret['status'] = 1013 #'new password can't be empty'
        return json_response(ret)

    _new_password = content['new_password']
    if len(_new_password) >= 20:
        ret['status'] = 1008 #'this password is too long'
        return json_response(ret)

    change_password_to(session, _new_password)
    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def change_password_by_email(request):
    content = request.POST

    ret = {}

    if not 'name' in content:
        ret['status'] = 1002 #'name can't be empty'
        return json_response(ret)

    username = content['name']
    name_filter = User.objects.filter(name = username)

    if len(name_filter) == 0:
        ret['status'] = 1011 #'this name doesn't exist'
        return json_response(ret)

    user = name_filter[0]
    email = user.email
    # generate Identifying Code
    from random import choice
    import string
    def GenIdentifyingCode(length=8, chars=string.ascii_letters + string.digits):
        return ''.join([choice(chars) for i in range(length)])
    identifyingCode = GenIdentifyingCode(8)
    user.identifyingCode = identifyingCode
    user.save()
    ret['identifyingCode'] = identifyingCode

    #email_thread('Email From CodeCheF', 'This is the identifying code needed to change the password:\n' + identifyingCode, email).start()
    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def change_password_by_identifyingCode(request):
    content = request.POST

    ret = {}

    if not 'name' in content:
        ret['status'] = 1002 #'name can't be empty'
        return json_response(ret)
    _name = content['name']

    if not 'identifyingCode' in content:
        ret['status'] = 1014 #'identifying code can't be empty'
        return json_response(ret)
    _identifyCode = content['identifyingCode']

    if not 'new_password' in content:
        ret['status'] = 1013 #'new password can't be empty'
        return json_response(ret)
    _new_password = content['new_password']

    if len(_new_password) >= 20:
        ret['status'] = 1008 #'this password is too long'
        return json_response(ret)

    name_filter = User.objects.filter(name = _name)
    if len(name_filter) == 0:
        ret['status'] = 1011 #'this name doesn't exist'
        return json_response(ret)

    user = name_filter[0]
    if _identifyCode != user.identifyingCode or _identifyCode == "":
        ret['status'] = 1015 #'wrong identifying code'
        return json_response(ret)

    user.password = _new_password
    user.identifyingCode = ""
    user.save()

    ret['status'] = 1000 #'succeeded'
    return json_response(ret)