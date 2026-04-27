from django.urls import path

from interactions.consumers import ComicCommentConsumer, NotificationConsumer


websocket_urlpatterns = [
    path('ws/notifications/', NotificationConsumer.as_asgi()),
    path('ws/comics/<int:comic_id>/comments/', ComicCommentConsumer.as_asgi()),
]
