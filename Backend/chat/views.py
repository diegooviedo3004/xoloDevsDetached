from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Conversation, Message, User
from .serializers import ConversationSerializer, UserSerializer, MessageSerializer, ConversationDetailSerializer

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(users=user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        other_user_id = self.kwargs['user_id']
        other_user = get_object_or_404(User, id=other_user_id)
        conversation = Conversation.objects.filter(users=user).filter(users=other_user).first()

        if not conversation:
            conversation = Conversation.objects.create()
            conversation.users.add(user, other_user)

        conversation.messages.filter(is_read=False, sender=other_user).update(is_read=True)


        return conversation

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)