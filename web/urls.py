from django.conf.urls import url
from django.conf import settings
from django.views import static

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    # Force to serve static files, which is not recommended by Django
    url(r'^(?P<path>.*)$', static.serve, {'document_root': settings.STATICFILES_DIRS[0]}),
]
