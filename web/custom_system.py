from models import User
from models import Level
import json
from django.http import HttpResponse 
from send_email import email_thread
import datetime
from django.utils import timezone

def json_response(info):
    return HttpResponse(json.dumps(info), content_type="application/json")

def get_session(request):
    return request.session.get('name', None)

def change_password_to(_name, _password):
    name_filter = User.objects.filter(name = _name)
    user = name_filter[0]
    user.password = _password
    user.save()

def refresh_vip_authority(user):
    if (user.authority == 2) and (user.vip_due_time < timezone.now()):
        user.authority = 1
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

    User.objects.create(name = _name, password = _password, email = _email, solution_dict = json.dumps({}), authority = 1, vip_due_time = timezone.now())
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

    email_thread('Email From CodeCheF', 'This is the identifying code needed to change the password:\n' + identifyingCode, email).start()
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

def get_current_user_info(request):
    content = request.POST

    ret = {}

    session = get_session(request)
    if not session:
        ret['status'] = 1001 #'please log in first'
        return json_response(ret)

    name_filter = User.objects.filter(name = session)
    user = name_filter[0]
    ret['user_name'] = session
    ret['email'] = user.email
    ret['solution_dict'] = user.solution_dict
    ret['status'] = 1000 #'succeeded'
    level_filter = Level.objects.filter(user_name = session)
    created_level = []
    for level in level_filter:
        created_level.append(level.level_id)
    ret['created_level'] = json.dumps(created_level)
    return json_response(ret)

def vip_charge(request):
    content = request.POST

    ret = {}
    session = get_session(request)
    if not session:
        ret['status'] = 1001 #'please log in first'
        return json_response(ret)

    if not 'days' in content:
        ret['status'] = 1028 #'days can't be empty'
        return json_response(ret)

    try:
        _days = int(content['days'])
    except ValueError,e :
        print e
        ret['status'] = 1029 #'the input days needs to be an Integer'
        return json_response(ret)

    if not _days in range(1, 100000):
            ret['status'] = 1030 #'the input days needs to be in range[1, 99999]'
            return json_response(ret)

    user = User.objects.filter(name = session)[0]
    if user.authority < 2:
        user.authority = 2
    due_time = user.vip_due_time
    if due_time < timezone.now():
        due_time = timezone.now()
    timedelta = datetime.timedelta(days = _days)
    user.vip_due_time = due_time + timedelta
    user.save()

    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def set_admin(request):
    content = request.POST

    ret = {}
    session = get_session(request)
    if not session:
        ret['status'] = 1001 #'please log in first'
        return json_response(ret)
    super_admin = User.objects.filter(name = session)[0]
    if super_admin.authority != 4:
        ret['status'] = 1031 #'you don't have operation authority'
        return json_response(ret)

    if not 'name' in content:
        ret['status'] = 1002 #'user name can't be empty'
        return json_response(ret)

    _name = content['name']

    name_filter = User.objects.filter(name = _name)

    if len(name_filter) == 0:
        ret['status'] = 1011 #'this name doesn't exist'
        return json_response(ret)

    user = name_filter[0]
    user.authority = 3 #set admin
    user.save()

    ret['status'] = 1000 #'succeeded'
    return json_response(ret)