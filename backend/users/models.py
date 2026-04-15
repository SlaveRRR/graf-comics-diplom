from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


def default_avatar_upload_expiration():
    return timezone.now() + timedelta(minutes=30)


class User(AbstractUser):
    class Role(models.TextChoices):
        READER = 'reader', 'Читатель'
        AUTHOR = 'author', 'Автор'
        ADMIN = 'admin', 'Администратор'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.READER)
    avatar = models.CharField(max_length=512, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email']

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = self.Role.ADMIN
        self.is_staff = self.role == self.Role.ADMIN or self.is_superuser
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class UserFollow(models.Model):
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='following_relationships',
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='follower_relationships',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)
        constraints = [
            models.UniqueConstraint(
                fields=('follower', 'following'),
                name='unique_user_follow_relationship',
            ),
            models.CheckConstraint(
                check=~models.Q(follower=models.F('following')),
                name='prevent_self_follow',
            ),
        ]

    def __str__(self):
        return f'{self.follower.username} follows {self.following.username}'


class AvatarUploadDraft(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        EXPIRED = 'expired', 'Expired'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='avatar_upload_drafts',
    )
    file_key = models.CharField(max_length=512, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    expires_at = models.DateTimeField(default=default_avatar_upload_expiration)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'Avatar draft #{self.id} for {self.user.username}'
