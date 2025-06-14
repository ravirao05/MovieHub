from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Movie, Review
from django.db.models import Q
from rest_framework import status
from .serializers import MovieSerializer, ProfileSerializer, ReviewSerializer
from rest_framework.generics import RetrieveAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, ListCreateAPIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from authenticate.models import User
from datetime import datetime


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
    ordering_fields = ['release_date', 'rating', 'name', 'duration']
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

class ProfileView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, )

    serializer_class = ProfileSerializer
    queryset = User.objects.all()

    def get_object(self):
        self.kwargs['pk'] = self.request.user.id
        return super().get_object()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
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
        if request.GET.get('id'): # if id is supplied, return if the movie_id is favourite or not
            movie = Movie.objects.get(pk=request.GET['id'])
            isFav = movie in user.favourite.all()
            if isFav:
                user.favourite.remove(movie)
                return Response({'fav': False}, status=status.HTTP_200_OK)
            else:
                user.favourite.add(movie)
                return Response({'fav': True}, status=status.HTTP_200_OK)
        else: # else return all favourite movies' id
            return Response({'fav': fav}, status=status.HTTP_200_OK)

class ReviewView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    filter_backends = [OrderingFilter]
    ordering = ['-id']
    page_size = 3

    def list(self, request, *args, **kwargs):
        try:
            self.queryset = Review.objects.filter(movie_id = request.GET['movie'])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        for entry in serializer.data:
            user_id = entry['user']
            if type(user_id) == int:
                entry['user'] = User.objects.get(pk = user_id).username
        return self.get_paginated_response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        request.data['user'] = request.user.pk
        request.data['date'] = datetime.now().strftime("%d %B %Y")
        return super().create(request, *args, **kwargs)

class TestView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    queryset = User.objects.all()
    def get_object(self):
        self.kwargs['pk'] = self.request.user.id
        print(self.request.user.id)
        return super().get_object()