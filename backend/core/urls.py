from django.urls import path
from .views import MovieView, FilterView , SearchView

urlpatterns = [
    path('', SearchView.as_view()),
    path('filters/', FilterView.as_view()),
    path('movie/<slug:id>/', MovieView.as_view())
]