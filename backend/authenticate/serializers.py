from .models import User
from rest_framework import serializers
from .helpers import send_otp

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'name', 'profile']
    profile = serializers.ImageField(required=False)
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        send_otp(user)
        return user
    
class IsEmailVerified(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_email_verified']