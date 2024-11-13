from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, IndexView, ContactView, CreatePostView, PostsByUser, PostDetailView
from .views import PostTraceabilityView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    # web
    path('', IndexView.as_view(), name="index"),
    path('new/post/', PostTraceabilityView.as_view(), name="create_post"),
    # path('post/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('contact/', ContactView.as_view(), name="contact"),
    path('post/<int:pk>/', PostDetailView.as_view(), name='post_detail'),



    # mobile
    path('user/posts/<int:user_id>/', PostsByUser.as_view(), name="user-posts"),
    path('', include(router.urls)),


    # Stripe 

    path('webhook/stripe/', views.stripe_webhook, name='stripe_webhook'),
    path('test/<int:post_id>/<plan>/', views.promote_post, name='promote_post'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
