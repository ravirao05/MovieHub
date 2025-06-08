from .models import User
from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'name']
    def create(self, validated_data):
        user = User(username=validated_data['username'], name=validated_data['name'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user