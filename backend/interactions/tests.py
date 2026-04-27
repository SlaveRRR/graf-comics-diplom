from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework.test import APITestCase

from comics.models import Comic
from interactions.models import Comment, Notification

User = get_user_model()


class CommentModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='interaction-user',
            email='interaction-user@example.com',
            password='strongpass123',
        )
        self.comic = Comic.objects.create(title='Тестовый комикс', author=self.user)
        self.content_type = ContentType.objects.get_for_model(Comic)

    def test_comment_can_target_comic_via_generic_relation(self):
        comment = Comment.objects.create(
            user=self.user,
            content_type=self.content_type,
            object_id=self.comic.id,
            text='Работает как универсальный комментарий.',
        )

        self.assertEqual(comment.content_object, self.comic)

    def test_reply_must_belong_to_same_target(self):
        parent = Comment.objects.create(
            user=self.user,
            content_type=self.content_type,
            object_id=self.comic.id,
            text='Родительский комментарий.',
        )
        other_comic = Comic.objects.create(title='Другой комикс', author=self.user)
        invalid_reply = Comment(
            user=self.user,
            content_type=self.content_type,
            object_id=other_comic.id,
            text='Невалидный ответ.',
            reply_to=parent,
        )

        with self.assertRaises(ValidationError):
            invalid_reply.clean()


class NotificationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='notification-user',
            email='notification-user@example.com',
            password='strongpass123',
        )
        self.client.force_authenticate(user=self.user)

    def test_mark_read_updates_only_unread_notifications(self):
        unread_notification = Notification.objects.create(user=self.user, message='Новое уведомление')
        read_notification = Notification.objects.create(
            user=self.user,
            message='Уже прочитано',
            read_at=unread_notification.created_at,
        )

        response = self.client.post(
            '/api/v1/notifications/read/',
            {'ids': [unread_notification.id, read_notification.id]},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['updatedCount'], 1)

    def test_delete_removes_selected_notifications(self):
        unread_notification = Notification.objects.create(user=self.user, message='Удалить меня')
        read_notification = Notification.objects.create(user=self.user, message='И меня тоже')

        response = self.client.post(
            '/api/v1/notifications/delete/',
            {'ids': [unread_notification.id, read_notification.id]},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['deletedCount'], 2)
        self.assertEqual(Notification.objects.filter(user=self.user).count(), 0)
