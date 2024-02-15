import traceback
from django.http import JsonResponse
from .serializer import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.contrib.auth import authenticate, logout, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework.decorators import permission_classes
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist




class SignupView(APIView):
    def post(self, request):
        data = request.data
        user_exist = User.objects.filter(Q(email=data.get("email", None)) | Q(username=data.get("username", None)))
        if user_exist:
            return Response({"message": "Account already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        data = request.data
        serializer = LoginSerializer(data=data)
        
        if serializer.is_valid():
            user = authenticate(request, username=data['username'], password=data['password'])

            if user:
                login(request, user)  # Log the user in
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                user_id = user.id
                username = user.username

                return Response(
                    {
                        'id': user_id,
                        'access': access_token,
                        'refresh': str(refresh),
                        'username':username
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     user = request.user
    #     serializer = UserSerializer(user)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, id):
        # Fetch a specific user
        user = get_object_or_404(User, id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User details updated"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_204_NO_CONTENT)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

class MovieListView(APIView):
    # permission_classes = [IsAuthenticated]
    def get_permissions(self):
        if self.request.method in ["POST", "PUT", "DELETE"]:
            return [IsAuthenticated(), IsAdminUser()]
        return []
    
    def get(self, request):
        # Fetch all movies with optional filters
        genre = request.query_params.get('genre', None)
        language = request.query_params.get('language', None)
        location = request.query_params.get('location', None)
        rating = request.query_params.get('rating', None)

        movies = Movie.objects.all()

        if genre:
            movies = movies.filter(genre__iexact=genre)

        if language:
            movies = movies.filter(language__iexact=language)

        # Assuming you have a 'location' field in your Movie model
        if location:
            movies = movies.filter(location__iexact=location)

        if rating:
            movies = movies.filter(rating__iexact=rating)

        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # @permission_classes([IsAdminUser])
    def post(self, request):
        # Add a new movie
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieDetailView(APIView):
    # permission_classes = [IsAuthenticated]
    
    
    def get(self, request, movie_id):
        # Fetch a specific movie
        movie = get_object_or_404(Movie, id=movie_id)
        serializer = MovieSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # @permission_classes([IsAdminUser])
    def put(self, request, movie_id):
        # Update a specific movie
        movie = get_object_or_404(Movie, id=movie_id)
        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @permission_classes([IsAdminUser])
    def delete(self, request, movie_id):
        # Delete a specific movie
        movie = get_object_or_404(Movie, id=movie_id)
        movie.delete()
        return Response({"message": "Movie deleted"}, status=status.HTTP_204_NO_CONTENT)
    
 
class TheaterCreateView(APIView):
    def post(self, request):
        serializer = TheaterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TheaterListView(APIView):
    def get(self, request):
        theaters = Theater.objects.all()
        serializer = TheaterSerializer(theaters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TheaterDetailView(APIView):
    def get(self, request, theater_id):
        theater = get_object_or_404(Theater, id=theater_id)
        serializer = TheaterSerializer(theater)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MovieTheaterListView(APIView):
    def get(self, request, movie_id, *args, **kwargs):
        try:
            movie = Movie.objects.get(pk=movie_id)
            theaters = movie.theaters.all()
            serializer = TheaterSerializer(theaters, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)
        

class SeatListAPIView(APIView):
    # permission_classes = [permissions.AllowAny]  # Adjust the permission as needed

    def get(self, request, *args, **kwargs):
        movie_id = self.request.query_params.get('movie_id')
        theater_id = self.request.query_params.get('theater_id')
        
        # Add logic to filter seats based on movie_id and theater_id
        seats = Seat.objects.filter(movie_id=movie_id, theater_id=theater_id)
        
        serializer = SeatSerializer(seats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        serializer = SeatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SeatSelectionAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Require authentication to select seats

    def post(self, request, *args, **kwargs):
        seat_ids = request.data.get('selected_seats', [])
        
        try:
            # Fetch seats and mark them as reserved
            seats = Seat.objects.filter(id__in=seat_ids, is_reserved=False)
            for seat in seats:
                seat.is_reserved = True
                seat.save()

            serializer = SeatSerializer(seats, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Seat.DoesNotExist:
            return Response({'error': 'One or more selected seats do not exist or are already reserved.'}, status=status.HTTP_400_BAD_REQUEST)
        
class SeatCategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        seat_categories = SeatCategory.objects.all()
        serializer = SeatCategorySerializer(seat_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = SeatCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class BookingCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Get user_id, theater_id, movie_id from request data
            user_id = request.data.get('user_id')
            theater_id = request.data.get('theater_id')
            movie_id = request.data.get('movie_id')
            selected_seats = request.data.get('selected_seats', [])
            
            print("User ID:", user_id)
            print("Theater ID:", theater_id)
            print("Movie ID:", movie_id)
            print("Selected Seats:", selected_seats)

            # Retrieve the user, theater, and movie objects
            user = get_object_or_404(User, id=user_id)
            theater = get_object_or_404(Theater, id=theater_id)
            movie = get_object_or_404(Movie, id=movie_id)

            print("User:", user)
            print("Theater:", theater)
            print("Movie:", movie)
            # Implement your logic to calculate total cost, mark seats as reserved, and create the booking
            # For simplicity, let's assume each seat has a price stored in its category
            total_cost = sum(Seat.objects.filter(id__in=selected_seats).values_list('category__price', flat=True))
            
            # Mark selected seats as reserved
            Seat.objects.filter(id__in=selected_seats).update(is_reserved=True)

            # Create the booking
            booking = Booking.objects.create(
                user=user,
                theater=theater,
                movie=movie,
                total_cost=total_cost,
                booking_time=timezone.now()
            )

            # Link selected seats to the booking
            booking.seats.set(selected_seats)

            serializer = BookingSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserBookingsAPIView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        try:
            # Retrieve the bookings for the specified user
            bookings = Booking.objects.filter(user_id=user_id)

            # Serialize the booking data using the modified serializer
            serializer = BookingSerializer(bookings, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)