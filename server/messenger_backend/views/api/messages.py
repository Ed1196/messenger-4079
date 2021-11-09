from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message, User
from online_users import online_users
from rest_framework.views import APIView


class Messages(APIView):
    """expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)"""

    def post(self, request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)

            sender_id = user.id
            body = request.data
            conversation_id = body.get("conversationId")
            text = body.get("text")
            recipient_ids = body.get("recipientIds")
            sender = body.get("sender")

            # if we already know conversation id, we can save time and just add it to message and return
            if conversation_id:
                conversation = Conversation.objects.filter(id=conversation_id).first()
                message = Message(
                    senderId=sender_id, text=text, conversation=conversation, read=False
                )
                message.save()
                message_json = message.to_dict()
                return JsonResponse({"message": message_json, "sender": body["sender"]})

            # if we don't have conversation id, find a conversation to make sure it doesn't already exist
            users_in_group = [sender_id] + recipient_ids
            conversation = Conversation.find_conversation(users_in_group)
            if not conversation:
                # create conversation
                conversation = Conversation()
                conversation.save()
                for user_id in users_in_group:
                    u = User.get_by_id(user_id)
                    conversation.group_users.add(u)

                if sender and sender["id"] in online_users:
                    sender["online"] = True

            message = Message(senderId=sender_id, text=text, conversation=conversation)
            message.save()
            message_json = message.to_dict()
            return JsonResponse({"message": message_json, "sender": sender})
        except Exception as e:
            return HttpResponse(status=500)
