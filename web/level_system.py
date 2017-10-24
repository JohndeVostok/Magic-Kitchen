from models import Level
import json
from django.http import HttpResponse

def json_response(info):
    return HttpResponse(json.dumps(info), content_type="application/json")

def int_range(x):
    if x >= -2147483648 and x <= 2147483647:
        return True
    else:
        return False

def default_level_id_range(x):
    if x >=0 and x <= 100:
        return True
    else:
        return False

def get_level_info(request):
    content = request.POST
    ret = {}
    ret['status'] = 'failed'

    if not 'level_id' in content:
        ret['error'] = 'level id can\'t be empty'
        return json_response(ret)

    try:
        _id = int(content['level_id'])
    except ValueError,e :
        print e
        ret['error'] = 'the input level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_id):
        ret['error'] = 'the input level id needs to be an Integer'
        return json_response(ret)

    level_id_filter = Level.objects.filter(level_id = _id)
    if len(level_id_filter) == 0:
        ret['error'] = 'this level doesn\'t exist'
        return json_response(ret)

    ret['status'] = 'succeeded'
    ret['level_info'] = level_id_filter[0].info #json

    return json_response(ret)

def new_default_level(request):
    #TODO
    #only admin can create new default level

    content = request.POST
    ret = {}
    ret['status'] = 'failed'

    if not 'level_id' in content:
        ret['error'] = 'level id can\'t be empty'
        return json_response(ret)

    if not 'level_info' in content:
        ret['error'] = 'level info can\'t be empty'
        return json_response(ret)

    try:
        _id = int(content['level_id'])
    except ValueError,e :
        print e
        ret['error'] = 'the input level id needs to be an Integer'
        return json_response(ret)

    #0~100 are default levels, others are user-made levels
    if not default_level_id_range(_id):
        ret['error'] = 'the input level id needs to be in range [0,100]'
        return json_response(ret)

    level_id_filter = Level.objects.filter(level_id = _id)
    if len(level_id_filter) > 0:
        ret['error'] = 'this level id already exists'
        return json_response(ret)

    _info = content['level_info']
    Level.objects.create(level_id = _id, info = _info, user_name = 'admin')

    ret['status'] = 'succeeded'

    return json_response(ret)

def get_level_info(request):
    content = request.POST
    ret = {}
    ret['status'] = 'failed'

    if not 'level_id' in content:
        ret['error'] = 'level id can\'t be empty'
        return json_response(ret)

    try:
        _id = int(content['level_id'])
    except ValueError,e :
        print e
        ret['error'] = 'the input level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_id):
        ret['error'] = 'the input level id needs to be an Integer'
        return json_response(ret)

    level_id_filter = Level.objects.filter(level_id = _id)
    if len(level_id_filter) == 0:
        ret['error'] = 'this level doesn\'t exist'
        return json_response(ret)

    ret['status'] = 'succeeded'
    ret['level_info'] = level_id_filter[0].info #json

    return json_response(ret)

def new_usermade_level(request):
    
    content = request.POST
    ret = {}
    ret['status'] = 'failed'

    session = get_session(request)
    if (session == None):
        ret['error'] = 'please log in first'
        return json_response(ret)


    if not 'level_info' in content:
        ret['error'] = 'level info can\'t be empty'
        return json_response(ret)

    _info = content['level_info']
    Level.objects.create(level_id = -1, info = _info, user_name = session)

    ret['status'] = 'succeeded'

    return json_response(ret)