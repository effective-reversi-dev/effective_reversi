from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from common.add_user_info import add_user_info
from userconfig.models import User


@require_GET
@login_required
def get_user_info(request):
    user: User = request.user
    return JsonResponse({'display_name': user.display_name, 'email': user.email, 'username': user.username})


@require_POST
@login_required
@add_user_info
def change_user_info(request):
    changes = request.POST
    user: User = request.user
    original_display_name = user.display_name
    original_email = user.email
    err = False
    err_msg = ''

    def _revert_changes():
        user.display_name = original_display_name
        user.email = original_email

    def _add_err_msg(msg):
        nonlocal err, err_msg
        err = err or True
        err_msg = f'{err_msg}{msg}'

    if 'displayName' in changes and changes['displayName'] != '':
        display_name = changes['displayName']
        try:
            user.display_name = changes['displayName']
            user.full_clean()
        except ValidationError:
            _add_err_msg(f'表示名が不正です。: {display_name}。')
            user.display_name = original_display_name

    if 'emailAddress' in changes and changes['emailAddress'] != '':
        email = changes['emailAddress']
        try:
            user.email = email
            user.full_clean()
        except ValidationError:
            _add_err_msg(f'メールアドレスが不正です。: {email}。')
            user.email = original_email

    if err:
        _revert_changes()
    else:
        user.save()

    return JsonResponse({'err': err, 'err_msg': err_msg})
