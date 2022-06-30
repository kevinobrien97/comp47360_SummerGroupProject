from django.shortcuts import render
from .serializers import StopsSerializer, WeatherSerializer 
from rest_framework import viewsets      
from .models import Stops, Weather     

# Create your views here.
class StopsView(viewsets.ModelViewSet):  
    serializer_class = StopsSerializer   
    queryset = Stops.objects.all()

class WeatherView(viewsets.ModelViewSet):
    serializer_class = WeatherSerializer
    queryset = Weather.objects.all()
