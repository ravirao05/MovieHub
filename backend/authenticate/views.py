from rest_framework.views import APIView 
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .serializers import UserSerializer
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import User
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

class HomeAPIView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        if request.user:
            content = {'message': 'Welcome to the JWT Authentification page using React Js and Django!'}
            return Response(content, status=status.HTTP_200_OK)
        
class SignupAPIView(APIView):
    def get(self, request):
        return Response({'message': request.user.is_authenticated})
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({'errors': serializer.errors}, status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            user = authenticate(username=request.data['username'], password = request.data['password'])
            if user:
                refresh_token = RefreshToken.for_user(user)
                access_token = AccessToken.for_user(user)
                content={
                    'refresh': str(refresh_token),
                    'access': str(access_token)
                }
                return Response(content, status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            return Response({'message': 'something went wrong'}, status.HTTP_400_BAD_REQUEST)

class OtpValidateView(APIView):
    def post(self, request):
        if not User.objects.filter(email = request.data.get('email')):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(email = request.data.get('email'))
        if user.otp == request.data.get('OTP'):
            user.is_email_verified = True
            user.otp = None
            user.email_verification_token = None
            user.save()
            return Response({'message': 'OTP verified.'}, status.HTTP_200_OK)
        return Response({'message': 'wrong OTP'},status=status.HTTP_400_BAD_REQUEST)

@receiver(post_save, sender=User)
def send_otp(sender, instance, created, **kwargs):
    if created:
        try:
            otp = 62345
            subject = "email verification"
            message = f"Your OTP for email verification is: {otp}"
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [instance.email, ]
            # send_mail(subject, message, from_email, recipient_list)
            instance.otp = otp
            instance.save()
        except Exception as e:
            print(e)