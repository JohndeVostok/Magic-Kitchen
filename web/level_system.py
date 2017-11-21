from models import Level
from models import User
from models import Solution
import json
import msg_id_const_value as msgid
from django.http import HttpResponse
from custom_system import refresh_vip_authority

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
    content = request.POST
    ret = {}

    session = get_session(request)
    if not session:
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)
    user = User.objects.filter(name = session)[0]
    if user.authority < 3:
        ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
        return json_response(ret)

    if not 'default_level_id' in content:
        ret['status'] = msgid.DEFAULT_LEVEL_ID_EMPTY #'default level id can't be empty'
        return json_response(ret)

    if not 'level_info' in content:
        ret['status'] = msgid.LEVEL_INFO_EMPTY #'level info can't be empty'
        return json_response(ret)

    try:
        _id = int(content['default_level_id'])
    except ValueError,e :
        print e
        ret['status'] = msgid.DEFAULT_LEVEL_ID_NOT_INT #'the input default level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_id):
            ret['status'] = msgid.DEFAULT_LEVEL_ID_NOT_INT #'the input default level id needs to be an Integer'
            return json_response(ret)

    change = False
    if 'edit' in content:
        try:
            _edit = int(content['edit'])
        except ValueError,e :
            print e
            ret['status'] = msgid.EDIT_OUT_OF_RANGE #'the input edit needs to be 0 or 1'
            return json_response(ret)
        if (_edit != 0) and (_edit != 1):
            ret['status'] = msgid.EDIT_OUT_OF_RANGE #'the input edit needs to be 0 or 1'
            return json_response(ret)
        change = (_edit == 1)

    default_level_id_filter = Level.objects.filter(default_level_id = _id)
    if len(default_level_id_filter) > 0:
        if change:
            default_level_id_filter[0].info = content['level_info']
            default_level_id_filter[0].save()
            ret['status'] = msgid.SUCCESS #'succeeded'
            ret['level_id'] = default_level_id_filter[0].level_id
            return json_response(ret)
        ret['status'] = msgid.DEFAULT_LEVEL_ID_EXIST #'this default level id already exists'
        return json_response(ret)

    if change:
        ret['status'] = msgid.LEVEL_NOT_EXIST #'this level doesn't exist'
        return json_response(ret)

    _info = content['level_info']
    level = Level.objects.create(default_level_id = _id, info = _info, user_name = session)

    ret['status'] = msgid.SUCCESS #'succeeded'
    ret['level_id'] = level.level_id

    return json_response(ret)

def get_level_info(request):
    #you can use default_level_id to get default level or level_id to get any level(default or user-made)
    content = request.POST
    ret = {}

    if not (('level_id' in content) or ('default_level_id' in content)):
        ret['status'] = msgid.LEVEL_ID_AND_DEFAULT_LEVEL_ID_EMPTY #'level id and default level id can't be empty in the same time'
        return json_response(ret)

    if 'default_level_id' in content:
        #get default level
        try:
            _default_level_id = int(content['default_level_id'])
        except ValueError,e :
            print e
            ret['status'] = msgid.DEFAULT_LEVEL_ID_NOT_INT #'the input default level id needs to be an Integer'
            return json_response(ret)

        if not int_range(_default_level_id):
            ret['status'] = msgid.DEFAULT_LEVEL_ID_NOT_INT #'the input default level id needs to be an Integer'
            return json_response(ret)

        default_level_id_filter = Level.objects.filter(default_level_id = _default_level_id)
        if len(default_level_id_filter) == 0:
            ret['status'] = msgid.LEVEL_NOT_EXIST #'this level doesn't exist'
            return json_response(ret)
        level = default_level_id_filter[0]

        #only vip can play the level which default_level_id > 5
        if (_default_level_id > 5) or (not level.shared):
            session = get_session(request)
            if not session:
                ret['status'] = msgid.NOT_LOGIN #'please log in first'
                return json_response(ret)
            user = User.objects.filter(name = session)[0]
            if not level.shared:
                if not ((session == level.user_name) or (user.authority >= 3)):
                    ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
                    return json_response(ret)    
            if _default_level_id > 5:
                refresh_vip_authority(user)
                user = User.objects.filter(name = session)[0]
                if user.authority < 2:
                    ret['status'] = msgid.NOT_VIP #'if you want to play the VIP level, please recharge VIP first'
                    return json_response(ret)

        if level.std_solution_id == -1:
            ret['block_num'] = -1
        else:
            std_solution = Solution.objects.filter(solution_id = level.std_solution_id)[0]
            _info = json.loads(std_solution.info)
            std_block_num = _info['block_num']
            ret['block_num'] = std_block_num

        ret['status'] = msgid.SUCCESS #'succeeded'
        ret['level_info'] = default_level_id_filter[0].info #json
        ret['level_id'] = default_level_id_filter[0].level_id
        ret['shared'] = default_level_id_filter[0].shared #bool

    else:
        try:
            _level_id = int(content['level_id'])
        except ValueError,e :
            print e
            ret['status'] = msgid.LEVEL_ID_NOT_INT #'the input level id needs to be an Integer'
            return json_response(ret)

        if not int_range(_level_id):
            ret['status'] = msgid.LEVEL_ID_NOT_INT #'the input level id needs to be an Integer'
            return json_response(ret)

        level_id_filter = Level.objects.filter(level_id = _level_id)
        if len(level_id_filter) == 0:
            ret['status'] = msgid.LEVEL_NOT_EXIST #'this level doesn't exist'
            return json_response(ret)
        level = level_id_filter[0]

        #only vip can play the level which default_level_id > 5
        _default_level_id = level_id_filter[0].default_level_id
        if (_default_level_id > 5) or (not level.shared):
            session = get_session(request)
            if not session:
                ret['status'] = msgid.NOT_LOGIN #'please log in first'
                return json_response(ret)
            user = User.objects.filter(name = session)[0]
            if not level.shared:
                if not ((session == level.user_name) or (user.authority >= 3)):
                    ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
                    return json_response(ret)
            if (_default_level_id > 5):
                refresh_vip_authority(user)
                user = User.objects.filter(name = session)[0]
                if user.authority < 2:
                    ret['status'] = msgid.NOT_VIP #'if you want to play the VIP level, please recharge VIP first'
                    return json_response(ret)

        if level.default_level_id == -1:
            ret['block_num'] = -2
        else:
            if level.std_solution_id == -1:
                ret['block_num'] = -1
            else:
                std_solution = Solution.objects.filter(solution_id = level.std_solution_id)[0]
                _info = json.loads(std_solution.info)
                std_block_num = _info['block_num']
                ret['block_num'] = std_block_num


        ret['status'] = msgid.SUCCESS #'succeeded'
        ret['level_info'] = level_id_filter[0].info #json
        ret['level_id'] = level_id_filter[0].level_id
        ret['shared'] = level_id_filter[0].shared #bool

    return json_response(ret)

