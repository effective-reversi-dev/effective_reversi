from userconfig.models import User


class AuthMiddlewareMock:
    def __init__(self, username, display_name, inner):
        # Store the ASGI application we were passed
        self.inner = inner
        self.username = username
        self.display_name = display_name

    def __call__(self, scope):
        user = User()
        user.username = self.username
        user.display_name = self.display_name
        scope['user'] = user
        return self.inner(scope)
