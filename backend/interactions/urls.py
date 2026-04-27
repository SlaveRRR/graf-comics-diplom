from django.urls import path

from interactions.views import NotificationDeleteView, NotificationListView, NotificationMarkReadView, ReadingHistoryView


urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/read/', NotificationMarkReadView.as_view(), name='notifications-read'),
    path('notifications/delete/', NotificationDeleteView.as_view(), name='notifications-delete'),
    path('history/', ReadingHistoryView.as_view(), name='reading-history'),
]
