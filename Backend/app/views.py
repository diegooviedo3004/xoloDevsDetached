from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, TemplateView, ListView, DetailView
#from .forms import PostForm
from django.urls import reverse_lazy
from rest_framework.viewsets import ModelViewSet
from .models import Post, PostImage, Auction, Post, Promotion, Traceability, ReproductiveData,DairyCowData
from .serializers import PostSerializer, TraceabilitySerializer, DairyCowDataSerializer, ReproductiveDataSerializer
from django.contrib.auth import get_user_model
from .forms import PostForm, PostImageForm, TraceabilityForm, PostImageForm, DairyCowDataForm, ReproductiveDataForm
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Promotion
from django.conf import settings

from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings

import stripe

User = get_user_model()
class IndexView(ListView):
    model = Post
    template_name = "app/index.html"
    context_object_name = 'posts'

# Mobile
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

# Web

class PostTraceabilityView(TemplateView):
    def get(self, request):
        post_form = PostForm()
        traceability_form = TraceabilityForm()
        dairy_cow_form = DairyCowDataForm()
        reproductive_data_form = ReproductiveDataForm()

        return render(request, 'app/create_post.html', {
            'post_form': post_form,
            'traceability_form': traceability_form,
            'dairy_cow_form': dairy_cow_form,
            'reproductive_data_form': reproductive_data_form,
        })

    def post(self, request):
        post_form = PostForm(request.POST, request.FILES)
        traceability_form = TraceabilityForm(request.POST)
        dairy_cow_form = DairyCowDataForm(request.POST)
        reproductive_data_form = ReproductiveDataForm(request.POST)
        end_date = request.POST.get('end_date', None)

        

        images = request.FILES.getlist('images')

        if not images:
            post_form.add_error('images', 'Este campo es obligatorio.')  

        if len(images) > 9:
            post_form.add_error('images', 'No puedes subir más de 9 imágenes.')

        if post_form.is_valid():
            post = post_form.save(commit=False)
            post.user = request.user
            post.save()

            if end_date:
                Auction.objects.create(post=post, end_date=end_date)

            for image in images:
                PostImage.objects.create(post=post, image=image)

            if traceability_form.is_valid() and post_form.traceability:
                traceability = traceability_form.save(commit=False)
                traceability.post = post
                traceability.save()

                if dairy_cow_form.is_valid():
                    dairy_cow = dairy_cow_form.save(commit=False)
                    dairy_cow.traceability = traceability
                    dairy_cow.save()

                if reproductive_data_form.is_valid():
                    reproductive_data = reproductive_data_form.save(commit=False)
                    reproductive_data.traceability = traceability
                    reproductive_data.save()

            return redirect('index')

        return render(request, 'app/create_post.html', {
            'post_form': post_form,
            'traceability_form': traceability_form,
            'dairy_cow_form': dairy_cow_form,
            'reproductive_data_form': reproductive_data_form,
        })
class ContactView(TemplateView):
    template_name = "app/contact.html"

class PostViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostDetailView(APIView):

    def get(self, request, pk):
        try:
            post = Post.objects.get(id=pk)

            # Obtenemos los datos relacionados
            traceability_data = Traceability.objects.filter(post=post).first()
            dairy_cow_data = DairyCowData.objects.filter(traceability=traceability_data).first()
            reproductive_data = ReproductiveData.objects.filter(traceability=traceability_data).first()

            # Serializamos los datos si existen
            traceability_serializer = TraceabilitySerializer(traceability_data)
            dairy_cow_data_serializer = DairyCowDataSerializer(dairy_cow_data)
            reproductive_data_serializer = ReproductiveDataSerializer(reproductive_data)

            # Respondemos con los datos relacionados
            return Response({
                'traceability_data': traceability_serializer.data if traceability_data else None,
                'dairy_cow_data': dairy_cow_data_serializer.data if dairy_cow_data else None,
                'reproductive_data': reproductive_data_serializer.data if reproductive_data else None,
            }, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

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

def promote_post(request, post_id, plan):
    post = get_object_or_404(Post, id=post_id)
    promotion = Promotion.objects.create(post=post, plan=plan, amount=100)
    checkout_session = promotion.create_stripe_session()

    if checkout_session:
        return redirect(checkout_session.url)
    else:
        return render(request, 'error.html', {'message': 'Hubo un problema al iniciar el pago con Stripe.'})

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