def new_usermade_level(request):
    
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)


    if not 'level_info' in content:
        ret['status'] = msgid.LEVEL_INFO_EMPTY #'level info can't be empty'
        return json_response(ret)

    MAX_USER_CREATED_LEVEL_NUM = 10
    MAX_VIP_CREATED_LEVEL_NUM = 30
    user = User.objects.filter(name = session)[0]
    if (user.authority < 3):
        refresh_vip_authority(user)
        user = User.objects.filter(name = session)[0]
        level_filter = Level.objects.filter(user_name = session)
        if (len(level_filter) >= MAX_USER_CREATED_LEVEL_NUM) and (user.authority == 1):
            ret['status'] = msgid.CANT_CREATE_MORE_LEVEL #'you can't create more level'
            return json_response(ret)
        if (len(level_filter) >= MAX_VIP_CREATED_LEVEL_NUM) and (user.authority == 2):
            ret['status'] = msgid.CANT_CREATE_MORE_LEVEL #'you can't create more level'
            return json_response(ret)

    _info = content['level_info']
    level = Level.objects.create(default_level_id = -1, info = _info, user_name = session)

    ret['status'] = msgid.SUCCESS #'succeeded'
    ret['level_id'] = level.level_id

    return json_response(ret)

def share_level(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)

    if not 'level_id' in content:
        ret['status'] = msgid.LEVEL_ID_EMPTY #'level id can't be empty'
        return json_response(ret)

    if not 'share' in content:
        ret['status'] = msgid.SHARE_EMPTY #'share can't be empty'
        return json_response(ret)
    try:
        _shared = int(content['share'])
    except ValueError,e :
        print e
        ret['status'] = msgid.SHARE_OUT_OF_RANGE #'the input share needs to be 0 or 1'
        return json_response(ret)
    if (_shared != 0) and (_shared != 1):
        ret['status'] = msgid.SHARE_OUT_OF_RANGE #'the input share needs to be 0 or 1'
        return json_response(ret)
    if _shared == 0:
        ret['status'] = msgid.CANT_CANCEL_SHARE_LEVEL #'you can't cancel share the level'
        return json_response(ret)

    try:
        _level_id = int(content['level_id'])
    except ValueError,e :
        print e
        ret['status'] = msgid.LEVEL_ID_NOT_INT #'the input level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_level_id):
        ret['status'] = msgid.LEVEL_ID_NOT_INT #'the input level id needs to be an Integer'
        return json_response(ret)

    level_id_filter = Level.objects.filter(level_id = _level_id)
    if len(level_id_filter) == 0:
        ret['status'] = msgid.LEVEL_NOT_EXIST #'this level doesn't exist'
        return json_response(ret)

    user = User.objects.filter(name = session)[0]
    level = level_id_filter[0]

    #only the author or admin can share this level
    if not ((session == level.user_name) or (user.authority >= 3)):
        ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
        return json_response(ret)
    level.shared = (_shared == 1)
    level.save()
    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)

