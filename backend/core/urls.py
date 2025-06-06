from django.urls import path
from .views import MovieView, DashboardView, FilterView , SearchView

urlpatterns = [
    path('', DashboardView.as_view()),
    path('search/', SearchView.as_view()),
    path('filters/', FilterView.as_view()),
    path('movie/<slug:id>', MovieView.as_view())
]