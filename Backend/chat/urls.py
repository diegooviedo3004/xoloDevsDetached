from django.urls import path
from project.asgi import sio
from .views import ConversationListView, ConversationDetailView

urlpatterns = [
    path('socket.io/', sio.handle_request),  
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:user_id>/', ConversationDetailView.as_view(), name='conversation-detail'),

]