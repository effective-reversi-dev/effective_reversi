import django_js_reverse.views
from django.conf import settings
from django.conf.urls import include, url  # noqa
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

from exampleapp.view.signup import signup

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),
    url(r'^signup/$', signup, name='signup'),
    url(r'^logout/$', auth_views.LogoutView.as_view(), name='logout'),
    url(r'^$', TemplateView.as_view(template_name='exampleapp/itworks.html'), name='home'),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [url(r'^__debug__/', include(debug_toolbar.urls)), ] + urlpatterns
