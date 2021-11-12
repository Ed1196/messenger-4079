from django.db import models
from django.db.models import Q

from . import utils
from .user import User


class UserMessage(utils.CustomModel):
    user_id = models.IntegerField(null=True)
    latest_message_id = models.IntegerField(null=True)
    unread_messages = models.IntegerField(default=0, null=True)


class LastRead(utils.CustomModel):
    user_read = models.ManyToManyField(UserMessage)


class Conversation(utils.CustomModel):
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)
    group_users = models.ManyToManyField(User)
    last_read_by_users = models.ForeignKey(LastRead, on_delete=models.CASCADE, default=None, null=True)

    # find conversation given two user Ids
    def find_conversation(user_ids):
        # return conversation or None if it doesn't exist
        try:
            q_objects = Q()
            for user_id in user_ids:
                q_objects = q_objects & Q(group_users__id__icontains=user_id)
            return Conversation.objects.filter(q_objects)
        except Conversation.DoesNotExist:
            return None
