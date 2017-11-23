from web.models import User
from web.models import Level
from web.models import Solution
from django.utils import timezone
import hashlib
import os
import json

def get_num_in_file_name(name):
    i = 0
    for i in range(len(name)):
        if (name[i] >= '0') and (name[i] <= '9'):
            break
    j = i + 1
    for j in range(i + 1, len(name)):
        if (name[j] < '0') or (name[j] > '9'):
            break
    return int(name[i:j])


level_list = os.listdir('./leveldb/level')
for l in level_list:
    num = get_num_in_file_name(l)
    if num == 0:
        continue
    file = open('./leveldb/level/' + l, 'r')
    json_str = file.read()
    _default_level_id = num
    _level_info_str = json_str
    try:
        _level_info_json = json.loads(_level_info_str)
    except ValueError,e:
        print "can't analysis default level " + str(_default_level_id)
        continue
    _level_info = json.dumps(_level_info_json)
    default_level_id_filter = Level.objects.filter(default_level_id = _default_level_id)
    if len(default_level_id_filter) > 0:
        default_level_id_filter[0].info = _level_info
        default_level_id_filter[0].save()
        print "default level " + str(_default_level_id) + " changed successfully"
        continue

    level = Level.objects.create(default_level_id = _default_level_id, info = _level_info, user_name = "super_admin")
    print "default level " + str(_default_level_id) + " built  successfully"

solution_list = os.listdir('./leveldb/solution')
for l in solution_list:
    num = get_num_in_file_name(l)
    if num == 0:
        continue
    file = open('./leveldb/solution/' + l, 'r')
    json_str = file.read()
    _default_level_id = num
    _solution_info_str = json_str

    default_level_id_filter = Level.objects.filter(default_level_id = _default_level_id)
    if len(default_level_id_filter) == 0:
        print "default level " + str(_default_level_id) + " doesn't exist"
        continue
    level = default_level_id_filter[0]
    _level_id = default_level_id_filter[0].level_id

    _solution_info_json = json.loads(_solution_info_str)
    try:
        _solution_info_json = json.loads(_solution_info_str)
    except ValueError,e:
        print "can't analysis default level " + str(_default_level_id) + "'s solution"
        continue
    _solution_info = json.dumps(_solution_info_json)

    if not 'block_num' in _solution_info_json:
        print "default level " + str(_default_level_id) + "'s solution doesn't contain key 'block_num'"
        continue

    try:
        std_block_num = int(_solution_info_json['block_num'])
    except ValueError,e :
        print "'block_num' in default level " + str(_default_level_id) + "'s solution isn't an Integer"
        continue

    admin_filter = User.objects.filter(name = "super_admin")
    if len(admin_filter) == 0:
        print "super admin doesn't exist"
        continue

    admin = admin_filter[0]
    solution_dict = json.loads(admin.solution_dict)
    if str(_level_id) in solution_dict:
        _solution_id = solution_dict[str(_level_id)]
        solution = Solution.objects.filter(solution_id = _solution_id)[0]
        solution.info = _solution_info
        solution.score = 3
        solution.save()
        level.std_solution_id = _solution_id
        level.save()
        print "default level " + str(_default_level_id) + "'s solution changed successfully"
    else:
        solution = Solution.objects.create(user_name = "super_admin", level_id = _level_id, info = _solution_info, score = 3)    
        solution_dict[str(_level_id)] = solution.solution_id
        admin.solution_dict = json.dumps(solution_dict)
        admin.save()
        level.std_solution_id = solution.solution_id
        level.save()
        print "default level " + str(_default_level_id) + "'s solution built  successfully"
    level = Level.objects.filter(default_level_id = _default_level_id)[0]
    if level.shared == False:
        level.shared = True
        level.save()