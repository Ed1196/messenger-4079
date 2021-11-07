from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView


class UpdateMessages(APIView):
    """expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)"""

    def put(self, request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)

            user_id = user.id
            body = request.data
            conversation_id = body.get("conversationId")

            # if we already know conversation id, we can save time and just add it to message and return
            if conversation_id:
                convo = Conversation.objects.filter(id=conversation_id).first()
                if user_id not in (convo.user1.id, convo.user2.id):
                    return HttpResponse(status=403)
                messages = convo.messages.all()
                messages.exclude(senderId=user_id).update(read=True)
                convo_dict = {
                    "id": convo.id,
                    "messages": [
                        message.to_dict(["id", "text", "senderId", "createdAt", "read"])
                        for message in convo.messages.all().order_by("-createdAt").reverse()
                    ],
                    "unread": convo.messages.filter(read=False).exclude(senderId=user_id).count(),
                }
                # set properties for notification count and latest message preview
                lastIndex = len(convo_dict["messages"]) - 1
                convo_dict["latestMessageText"] = convo_dict["messages"][lastIndex]["text"]
                lastReadByOther = convo.messages.filter(read=True).filter(senderId=user_id).order_by("-createdAt").first()
                if lastReadByOther is not None:
                    convo_dict["latestReadByOtherId"] = lastReadByOther.id
                # set a property "otherUser" so that frontend will have easier access
                user_fields = ["id", "username", "photoUrl"]
                if convo.user1 and convo.user1.id != user_id:
                    convo_dict["otherUser"] = convo.user1.to_dict(user_fields)
                elif convo.user2 and convo.user2.id != user_id:
                    convo_dict["otherUser"] = convo.user2.to_dict(user_fields)

                # set property for online status of the other user
                if convo_dict["otherUser"]["id"] in online_users:
                    convo_dict["otherUser"]["online"] = True
                else:
                    convo_dict["otherUser"]["online"] = False

                return JsonResponse({"message": "succesful", "convo": convo_dict})
        except Exception as e:
            return HttpResponse(status=500)
