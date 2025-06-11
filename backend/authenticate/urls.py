from django.urls import path
from .views import SignupAPIView, OtpValidateView, TokenValidateView, LogoutView, ChangePasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('signup/', SignupAPIView.as_view()),
    path('validate_otp/', OtpValidateView.as_view()),
    path('validate_token/', TokenValidateView.as_view()),
    path('change_password/', ChangePasswordView.as_view()),
    path('logout/', LogoutView.as_view()),
]