import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from interactions.routing import websocket_urlpatterns
from interactions.ws_auth import JwtQueryStringAuthMiddlewareStack

django_asgi_application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        'http': django_asgi_application,
        'websocket': JwtQueryStringAuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)
