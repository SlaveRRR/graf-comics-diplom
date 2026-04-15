from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.test import TestCase

from comics.models import Comic
from interactions.models import Comment

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
