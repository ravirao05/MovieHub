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

class DashboardView(ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class FilterView(APIView):
    def get_filter_arguments(filter):
        elements = Movie.objects.values_list(filter, flat=True).distinct()
        filters = []
        for element in elements:
            for filter in element[:-1].split(','):
                filters.append(filter)
        return list(set(filters))

    def get(self, request, *args, **kwargs):
            genres = self.get_filter_arguments('genre')
            languages = self.get_filter_arguments('language')
            return Response({'genres': genres}, status=status.HTTP_200_OK)

class SearchView(APIView):
    def get(self, request, *args, **kwargs):
        q = request.GET.get('q')
        genres = request.GET.getlist('genre')
        language = request.GET.get('language')
        rating = request.GET.get('rating')
        year = request.GET.get('year')
        query = Q()
        if q:
            query = query & (Q(name__contains = q) | Q(tags__contains = q))
        if (genres):
            for genre in genres:
                query = query & (Q(genre__contains = genre))
        if (language):
            query = query & (Q(language__contains = language))
        movies = Movie.objects.filter(query)
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(movies, request)
        serializer = MovieSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)
class MovieView(RetrieveAPIView):
    serializer_class = MovieSerializer

    def get_object(self):
        movie_id = self.request.GET.get('id')
        try:
            return Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            return None