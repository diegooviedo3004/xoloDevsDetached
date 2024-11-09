from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, IndexView, ContactView, CreatePostView, PostCreateView, PostsByUser

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('', IndexView.as_view(), name="home"),
    path('new/post/', PostCreateView.as_view(), name="create_post"),
    path('user/posts/<int:user_id>/', PostsByUser.as_view(), name="user-posts"),
    path('contact/', ContactView.as_view(), name="contact"),
    path('', include(router.urls)),
]
