from models import Level
from django.http import HttpResponse

def json_response(info):
    return HttpResponse(json.dumps(info), content_type="application/json")

def get_level_info(request):
    content = request.POST
    ret = {}
    ret['status'] = 'failed'

    if not 'level_id' in content:
        ret['error'] = 'level id can\'t be empty'
        return json_response(ret)

    level_id_filter = Level.objects.filter(level_id = int(content['id']))
    if len(level_id_filter) == 0:
        ret['error'] = 'this level doesn\'t exist'
        return json_response(ret)

    ret['status'] = 'succeeded'
    ret['level_info'] = level_id_filter[0].level_info #json

    return json_response(ret)