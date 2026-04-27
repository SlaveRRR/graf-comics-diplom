from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import QuerySet

from interactions.models import Notification
from interactions.serializers import build_notification_payload


def broadcast_notification(notification: Notification):
    if not getattr(notification, 'pk', None):
        return

    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    unread_count = Notification.objects.filter(user=notification.user, read_at__isnull=True).count()

    async_to_sync(channel_layer.group_send)(
        f'notifications_user_{notification.user_id}',
        {
            'type': 'notification.message',
            'event': 'notification.created',
            'notification': build_notification_payload(notification),
            'unreadCount': unread_count,
        },
    )


def broadcast_comic_comment(*, comic_id: int, comment_payload: dict, comments_count: int):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    async_to_sync(channel_layer.group_send)(
        f'comic_comments_{comic_id}',
        {
            'type': 'comic.comment.message',
            'event': 'comic.comment.created',
            'comicId': comic_id,
            'comment': comment_payload,
            'commentsCount': comments_count,
        },
    )


def create_notification(*, user, message: str, notification_type: str = Notification.Type.INFO, link: str = ''):
    if not getattr(user, 'pk', None):
        return None

    notification = Notification.objects.create(
        user=user,
        message=message[:255],
        link=link[:500],
        type=notification_type,
    )
    broadcast_notification(notification)
    return notification


def mark_notifications_as_read(*, notifications: QuerySet, timestamp):
    return notifications.filter(read_at__isnull=True).update(read_at=timestamp)


def delete_notifications(*, notifications: QuerySet):
    deleted_count, _ = notifications.delete()
    return deleted_count
