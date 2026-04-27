from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interactions', '0002_notification_postreadinghistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='link',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]
