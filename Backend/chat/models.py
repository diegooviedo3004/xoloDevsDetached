from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Conversation(models.Model):
    users = models.ManyToManyField(User, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation between {[user.first_name for user in self.users.all()]}"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name="sent_messages", on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender.first_name} {self.sender.last_name} in Conversation {self.conversation.id}"
