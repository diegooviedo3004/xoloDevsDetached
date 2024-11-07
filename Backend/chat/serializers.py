from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'timestamp', 'is_read', 'is_deleted']


class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    other_user_id = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'other_user', 'other_user_id', 'last_message']

    def get_other_user(self, obj):
        request_user = self.context['request'].user
        other_user = obj.users.exclude(id=request_user.id).first()
        return other_user.get_full_name() if other_user else None

    def get_other_user_id(self, obj):
        request_user = self.context['request'].user
        other_user = obj.users.exclude(id=request_user.id).first()
        return other_user.id if other_user else None

    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(last_message).data if last_message else ""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    


class ConversationDetailSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    messages = MessageSerializer(many=True)

    class Meta:
        model = Conversation
        fields = ['id', 'other_user', 'messages']

    def get_other_user(self, obj):
        request_user = self.context['request'].user
        other_user = obj.users.exclude(id=request_user.id).first()
        return other_user.get_full_name() if other_user else ""
    
    