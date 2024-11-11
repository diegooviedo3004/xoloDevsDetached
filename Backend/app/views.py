from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, TemplateView, ListView, DetailView
#from .forms import PostForm
from django.urls import reverse_lazy
from rest_framework.viewsets import ModelViewSet
from .models import Post, PostImage
from .serializers import PostSerializer, PostsByUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()
class IndexView(ListView):
    model = Post
    template_name = "app/index.html"
    context_object_name = 'posts'

class CreatePostView(TemplateView):
    template_name = "app/create_post.html"

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


import stripe
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Promotion
from django.conf import settings

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get('Stripe-Signature')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        promotion_id = session['metadata']['promotion_id']
        promotion = Promotion.objects.get(id=promotion_id)
        promotion.is_paid = True
        promotion.save()

    return JsonResponse({'status': 'success'}, status=200)


from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from .models import Post, Promotion

def promote_post(request, post_id, plan):
    post = get_object_or_404(Post, id=post_id)
    promotion = Promotion.objects.create(post=post, plan=plan, amount=100)
    checkout_session = promotion.create_stripe_session()

    if checkout_session:
        return redirect(checkout_session.url)
    else:
        return render(request, 'error.html', {'message': 'Hubo un problema al iniciar el pago con Stripe.'})
"""
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
"""