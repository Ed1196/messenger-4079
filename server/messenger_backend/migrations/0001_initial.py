# Generated by Django 3.2.4 on 2021-11-09 16:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('createdAt', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.TextField(unique=True)),
                ('email', models.TextField(unique=True)),
                ('photoUrl', models.TextField()),
                ('password', models.TextField()),
                ('salt', models.TextField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('senderId', models.IntegerField()),
                ('read', models.BooleanField(default=False)),
                ('createdAt', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('conversation', models.ForeignKey(db_column='conversationId', on_delete=django.db.models.deletion.CASCADE, related_name='messages', related_query_name='message', to='messenger_backend.conversation')),
                ('readBy', models.ManyToManyField(to='messenger_backend.User')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='conversation',
            name='group_users',
            field=models.ManyToManyField(to='messenger_backend.User'),
        ),
    ]
