from django.contrib.auth import views as auth_views
from django.urls import path

from userconfig.view.signup import signup

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('login/', auth_views.LoginView.as_view(template_name='userconfig/login.html'), name='login'),
]