def get_all_level(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)

    user = User.objects.filter(name = session)[0]
    #only admin or super admin can get all level, normal user or vip can only get shared level
    if user.authority < 3:
        ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
        return json_response(ret)

    all_level = Level.objects.all()
    all_level_id = []
    for level in all_level:
        all_level_id.append(level.level_id)
    ret['all_level'] = json.dumps(all_level_id)
    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)

def get_all_private_level(request):
    content = request.POST
    ret = {}

    session = get_session(request)

    if (session == None):
        ret['all_private_level'] = json.dumps([])
        ret['status'] = msgid.SUCCESS #'succeeded'
        return json_response(ret)

    private_level = Level.objects.filter(user_name = session)
    private_level_id = []
    for level in private_level:
        if not level.shared:
            private_level_id.append(level.level_id)
    ret['all_private_level'] = json.dumps(private_level_id)
    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)

def get_all_shared_level(request):
    content = request.POST
    ret = {}

    shared_level = Level.objects.filter(shared = True)
    shared_level_id = []
    for level in shared_level:
        if level.default_level_id == -1:
            shared_level_id.append(level.level_id)
    ret['all_shared_level'] = json.dumps(shared_level_id)
    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)

def get_all_default_level(request):
    content = request.POST
    ret = {}
    ret['status'] = msgid.SUCCESS #'succeeded'
    all_default_level = Level.objects.exclude(default_level_id = -1).order_by('default_level_id')

    session = get_session(request)
    if (session == None):
        l = []
        for level in all_default_level:
            if (level.default_level_id > 5):
                l.append({'default_level_id': level.default_level_id, 'status': 1}) #vip level, can't access
            else:
                l.append({'default_level_id': level.default_level_id, 'status': 0}) #can access but not pass
        ret['level'] = json.dumps(l)
        return json_response(ret)

    user = User.objects.filter(name = session)[0]
    refresh_vip_authority(user)
    user = User.objects.filter(name = session)[0]
    solution_dict = json.loads(user.solution_dict)
    if user.authority >= 2:
        l = []
        for level in all_default_level:
            if str(level.level_id) in solution_dict:
                l.append({'default_level_id': level.default_level_id, 'status': 2}) #passed
            else:
                l.append({'default_level_id': level.default_level_id, 'status': 0}) #can access but not pass
        ret['level'] = json.dumps(l)
        return json_response(ret)
    else:
        l = []
        for level in all_default_level:
            if str(level.level_id) in solution_dict:
                l.append({'default_level_id': level.default_level_id, 'status': 2}) #passed
            else:
                if (level.default_level_id > 5):
                    l.append({'default_level_id': level.default_level_id, 'status': 1}) #vip level, can't access
                else:
                    l.append({'default_level_id': level.default_level_id, 'status': 0}) #can access but not pass
        ret['level'] = json.dumps(l)
        return json_response(ret)

def change_level_info(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)

    if not 'level_id' in content:
        ret['status'] = msgid.LEVEL_ID_EMPTY #'level id can't be empty'
        return json_response(ret)

    try:
        _level_id = int(content['level_id'])
    except ValueError,e :
        print e
        ret['status'] = msgid.LEVEL_ID_NOT_INT #'the input level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_level_id):
        ret['status'] = msgid.LEVEL_ID_NOT_INT #'the input level id needs to be an Integer'
        return json_response(ret)

    level_id_filter = Level.objects.filter(level_id = _level_id)
    if len(level_id_filter) == 0:
        ret['status'] = msgid.LEVEL_NOT_EXIST #'this level doesn't exist'
        return json_response(ret)

    user = User.objects.filter(name = session)[0]
    level = level_id_filter[0]

    #only the author or admin can share this level
    if not ((session == level.user_name) or (user.authority >= 3)):
        ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
        return json_response(ret)

    if level.shared:
        ret['status'] = msgid.CANT_EDIT_SHARE_LEVEL #'you can't edit shared level'
        return json_response(ret)

    if not 'level_info' in content:
        ret['status'] = msgid.LEVEL_INFO_EMPTY #'level info can't be empty'
        return json_response(ret)
    _level_info = content['level_info']

    level.info = _level_info
    level.save()

    solutions = Solution.objects.filter(level_id = _level_id)
    for solution in solutions:
        solution.score = 0 #pass or not pass is unknown
        solution.save()

    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)
