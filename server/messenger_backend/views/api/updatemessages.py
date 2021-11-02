from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView


class UpdateMessages(APIView):
    """expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)"""

    def post(self, request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)

            body = request.data
            conversation_id = body.get("conversationId")

            # if we already know conversation id, we can save time and just add it to message and return
            if conversation_id:
                conversation = Conversation.objects.filter(id=conversation_id).first()
                messages = conversation.messages.all()
                for m in messages:
                    if m.senderId != user.id:
                        m.read = True
                        m.save()
                convo_dict = {
                    "id": conversation.id,
                    "messages": [
                        message.to_dict(["id", "text", "senderId", "createdAt", "read"])
                        for message in conversation.messages.all()
                    ],
                }
                return JsonResponse({"message": "succesful", "convo": convo_dict})
        except Exception as e:
            return HttpResponse(status=500)
