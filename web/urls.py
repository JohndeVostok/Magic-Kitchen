from django.conf.urls import url
from django.conf import settings
from . import custom_system
from . import level_system
from . import solution_system

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/register$', custom_system.register),
    url(r'^api/login$', custom_system.login),
    url(r'^api/logout$', custom_system.logout),
    url(r'^api/change_password_after_login$', custom_system.change_password_after_login),
    url(r'^api/change_password_by_email$', custom_system.change_password_by_email),
    url(r'^api/change_password_by_identifyingCode$', custom_system.change_password_by_identifyingCode),
    url(r'^api/get_level_info$', level_system.get_level_info),
    url(r'^api/new_default_level$', level_system.new_default_level),
    url(r'^api/new_solution$', solution_system.new_solution),
    url(r'^api/new_usermade_level$', level_system.new_usermade_level),
    url(r'^api/get_current_user_info$', custom_system.get_current_user_info),
    # Force to serve static files, which is not recommended by Django
    url(r'^(?P<path>.*)$', views.static_file),
]
