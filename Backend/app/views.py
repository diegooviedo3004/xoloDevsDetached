from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, TemplateView
from .forms import PostForm
from django.urls import reverse_lazy
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer

class IndexView(TemplateView):
    template_name = "app/index.html"

class CreatePostView(TemplateView):
    template_name = "app/create_post.html"

class ContactView(TemplateView):
    template_name = "app/contact.html"

class PostViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = 'app/create_post.html'
    success_url = reverse_lazy('post_list')  # Cambia esto con la URL donde redirigirás tras el guardado exitoso

    def form_valid(self, form):
        # Asigna el usuario autenticado al post antes de guardarlo
        form.instance.user = self.request.user
        return super().form_valid(form)
