from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('signup/', SignupAPIView.as_view()),
    path('oauth2_google/callback/', Oauth2Google.as_view()),
    path('oauth2_channeli/callback/', Oauth2Channeli.as_view()),
    path('activate_account/', AccountActivateView.as_view()),
    path('change_password/', ChangePasswordView.as_view()),
    path('reset_password/', ResetPasswordView.as_view()),
    path('logout/', LogoutView.as_view()),
]