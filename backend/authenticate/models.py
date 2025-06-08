from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

def image_directory(instance, filename):
      return 'user_{0}/avatar.jpg'.format(instance.id) 

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('username required...')
        email = self.normalize_email(email)
        user = self.model(username = username, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)



class User(AbstractUser):
    username = models.CharField(max_length=64, unique=True)
    email = models.EmailField(max_length=64, unique=True)
    first_name = None
    last_name = None
    name = models.CharField(max_length=64)
    profile = models.ImageField(upload_to=image_directory, default='avatar.jpg', blank=True)
    favourite = models.ManyToManyField('core.Movie', blank=True)
    is_email_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    email_verification_token = models.CharField(max_length=248, null=True, blank=True)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS=['email', 'name',]