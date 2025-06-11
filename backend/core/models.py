from django.db import models
from datetime import date


class Movie(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=256)
    image = models.CharField(max_length=512)
    description = models.TextField()
    rating = models.FloatField()
    platform = models.CharField(max_length=256)
    release_date = models.CharField(max_length=12)
    content_rating = models.CharField(max_length=8)
    trailer = models.CharField(max_length=128)
    duration = models.CharField(max_length=8)
    tags = models.CharField(max_length=256)
    language = models.CharField(max_length=256)
    genre = models.CharField(max_length=256)

class Review(models.Model):
    title = models.CharField(max_length=256)
    body = models.TextField()
    date = models.CharField(max_length=32)
    rating = models.CharField(max_length=8)
    movie = models.ForeignKey('core.Movie', on_delete=models.CASCADE)
    user = models.ForeignKey('authenticate.User', on_delete=models.SET_NULL, null=True)
