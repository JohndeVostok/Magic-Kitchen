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

def get_session(request):
    return request.session.get('name', None)

def new_default_level(request):
    #TODO
    #only admin can create new default level

    content = request.POST
    ret = {}
    ret['status'] = 'failed'

    if not 'default_level_id' in content:
        ret['error'] = 'default level id can\'t be empty'
        return json_response(ret)

    if not 'level_info' in content:
        ret['error'] = 'level info can\'t be empty'
        return json_response(ret)

    try:
        _id = int(content['default_level_id'])
    except ValueError,e :
        print e
        ret['error'] = 'the input default level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_id):
            ret['error'] = 'the input default level id needs to be an Integer'
            return json_response(ret)

    default_level_id_filter = Level.objects.filter(default_level_id = _id)
    if len(default_level_id_filter) > 0:
        ret['error'] = 'this default level id already exists'
        return json_response(ret)

    _info = content['level_info']
    Level.objects.create(default_level_id = _id, info = _info, user_name = 'admin')

    ret['status'] = 'succeeded'

    return json_response(ret)

def get_level_info(request):
    #you can use default_level_id to get default level or level_id to get any level(default or user-made)
    content = request.POST
    ret = {}
    ret['status'] = 'failed'

    if not (('level_id' in content) or ('default_level_id' in content)):
        ret['error'] = 'level id and default level id can\'t be empty in the same time'
        return json_response(ret)

    if 'default_level_id' in content:
        #get default level
        try:
            _default_level_id = int(content['default_level_id'])
        except ValueError,e :
            print e
            ret['error'] = 'the input default level id needs to be an Integer'
            return json_response(ret)

        if not int_range(_default_level_id):
            ret['error'] = 'the input default level id needs to be an Integer'
            return json_response(ret)

        default_level_id_filter = Level.objects.filter(default_level_id = _default_level_id)
        if len(default_level_id_filter) == 0:
            ret['error'] = 'this level doesn\'t exist'
            return json_response(ret)

        ret['status'] = 'succeeded'
        ret['level_info'] = default_level_id_filter[0].info #json

    else:
        try:
            _level_id = int(content['level_id'])
        except ValueError,e :
            print e
            ret['error'] = 'the input level id needs to be an Integer'
            return json_response(ret)

        if not int_range(_level_id):
            ret['error'] = 'the input level id needs to be an Integer'
            return json_response(ret)

        level_id_filter = Level.objects.filter(level_id = _level_id)
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
    Level.objects.create(default_level_id = -1, info = _info, user_name = session)

    ret['status'] = 'succeeded'

    return json_response(ret)