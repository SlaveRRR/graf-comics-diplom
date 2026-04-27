from urllib.parse import parse_qs

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async


@database_sync_to_async
def get_user_from_token(token: str):
    from django.contrib.auth import get_user_model
    from django.contrib.auth.models import AnonymousUser
    from rest_framework_simplejwt.exceptions import TokenError
    from rest_framework_simplejwt.tokens import AccessToken

    User = get_user_model()

    if not token:
        return AnonymousUser()

    try:
        access_token = AccessToken(token)
        user_id = access_token.get('user_id')

        if not user_id:
            return AnonymousUser()

        return User.objects.get(id=user_id)
    except (TokenError, User.DoesNotExist, KeyError):
        return AnonymousUser()


class JwtQueryStringAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_params = parse_qs(scope.get('query_string', b'').decode())
        token = query_params.get('token', [None])[0]
        scope['user'] = await get_user_from_token(token)
        return await self.inner(scope, receive, send)


def JwtQueryStringAuthMiddlewareStack(inner):
    return JwtQueryStringAuthMiddleware(AuthMiddlewareStack(inner))
