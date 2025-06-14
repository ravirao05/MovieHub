from django.urls import path
from .views import MovieView, FilterView, SearchView, FavouritesView, ProfileView, ReviewView, TestView

urlpatterns = [
    path('', SearchView.as_view()),
    path('filters/', FilterView.as_view()),
    path('movie/<slug:id>/', MovieView.as_view()),
    path('favourites/', FavouritesView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('reviews/', ReviewView.as_view()),
    path('test/', TestView.as_view()),
]