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