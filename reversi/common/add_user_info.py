from typing import Callable
from urllib.parse import quote_plus

from django.http import HttpRequest, HttpResponse


def add_user_info(view: Callable[[HttpRequest], HttpResponse]):
    def user_info_setter(request: HttpRequest):
        response = view(request)
        user = request.user
        response.set_cookie('username', quote_plus(user.username, safe='*'), 365 * 24 * 60 * 60)
        response.set_cookie('email', quote_plus(user.email, safe='*'), 365 * 24 * 60 * 60)
        response.set_cookie('display_name', quote_plus(user.display_name, safe='*'), 365 * 24 * 60 * 60)
        return response

    return user_info_setter
