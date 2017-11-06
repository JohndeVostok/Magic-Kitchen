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
    else:
        solution = Solution.objects.create(user_name = session, level_id = _level_id, info = _solution_info, score = _score)    
        solution_dict[str(_level_id)] = solution.solution_id
        user.solution_dict = json.dumps(solution_dict)
        user.save()

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
    return json_response(ret)