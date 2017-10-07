from django.conf.urls import url
from django.conf import settings
from django.views import static

from . import views
from . import custom_system

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/register$', custom_system.register, name = 'register'),
    # Force to serve static files, which is not recommended by Django
    url(r'^(?P<path>.*)$', static.serve, {'document_root': settings.STATICFILES_DIRS[0]}),
    
]
