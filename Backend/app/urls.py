from django.urls import path, include
from .views import RegisterView, LoginView, UserProfileView, CreateCowView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/<int:user_id>/', UserProfileView.as_view(), name='user-profile'),
    path('create-cow/', CreateCowView.as_view(), name='create-cow'),

    path('', include(router.urls)),
    # path('update-profile-picture/', ProfilePictureUpdateView.as_view(), name='update-profile-picture'),

]
