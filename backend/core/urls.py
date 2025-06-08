from django.urls import path
from .views import MovieView, FilterView, SearchView, FavouritesView, ProfileView
urlpatterns = [
    path('', SearchView.as_view()),
    path('filters/', FilterView.as_view()),
    path('movie/<slug:id>/', MovieView.as_view()),
    path('favourites/', FavouritesView.as_view()),
    path('profile/', ProfileView.as_view()),
]