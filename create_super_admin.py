from web.models import User
import json
from django.utils import timezone
import hashlib
filter = User.objects.filter(name = 'super_admin')
if len(filter) == 0:
    User.objects.create(name = 'super_admin', password = hashlib.md5('saltedpw'.encode('utf-8')).hexdigest(), email = 'email@xxx.com', solution_dict = json.dumps({}), authority = 4, vip_due_time = timezone.now())
    print 'Super admin built successfully.'
else:
    print 'Super admin already exists.'
