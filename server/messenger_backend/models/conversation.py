from django.db import models
from django.db.models import Q

from . import utils
from .user import User


class Conversation(utils.CustomModel):

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)
    group_users = models.ManyToManyField(User)

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
