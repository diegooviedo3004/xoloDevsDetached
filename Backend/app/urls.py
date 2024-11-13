from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, IndexView, ContactView
from .views import PostTraceabilityView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')


urlpatterns = [
    # web
    path('', IndexView.as_view(), name="index"),
    path('new/post/', PostTraceabilityView.as_view(), name="create_post"),
    # path('post/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('contact/', ContactView.as_view(), name="contact"),



    # mobile
    path('', include(router.urls)),


    # Stripe 

    path('webhook/stripe/', views.stripe_webhook, name='stripe_webhook'),
    path('test/<int:post_id>/<plan>/', views.promote_post, name='promote_post'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
