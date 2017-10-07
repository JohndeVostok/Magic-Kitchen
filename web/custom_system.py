from models import User
import json
from django.http import HttpResponse 

#this request need to be POST
def register(request): 
    #TODO email verification

    content = request.POST
    _name = content['name']
    _email = content['email']
    _password = content['password']

    ret = {}
    ret['status'] = 'failed'

    if len(_name) >= 20:
        ret['error'] = 'this name is too long'
        return HttpResponse(json.dumps(ret), content_type="application/json")

    if len(_password) >= 20:
        ret['error'] = 'this password is too long'
        return HttpResponse(json.dumps(ret), content_type="application/json")

    if len(_email) >= 50:
        ret['error'] = 'this email is too long'
        return HttpResponse(json.dumps(ret), content_type="application/json")

    name_filter = User.objects.filter(name = _name)
    if len(name_filter) >= 1:
        ret['error'] = 'this name already exists'
        return HttpResponse(json.dumps(ret), content_type="application/json")

    email_filter = User.objects.filter(email = _email)
    if len(email_filter) >= 1:
        ret['error'] = 'this email already exists'
        return HttpResponse(json.dumps(ret), content_type="application/json")

    User.objects.create(name = _name, password = _password, email = _email)
    ret['status'] = 'succeed'
    return HttpResponse(json.dumps(ret), content_type="application/json")

def login(_name, _password):
    #TODO return user info(such as email, level ...)

    name_filter = User.objects.filter(name = _name)
    if name_filter == 0:
        return 'this name does not exist'
    user = name_filter[0]
    if user.password != _password:
        return 'wrong password'
    return 'success'