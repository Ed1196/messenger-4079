from django.contrib.auth.middleware import get_user
from django.db.models import Max, Q
from django.db.models.query import Prefetch
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView
from rest_framework.request import Request


class Conversations(APIView):
    """get all conversations for a user, include latest message text for preview, and all messages
    include other user model so we have info on username/profile pic (don't include current user info)
    TODO: for scalability, implement lazy loading"""

    def get(self, request: Request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id

            conversations = (
                Conversation.objects.filter(Q(group_users__id__icontains=user_id))
                .prefetch_related(
                    Prefetch(
                        "messages", queryset=Message.objects.order_by("-createdAt")
                    )
                )
                .all()
            )
            conversations_response = []

            for convo in conversations:
                convo_dict = {
                    "id": convo.id,
                    "messages": [
                        message.to_dict(["id", "text", "senderId", "createdAt", "read"])
                        for message in convo.messages.all().reverse()
                    ],
                    "unread": convo.messages.filter(read=False).exclude(senderId=user_id).count(),
                }
                # set properties for notification count and latest message preview
                lastIndex = len(convo_dict["messages"]) - 1
                convo_dict["latestMessageText"] = convo_dict["messages"][lastIndex]["text"]
                lastReadByOther = convo.messages.filter(read=True).filter(senderId=user_id).first()
                if lastReadByOther is not None:
                    convo_dict["latestReadByOtherId"] = lastReadByOther.id
                # set a property "otherUser" so that frontend will have easier access
                user_fields = ["id", "username", "photoUrl"]
                otherUsers = convo.group_users.all().exclude(id=user_id)
                otherUsersArray = []
                for user in otherUsers:
                    userJSON = user.to_dict(user_fields)
                    # set property for online status of the other user
                    if user.id in online_users:
                        userJSON["online"] = True
                    else:
                        userJSON["online"] = False
                otherUsersArray.append(userJSON)
                convo_dict["otherUsers"] = otherUsersArray
                conversations_response.append(convo_dict)
            conversations_response.sort(
                key=lambda convo: convo["messages"][0]["createdAt"],
                reverse=True,
            )
            return JsonResponse(
                conversations_response,
                safe=False,
            )
        except Exception as e:
            return HttpResponse(status=500)
