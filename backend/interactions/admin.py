from django.contrib import admin

from interactions.models import Comment, ComicFavorite, ComicLike


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'content_type', 'object_id', 'created_at')
    search_fields = ('text', 'user__username')
    list_filter = ('content_type', 'created_at')


@admin.register(ComicFavorite)
class ComicFavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'comic', 'created_at')
    search_fields = ('user__username', 'comic__title')


@admin.register(ComicLike)
class ComicLikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'comic', 'created_at')
    search_fields = ('user__username', 'comic__title')
