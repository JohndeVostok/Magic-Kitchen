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
    url(r'^api/change_password_by_identifying_code$', custom_system.change_password_by_identifying_code),
    url(r'^api/get_level_info$', level_system.get_level_info),
    url(r'^api/new_default_level$', level_system.new_default_level),
    url(r'^api/new_solution$', solution_system.new_solution),
    url(r'^api/get_solution_info$', solution_system.get_solution_info),
    url(r'^api/new_usermade_level$', level_system.new_usermade_level),
    url(r'^api/get_current_user_info$', custom_system.get_current_user_info),
    url(r'^api/vip_charge$', custom_system.vip_charge),
    url(r'^api/set_admin$', custom_system.set_admin),
    url(r'^api/get_all_level$', level_system.get_all_level),
    url(r'^api/share_level$', level_system.share_level),
    url(r'^api/get_all_private_level$', level_system.get_all_private_level),
    url(r'^api/get_all_shared_level$', level_system.get_all_shared_level),
    url(r'^api/share_solution$', solution_system.share_solution),
    url(r'^api/get_all_shared_solution$', solution_system.get_all_shared_solution),
    url(r'^api/new_std_solution$', solution_system.new_std_solution),
    url(r'^api/change_level_info$', level_system.change_level_info),
    url(r'^api/get_all_default_level$', level_system.get_all_default_level),
    url(r'^api/send_code_to_mobile_phone_user$', custom_system.send_code_to_mobile_phone_user),
    url(r'^api/login_with_phone_number$', custom_system.login_with_phone_number),
    # Sharing
    url(r'^external_share_level$', views.external_share_level),
    # Force to serve static files, which is not recommended by Django
    url(r'^(?P<path>.*)$', views.static_file),
]
