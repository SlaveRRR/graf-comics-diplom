from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_post_age_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='moderation_message',
            field=models.TextField(blank=True),
        ),
    ]
