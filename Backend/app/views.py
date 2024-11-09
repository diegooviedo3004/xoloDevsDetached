from django.shortcuts import render, get_object_or_404, redirect
from rest_framework import generics
from django.views.generic import View
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, TemplateView, ListView, DetailView
from .forms import PostForm
from django.urls import reverse_lazy
from rest_framework.viewsets import ModelViewSet
from .models import Post, PostImage
from .serializers import PostSerializer, PostsByUserSerializer
from django.contrib.auth import get_user_model
from chat.models import Conversation, Message
from chat.serializers import ConversationSerializer
from rest_framework.renderers import JSONRenderer

User = get_user_model()
class IndexView(ListView):
    model = Post
    template_name = "app/index.html"
    context_object_name = 'posts'

class CreatePostView(TemplateView):
    template_name = "app/create_post.html"

class ChatView(TemplateView):
    template_name = "app/chat.html"

class PostDetailView(DetailView):
    model = Post
    template_name = 'app/post_detail.html'  
    context_object_name = 'post'      

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['images'] = self.object.images.all()  
        print(context['images'][0].image.url)
        # context['bids'] = self.object.bids.all()       
        # context['highest_bid'] = self.object.get_highest_bid()  
        return context

class ContactView(TemplateView):
    template_name = "app/contact.html"
class ChatListView(LoginRequiredMixin, ListView):
    model = Conversation
    template_name = 'app/chat.html'
    context_object_name = 'conversations'

    def get_queryset(self):
        # Obtiene todas las conversaciones del usuario actual
        queryset = Conversation.objects.filter(users=self.request.user)

        # Agrega el otro usuario y el último mensaje a cada conversación
        for conversation in queryset:
            # Elige al otro usuario en la conversación (que no sea el actual)
            other_user = conversation.users.exclude(id=self.request.user.id).first()
            conversation.other_user = other_user
            # Obtiene el último mensaje de la conversación
            conversation.last_message = conversation.messages.order_by('-timestamp').first()

        return queryset

class SendMessageView(LoginRequiredMixin, View):
    def post(self, request, conversation_id):
        content = request.POST.get('content')
        conversation = get_object_or_404(Conversation, id=conversation_id, users=request.user)

        # Solo guarda el mensaje si el contenido no está vacío
        if content:
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=content
            )

        # Redirecciona de vuelta a la página del chat
        return redirect('chat')

# class ChatListView(LoginRequiredMixin, TemplateView):
#     template_name = 'app/chat.html'

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
        
#         # Obtener las conversaciones del usuario autenticado
#         conversations = Conversation.objects.filter(users=self.request.user)
        
#         # Serializar las conversaciones
#         serializer = ConversationSerializer(conversations, many=True, context={'request': self.request})
#         conversations_data = JSONRenderer().render(serializer.data)  # Convertir a JSON

#         # Pasar el JSON al contexto para la plantilla
#         context['conversations'] = serializer.data  # Si quieres JSON, usa `conversations_data`
#         return context

class PostViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostsByUser(generics.ListAPIView):
    serializer_class = PostsByUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = get_object_or_404(User, id=user_id)
        return Post.objects.filter(user=user)

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = 'app/create_post.html'
    success_url = reverse_lazy('home') 

    def form_valid(self, form):
        form.instance.user = self.request.user  
        response = super().form_valid(form)
          
        if form.instance.type == 'Post': 
            form.instance.end_date = None

        images = self.request.FILES.getlist('images')  
        for image in images:
            PostImage.objects.create(post=form.instance, image=image)  

        return response
