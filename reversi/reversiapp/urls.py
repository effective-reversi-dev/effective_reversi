from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.urls import path
from django.views.generic import TemplateView

from reversiapp.view.signup import signup

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('login/', auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('', login_required(TemplateView.as_view(template_name='reversiapp/index.html')), name='home')
]
