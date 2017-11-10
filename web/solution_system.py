from models import User
from models import Level
from models import Solution
import json
import msg_id_const_value as msgid
from django.http import HttpResponse

def json_response(info):
    return HttpResponse(json.dumps(info), content_type="application/json")

def get_session(request):
    return request.session.get('name', None)

def int_range(x):
    if x >= -2147483648 and x <= 2147483647:
        return True
    else:
        return False

def calc_score(std_block_num, user_block_num):
    if user_block_num <= std_block_num:
        return 3
    if user_block_num <= std_block_num * 2:
        return 2
    return 1

def new_std_solution(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)

    admin = User.objects.filter(name = session)[0]
    if admin.authority < 3:
        ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
        return json_response(ret)

    if not 'default_level_id' in content:
        ret['status'] = msgid.DEFAULT_LEVEL_ID_EMPTY #'default level id can't be empty'
        return json_response(ret)

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
    _level_id = default_level_id_filter[0].level_id

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

    if (not change) and (level.std_solution_id != -1):
        ret['status'] = msgid.ALREADY_HAVE_STD_SOLUTION #'this default level has already had one std solution'
        return json_response(ret)

    if not 'solution_info' in content:
        ret['status'] = msgid.SOLUTION_INFO_EMPTY #'solution info can't be empty'
        return json_response(ret)
    _solution_info = content['solution_info']
    _info = json.loads(_solution_info)
    if not 'block_num' in _info:
        ret['status'] = 1041 #'solution info dict needs to contain key 'block_num''
        return json_response(ret)

    try:
        std_block_num = int(_info['block_num'])
    except ValueError,e :
        print e
        ret['status'] = 1042 #''block_num' in solution_info dict needs to be an Integer'
        return json_response(ret)

    if not int_range(std_block_num):
        ret['status'] = 1042 #''block_num' in solution_info dict needs to be an Integer'
        return json_response(ret)

    solution_dict = json.loads(admin.solution_dict)
    if str(_level_id) in solution_dict:
        _solution_id = solution_dict[str(_level_id)]
        solution = Solution.objects.filter(solution_id = _solution_id)[0]
        solution.info = _solution_info
        solution.score = 3
        solution.save()
        level.std_solution_id = _solution_id
        level.save()
        ret['solution_id'] = _solution_id
    else:
        solution = Solution.objects.create(user_name = session, level_id = _level_id, info = _solution_info, score = 3)    
        solution_dict[str(_level_id)] = solution.solution_id
        admin.solution_dict = json.dumps(solution_dict)
        admin.save()
        level.std_solution_id = solution.solution_id
        level.save()
        ret['solution_id'] = solution.solution_id

    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)

def new_solution(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)

    if not 'level_id' in content:
        ret['status'] = msgid.LEVEL_ID_EMPTY #'level id can\'t be empty'
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

    if not 'solution_info' in content:
        ret['status'] = msgid.SOLUTION_INFO_EMPTY #'solution info can't be empty'
        return json_response(ret)
    _solution_info = content['solution_info']
    _info = json.loads(_solution_info)
    if not 'block_num' in _info:
        ret['status'] = 1041 #'solution info dict needs to contain key 'block_num''
        return json_response(ret)

    try:
        user_block_num = int(_info['block_num'])
    except ValueError,e :
        print e
        ret['status'] = 1042 #''block_num' in solution_info dict needs to be an Integer'
        return json_response(ret)

    if not int_range(user_block_num):
        ret['status'] = 1042 #''block_num' in solution_info dict needs to be an Integer'
        return json_response(ret)

    level = level_id_filter[0]
    if level.default_level_id != -1:
        if level.std_solution_id == -1:
            ret['status'] = 1040 #'calculate score error, this default level doesn't have one std solution'
            return json_response(ret)

        std_solution = Solution.objects.filter(solution_id = level.std_solution_id)[0]
        _info = json.loads(std_solution.info)
        std_block_num = _info['block_num']
        _score = calc_score(std_block_num, user_block_num)
    else:
        _score = 4

    name_filter = User.objects.filter(name = session)
    user = name_filter[0]
    solution_dict = json.loads(user.solution_dict)
    if str(_level_id) in solution_dict:
        _solution_id = solution_dict[str(_level_id)]
        solution = Solution.objects.filter(solution_id = _solution_id)[0]
        solution.info = _solution_info
        solution.score = _score
        solution.save()
        ret['solution_id'] = _solution_id
    else:
        solution = Solution.objects.create(user_name = session, level_id = _level_id, info = _solution_info, score = _score)    
        solution_dict[str(_level_id)] = solution.solution_id
        user.solution_dict = json.dumps(solution_dict)
        user.save()
        ret['solution_id'] = solution.solution_id

    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)


