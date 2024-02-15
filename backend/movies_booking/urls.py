from django.urls import path
from .views import *


urlpatterns = [
    path("user/signup/", SignupView.as_view(), name="signup"),
    path("user/login/", LoginView.as_view(), name="login"),
    path('user/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('movies/<int:movie_id>/', MovieDetailView.as_view(), name='movie-detail'),
    path('theaters/', TheaterCreateView.as_view(), name='theater-create'),
    path('theaters/list/', TheaterListView.as_view(), name='theater-list'),
    path('theaters/<int:theater_id>/', TheaterDetailView.as_view(), name='theater-detail'),
    path('movies/<int:movie_id>/theaters/', MovieTheaterListView.as_view(), name='movie-theater-list'),
    path('seats/', SeatListAPIView.as_view(), name='seat-list'),
    path('seats/select/', SeatSelectionAPIView.as_view(), name='seat-select'),
    path('seat-categories/', SeatCategoryListAPIView.as_view(), name='seat-category-list'),
    path('bookings/create/', BookingCreateAPIView.as_view(), name='create_booking'),
    path('bookings/<int:user_id>/', UserBookingsAPIView.as_view(), name='user-bookings'),
]