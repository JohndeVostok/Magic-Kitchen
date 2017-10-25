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
    ret['status'] = 'failed'

    session = get_session(request)
    if (session == None):
        ret['error'] = 'please log in first'
        return json_response(ret)

    if not 'level_id' in content:
        ret['error'] = 'level id can\'t be empty'
        return json_response(ret)

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

    if not 'solution_info' in content:
        ret['error'] = 'solution info can\'t be empty'
        return json_response(ret)
    _solution_info = content['solution_info']

    if not 'score' in content:
        ret['error'] = 'score can\'t be empty'
        return json_response(ret)

    try:
        _score = int(content['score'])
    except ValueError,e :
        print e
        ret['error'] = 'the input score needs to be an Integer'
        return json_response(ret)

    if _score > 4 or _score < 0:
        ret['error'] = 'the input score needs to be in range[0,4]'
        return json_response(ret)

    Solution.objects.create(user_name = session, level_id = _level_id, info = _solution_info, score = _score)

    ret['status'] = 'succeeded'
    return json_response(ret)