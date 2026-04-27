from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comics', '0011_alter_comic_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='comic',
            name='moderation_message',
            field=models.TextField(blank=True),
        ),
    ]
