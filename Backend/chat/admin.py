from django.contrib import admin
from .models import Conversation, Message, User

# Register your models here.
admin.site.register(User)
admin.site.register(Conversation)
admin.site.register(Message)
