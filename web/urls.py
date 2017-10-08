from django.conf.urls import url
from django.conf import settings
from django.views import static
from . import custom_system

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/register$', custom_system.register),
    url(r'^api/login$', custom_system.login),
    url(r'^api/logout$', custom_system.logout),
    # Force to serve static files, which is not recommended by Django
    url(r'^(?P<path>.*)$', static.serve, {'document_root': settings.STATICFILES_DIRS[0]}),
]
