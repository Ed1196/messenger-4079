# Generated by Django 3.2.4 on 2021-11-01 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger_backend', '0002_message_read'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='read',
            field=models.BooleanField(default=False),
        ),
    ]
