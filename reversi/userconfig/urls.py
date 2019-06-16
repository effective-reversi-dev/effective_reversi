from django.contrib.auth import views as auth_views
from django.urls import path

from userconfig.view.change_user_info import change_user_info
from userconfig.view.signup import signup

urlpatterns = [
    # auth周りのview
    path('signup/', signup, name='signup'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('login/', auth_views.LoginView.as_view(template_name='userconfig/login.html'), name='login'),

    # password reset 用のView
    path(
        'reset/',
        auth_views.PasswordResetView.as_view(
            template_name='userconfig/password_reset.html',
            email_template_name='userconfig/password_reset_email.html',
            subject_template_name='userconfig/password_reset_subject.txt'),
        name='password_reset'),
    path(
        'reset/done/',
        auth_views.PasswordResetDoneView.as_view(
            template_name='userconfig/password_reset_done.html'),
        name='password_reset_done'),
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
            template_name='userconfig/password_reset_confirm.html'),
        name='password_reset_confirm'),
    path(
        'reset/complete/',
        auth_views.PasswordResetCompleteView.as_view(
            template_name='userconfig/password_reset_complete.html'),
        name='password_reset_complete'),

    # password変更用のview
    path(
        'change_password/',
        auth_views.PasswordChangeView.as_view(
            template_name='userconfig/password_change.html'),
        name='password_change'),
    path('change_password/done/',
         auth_views.PasswordChangeDoneView.as_view(
             template_name='userconfig/password_change_done.html'),
         name='password_change_done'),

    # SPAの中からajax的に呼ばれる
    path('change_user/', change_user_info, name='change_user'),
]
