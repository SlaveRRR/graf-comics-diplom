from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from users.models import AvatarUploadDraft, User, UserFollow


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ('id', 'username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Custom fields', {'fields': ('role', 'avatar', 'updated_at')}),
    )
    readonly_fields = ('updated_at',)


@admin.register(UserFollow)
class UserFollowAdmin(admin.ModelAdmin):
    list_display = ('id', 'follower', 'following', 'created_at')
    search_fields = ('follower__username', 'following__username')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)


@admin.register(AvatarUploadDraft)
class AvatarUploadDraftAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'expires_at', 'created_at')
    search_fields = ('user__username', 'file_key')
    list_filter = ('status', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
