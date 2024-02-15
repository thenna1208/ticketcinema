from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone
from ticket_booking import settings

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, username,password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username,password, **extra_fields)

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    username = models.CharField(max_length=100, validators=[MinLengthValidator(3)], unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100, validators=[MinLengthValidator(6)])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    USERNAME_FIELD = "username"
    objects = UserManager()
    
    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    director = models.CharField(max_length=255)
    actors = models.TextField()
    runtime = models.IntegerField()  # in minutes
    genre = models.CharField(max_length=50)
    language = models.CharField(max_length=50)
    rating = models.CharField(max_length=10)
    image_url = models.URLField(blank=True, null=True)

class Theater(models.Model):
    movie=models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name="theaters"
    )
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    pincode = models.CharField(max_length=10)
    movie_timing = models.DateTimeField(default=None, null=True)
    
    def __str__(self) -> str:
        return self.name
    
    
class SeatCategory(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField(default=0.00)

    def __str__(self):
        return self.name   
    
     
class Seat(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=255)
    is_reserved = models.BooleanField(default=False)
    category = models.ForeignKey(SeatCategory, on_delete=models.CASCADE)
    
    
    def __str__(self) -> str:
        return f"{self.theater.name} - {self.movie.title}"
    
class Booking(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    total_cost = models.FloatField(default=0.00)
    booking_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.theater.name} - {self.movie.title}"
