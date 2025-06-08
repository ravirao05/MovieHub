from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Movie
from django.db.models import Q
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .serializers import MovieSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView

from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import NumberFilter, DjangoFilterBackend

class FilterView(APIView):
    permission_classes = (IsAuthenticated, )
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
    permission_classes = (IsAuthenticated, )
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
    ordering = ['-rating', '-release_date']

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
        

class ToogleFav(UpdateAPIView):
    permission_classes = (IsAuthenticated, )

    pass