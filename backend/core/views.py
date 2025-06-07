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
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView

from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import NumberFilter, DjangoFilterBackend

class FilterView(APIView):

    def get(self, request, *args, **kwargs):
        elements = Movie.objects.values_list('genre', flat=True).distinct()
        genres = []
        for element in elements:
            for filter in element[:-1].split(','):
                genres.append(filter)
        genres = list(set(genres))
        languages = Movie.objects.values_list('language', flat=True).distinct()
        return Response({'genres': genres, 'languages': languages}, status=status.HTTP_200_OK)

class SearchView(ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        'rating': ['gte'],
        'genre': ['exact'],
        'language': ['exact'],
    }
    search_fields = ['name', 'language']
    ordering_fields = ['rating', 'name']
    ordering = ['-rating', '-release_date']
    # filter_class = NumberFilter
    # def get_queryset(self):Add commentMore actions
    #     queryset = super().get_queryset()
    #     rating = self.request.query_params.get('rating', None)
    #     if rating:
    #         queryset = queryset.filter(rating__gte=rating)
    #     return queryset
class MovieView(RetrieveAPIView):
    serializer_class = MovieSerializer

    def get_object(self):
        if 'id' in self.kwargs:
            movie_id = self.kwargs['id']
        try:
            return Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return None