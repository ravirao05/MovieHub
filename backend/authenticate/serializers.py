from .models import User
from rest_framework import serializers
from .utils import send_account_activation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'name', 'profile']
    profile = serializers.ImageField(required=False)
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        send_account_activation(user)
        return user

class OauthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'registration_method', 'is_email_verified']
    def create(self, validated_data):
        user = User(**validated_data)
        user.save()
        return user
    
class IsEmailVerified(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_email_verified']