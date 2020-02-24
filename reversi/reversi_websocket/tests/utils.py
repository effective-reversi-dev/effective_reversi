from userconfig.models import User


class AuthMiddlewareMock:
    def __init__(self, user: User, inner):
        # Store the ASGI application we were passed
        self.inner = inner
        self.user = user

    def __call__(self, scope):
        scope['user'] = self.user
        return self.inner(scope)
