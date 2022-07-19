from django.shortcuts import render, redirect
from .serializers import StopsSerializer, WeatherSerializer, RoutesSerializer, MyTokenObtainPairSerializer, RegisterSerializer, FavouriteStopsSerializer
from rest_framework import viewsets, generics, status      
from .models import Stops, Weather, Routes, FavouriteStops   
from django.contrib.auth.models import User, auth
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from rest_framework.views import APIView

# Create your views here.
class StopsView(viewsets.ModelViewSet): 
    permission_classes = (AllowAny,) 
    serializer_class = StopsSerializer   
    queryset = Stops.objects.all()

class WeatherView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = WeatherSerializer
    queryset = Weather.objects.all()

class RoutesView(viewsets.ModelViewSet): 
    serializer_class = RoutesSerializer
    queryset = Routes.objects.all()     


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# class RegisterView(generics.CreateAPIView):
class RegisterView(APIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    # serializer_class = RegisterSerializer
    def post(self, request, format='json'):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavouritesView(viewsets.ModelViewSet):
    serializer_class = FavouriteStopsSerializer
    queryset = FavouriteStops.objects.all()

    # save the user that created the favourite
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    # only return stops saved by logged in user
    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = request.POST.get('text')
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)
