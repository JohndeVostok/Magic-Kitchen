# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views import static
from django.conf import settings

# Create your views here.

def index(request):
    return redirect('codechef.html')

@ensure_csrf_cookie
def static_file(request, path):
	return static.serve(request, path, document_root=settings.STATICFILES_DIRS[0])

def external_share_level(request):
	content = request.GET
	print(content)
	return render(request, "codechef.html", {"defaultLevelId": content["level_id"]});
