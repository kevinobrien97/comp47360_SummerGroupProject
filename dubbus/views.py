from django.shortcuts import render
from .serializers import StopsSerializer 
from rest_framework import viewsets      
from .models import Stops     

# Create your views here.
class StopsView(viewsets.ModelViewSet):  
    serializer_class = StopsSerializer   
    queryset = Stops.objects.all()     