from models import User
from models import Level
from models import Solution
import json
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

def new_std_solution(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = 1001 #'please log in first'
        return json_response(ret)

    admin = User.objects.filter(name = session)[0]
    if admin.authority < 3:
        ret['status'] = 1031 #'you don't have operation authority'
        return json_response(ret)

    if not 'default_level_id' in content:
        ret['status'] = 1020 #'default level id can't be empty'
        return json_response(ret)

    try:
        _default_level_id = int(content['default_level_id'])
    except ValueError,e :
        print e
        ret['status'] = 1018 #'the input default level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_default_level_id):
        ret['status'] = 1018 #'the input default level id needs to be an Integer'
        return json_response(ret)

    default_level_id_filter = Level.objects.filter(default_level_id = _default_level_id)
    if len(default_level_id_filter) == 0:
        ret['status'] = 1017 #'this level doesn't exist'
        return json_response(ret)

    level = default_level_id_filter[0]
    _level_id = default_level_id_filter[0].level_id

    change = False
    if 'edit' in content:
        try:
            _edit = int(content['edit'])
        except ValueError,e :
            print e
            ret['status'] = 1038 #'the input edit needs to be 0 or 1'
            return json_response(ret)
        if (_edit != 0) and (_edit != 1):
            ret['status'] = 1038 #'the input edit needs to be 0 or 1'
            return json_response(ret)
        change = (_edit == 1)

    if (not change) and (level.std_solution_id != -1):
        ret['status'] = 1039 #'this default level has already had one std solution'
        return json_response(ret)

    if not 'solution_info' in content:
        ret['status'] = 1023 #'solution info can't be empty'
        return json_response(ret)
    _solution_info = content['solution_info']

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

    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def new_solution(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = 1001 #'please log in first'
        return json_response(ret)

    if not 'level_id' in content:
        ret['status'] = 1027 #'level id can\'t be empty'
        return json_response(ret)

    try:
        _level_id = int(content['level_id'])
    except ValueError,e :
        print e
        ret['status'] = 1019 #'the input level id needs to be an Integer'
        return json_response(ret)

    if not int_range(_level_id):
        ret['status'] = 1019 #'the input level id needs to be an Integer'
        return json_response(ret)

    level_id_filter = Level.objects.filter(level_id = _level_id)
    if len(level_id_filter) == 0:
        ret['status'] = 1017 #'this level doesn't exist'
        return json_response(ret)

    if not 'solution_info' in content:
        ret['status'] = 1023 #'solution info can't be empty'
        return json_response(ret)
    _solution_info = content['solution_info']

    if not 'score' in content:
        ret['status'] = 1024 #'score can't be empty'
        return json_response(ret)

    try:
        _score = int(content['score'])
    except ValueError,e :
        print e
        ret['status'] = 1025 #'the input score needs to be an Integer'
        return json_response(ret)

    if _score > 4 or _score < 0:
        ret['status'] = 1026 #'the input score needs to be in range[0,4]'
        return json_response(ret)

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

    ret['status'] = 1000 #'succeeded'
    return json_response(ret)


def get_solution_info(request):
    content = request.POST
    ret = {}

    if not 'solution_id' in content:
        ret['status'] = 1035 #'solution id can't be empty'
        return json_response(ret)

    try:
        _solution_id = int(content['solution_id'])
    except ValueError,e :
        print e
        ret['status'] = 1036 #'the input solution id needs to be an Integer'
        return json_response(ret)

    if not int_range(_solution_id):
        ret['status'] = 1036 #'the input solution id needs to be an Integer'
        return json_response(ret)

    solution_id_filter = Solution.objects.filter(solution_id = _solution_id)
    if len(solution_id_filter) == 0:
        ret['status'] = 1037 #'this solution doesn't exist'
        return json_response(ret)

    solution = solution_id_filter[0]
    ret['status'] = 1000 #'succeeded'
    ret['solution_info'] = solution.info
    ret['score'] = solution.score #score range is [0,4], 0 means not pass, 4 means not need to score
    ret['level_id'] = solution.level_id
    ret['author'] = solution.user_name
    ret['shared'] = solution.shared
    return json_response(ret)

def share_solution(request):
    content = request.POST
    ret = {}

    session = get_session(request)
    if (session == None):
        ret['status'] = 1001 #'please log in first'
        return json_response(ret)

    if not 'solution_id' in content:
        ret['status'] = 1035 #'solution id can't be empty'
        return json_response(ret)

    if not 'share' in content:
        ret['status'] = 1033 #'share can't be empty'
        return json_response(ret)
    try:
        _shared = int(content['share'])
    except ValueError,e :
        print e
        ret['status'] = 1034 #'the input share needs to be 0 or 1'
        return json_response(ret)
    if (_shared != 0) and (_shared != 1):
        ret['status'] = 1034 #'the input share needs to be 0 or 1'
        return json_response(ret)

    try:
        _solution_id = int(content['solution_id'])
    except ValueError,e :
        print e
        ret['status'] = 1036 #'the input solution id needs to be an Integer'
        return json_response(ret)

    if not int_range(_solution_id):
        ret['status'] = 1036 #'the input solution id needs to be an Integer'
        return json_response(ret)

    solution_id_filter = Solution.objects.filter(solution_id = _solution_id)
    if len(solution_id_filter) == 0:
        ret['status'] = 1037 #'this solution doesn't exist'
        return json_response(ret)

    user = User.objects.filter(name = session)[0]
    solution = solution_id_filter[0]

    #only the author or admin can share this solution
    if not ((session == solution.user_name) or (user.authority >= 3)):
        ret['status'] = 1031 #'you don't have operation authority'
        return json_response(ret)
    solution.shared = (_shared == 1)
    solution.save()
    ret['status'] = 1000 #'succeeded'
    return json_response(ret)

def get_all_shared_solution(request):
    content = request.POST
    ret = {}

    shared_solution = Solution.objects.filter(shared = True)
    shared_solution_id = []
    for solution in shared_solution:
        shared_solution_id.append(solution.solution_id)
    ret['all_shared_solution'] = json.dumps(shared_solution_id)
    ret['status'] = 1000 #'succeeded'
    return json_response(ret)