from rest_framework.serializers import ModelSerializer
from .models import Movie, Review
from authenticate.models import User

class MovieSerializer(ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'profile', 'favourite', 'is_email_verified']
        read_only_fields = ['username', 'is_email_verified']
