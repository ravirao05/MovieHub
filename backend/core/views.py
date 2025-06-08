from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Movie
from django.db.models import Q
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .serializers import MovieSerializer, ProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import NumberFilter, DjangoFilterBackend
from authenticate.models import User

class FilterView(APIView):
    # permission_classes = (IsAuthenticated, )
    def get(self, request, *args, **kwargs):
        elements = Movie.objects.values_list('genre', flat=True).distinct()
        genres = []
        for element in elements:
            for filter in element[:-1].split(','):
                genres.append(filter)
        genres = list(set(genres))
        elements = Movie.objects.values_list('language', flat=True).distinct()
        languages = []
        for element in elements:
            for filter in element[:-1].split(','):
                languages.append(filter)
        languages = list(set(languages))
        return Response({'genres': genres, 'languages': languages}, status=status.HTTP_200_OK)

class SearchView(ListAPIView):
    # permission_classes = (IsAuthenticated, )
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        'rating': ['gte'],
        'genre': ['icontains'],
        'language': ['icontains'],
        'release_date': ['icontains'],
    }
    search_fields = ['name', 'language']
    ordering_fields = ['rating', 'name']
    ordering = ['-release_date', '-rating',]

class MovieView(RetrieveAPIView):
    # permission_classes = (IsAuthenticated, )
    serializer_class = MovieSerializer

    def get_object(self):
        if 'id' in self.kwargs:
            movie_id = self.kwargs['id']
        try:
            return Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return None
        

class ProfileView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    serializer_class = ProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = User.objects.get(pk=self.request.user.id)
        serializer = self.get_serializer(instance)
        content = serializer.data
        favourite_movies = []
        for movie_id in serializer.data['favourite']:
            movie = Movie.objects.get(pk = movie_id)
            favourite_movies.append(MovieSerializer(movie).data)
        content['favourite'] = favourite_movies
        return Response(content)

class FavouritesView(APIView):
    permission_classes = (IsAuthenticated, )
    
    def get(self, request):
        user = request.user
        fav = []
        for movie in user.favourite.all():
            fav.append(movie.id)
        if request.GET.get('id'):
            movie = Movie.objects.get(pk=request.GET['id'])
            isFav = movie in user.favourite.all()
            if isFav:
                user.favourite.remove(movie)
                return Response({'fav': False}, status=status.HTTP_200_OK)
            else:
                user.favourite.add(movie)
                return Response({'fav': True}, status=status.HTTP_200_OK)
        else:
            return Response({'fav': fav}, status=status.HTTP_200_OK)