from django.conf.urls import url
from django.conf import settings
from . import custom_system

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/register$', custom_system.register),
    url(r'^api/login$', custom_system.login),
    url(r'^api/logout$', custom_system.logout),
    url(r'^api/change_password_after_login$', custom_system.change_password_after_login),
    url(r'^api/change_password_by_email$', custom_system.change_password_by_email),
    url(r'^api/change_password_by_identifyingCode$', custom_system.change_password_by_identifyingCode),
    # Force to serve static files, which is not recommended by Django
    url(r'^(?P<path>.*)$', views.static_file),
]