def get_solution_info(request):
    content = request.POST
    ret = {}

    if not 'solution_id' in content:
        ret['status'] = msgid.SOLUTION_ID_EMPTY #'solution id can't be empty'
        return json_response(ret)

    try:
        _solution_id = int(content['solution_id'])
    except ValueError,e :
        print e
        ret['status'] = msgid.SOLUTION_ID_NOT_INT #'the input solution id needs to be an Integer'
        return json_response(ret)

    if not int_range(_solution_id):
        ret['status'] = msgid.SOLUTION_ID_NOT_INT #'the input solution id needs to be an Integer'
        return json_response(ret)

    solution_id_filter = Solution.objects.filter(solution_id = _solution_id)
    if len(solution_id_filter) == 0:
        ret['status'] = msgid.SOLUTION_NOT_EXIST #'this solution doesn't exist'
        return json_response(ret)

    solution = solution_id_filter[0]
    if not solution.shared:
        session = get_session(request)
        if not session:
            ret['status'] = msgid.NOT_LOGIN #'please log in first'
            return json_response(ret)
        user = User.objects.filter(name = session)[0]
        if not ((session == solution.user_name) or (user.authority >= 3)):
            ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
            return json_response(ret)
            
    ret['status'] = msgid.SUCCESS #'succeeded'
    ret['solution_info'] = solution.info
    ret['score'] = solution.score #score range is [1,4], 4 means pass, [1,3] means score
    ret['level_id'] = solution.level_id
    ret['author'] = solution.user_name
    ret['shared'] = solution.shared
    return json_response(ret)

def share_solution(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = msgid.NOT_LOGIN #'please log in first'
        return json_response(ret)

    if not 'solution_id' in content:
        ret['status'] = msgid.SOLUTION_ID_EMPTY #'solution id can't be empty'
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

    try:
        _solution_id = int(content['solution_id'])
    except ValueError,e :
        print e
        ret['status'] = msgid.SOLUTION_ID_NOT_INT #'the input solution id needs to be an Integer'
        return json_response(ret)

    if not int_range(_solution_id):
        ret['status'] = msgid.SOLUTION_ID_NOT_INT #'the input solution id needs to be an Integer'
        return json_response(ret)

    solution_id_filter = Solution.objects.filter(solution_id = _solution_id)
    if len(solution_id_filter) == 0:
        ret['status'] = msgid.SOLUTION_NOT_EXIST #'this solution doesn't exist'
        return json_response(ret)

    user = User.objects.filter(name = session)[0]
    solution = solution_id_filter[0]

    #only the author or admin can share this solution
    if not ((session == solution.user_name) or (user.authority >= 3)):
        ret['status'] = msgid.NO_AUTHORITY #'you don't have operation authority'
        return json_response(ret)
    
    _level_id = solution.level_id
    level = Level.objects.filter(level_id = _level_id)[0]
    if not level.shared:
        ret['status'] = 1043 #'the level need to be shared before sharing the solution'
        return json_response(ret)

    solution.shared = (_shared == 1)
    solution.save()
    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)

def get_all_shared_solution(request):
    content = request.POST
    ret = {}

    shared_solution = Solution.objects.filter(shared = True)
    shared_solution_id = []
    for solution in shared_solution:
        shared_solution_id.append(solution.solution_id)
    ret['all_shared_solution'] = json.dumps(shared_solution_id)
    ret['status'] = msgid.SUCCESS #'succeeded'
    return json_response(ret)