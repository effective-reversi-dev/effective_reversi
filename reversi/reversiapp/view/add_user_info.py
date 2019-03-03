from typing import Callable

from django.http import HttpRequest, HttpResponse


def add_user_info(view: Callable[[HttpRequest], HttpResponse]):
    def user_info_setter(request: HttpRequest):
        response = view(request)
        user = request.user
        response.set_cookie('username', user.username, 365 * 24 * 60 * 60)
        response.set_cookie('email', user.email, 365 * 24 * 60 * 60)
        response.set_cookie('display_name', user.display_name, 365 * 24 * 60 * 60)
        return response

    return user_info_setter
