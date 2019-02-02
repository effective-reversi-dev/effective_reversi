import django_js_reverse.views
from django.conf import settings
from django.conf.urls import include  # noqa
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('jsreverse/', django_js_reverse.views.urls_js, name='js_reverse'),
    path('', include('reversiapp.urls')),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [path('__debug__/', include(debug_toolbar.urls)), ] + urlpatterns
