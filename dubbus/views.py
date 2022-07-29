from django.shortcuts import render, redirect
from .serializers import StopsSerializer, WeatherSerializer, TokenObtainPairSerializer, RegisterSerializer, FavouriteStopsSerializer, RoutesUpdatedSerializer, FavouriteRoutesSerializer, StopTimesUpdatedSerializer, RouteStopsSerializer
from rest_framework import viewsets, status, generics  
from .models import Stops, Weather, FavouriteStops, RoutesUpdated, FavouriteRoutes, StopTimesUpdated, RouteStops
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from functools import reduce
import operator

from rest_framework.views import APIView

class StopsView(viewsets.ModelViewSet): 
    permission_classes = (AllowAny,) 
    serializer_class = StopsSerializer   
    queryset = Stops.objects.all()

class WeatherView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = WeatherSerializer
    queryset = Weather.objects.all()

class TokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

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

    # don't need custom method for deleting

class RoutesUpdatedView(viewsets.ModelViewSet): 
    permission_classes = (AllowAny,) 
    serializer_class = RoutesUpdatedSerializer   
    queryset = RoutesUpdated.objects.all()

class FavouriteRoutesView(viewsets.ModelViewSet):
    serializer_class = FavouriteRoutesSerializer
    queryset = FavouriteRoutes.objects.all()

    # save the user that created the favourite
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    # only return routes saved by logged in user
    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)

    # don't need custom method for deleting

class StopTimesUpdatedView(generics.ListAPIView): 
    permission_classes = (AllowAny,) 
    serializer_class = StopTimesUpdatedSerializer   

    def get_queryset(self):
        stop_id = self.kwargs['stop_id']
        day = self.kwargs['day']
        print(day)
        # only return the stop schedule for the day specified
        if day == "0":
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1003", "3"]))
        elif day == "1":
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1003", "2"]))
        elif day == "2" or day =="3" or day =="4" or day == "5":
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1002", "2"]))
        # day == "6"
        else: 
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1001", "0"]))
        return StopTimesUpdated.objects.filter(query, stop_id=stop_id)
        # trip_headsign = self.kwargs['trip_headsign']
        # return StopTimesUpdated.objects.filter(stop_id=stop_id)   

class FullRouteStopTimesUpdatedView(generics.ListAPIView): 
    permission_classes = (AllowAny,) 
    serializer_class = StopTimesUpdatedSerializer   

    def get_queryset(self):
        route_short_name = self.kwargs['route_short_name']
        trip_headsign = self.kwargs['trip_headsign']
        day = self.kwargs['day']
        print(day)
        # only return the stop schedule for the day specified
        if day == "0":
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1003", "3"]))
        elif day == "1":
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1003", "2"]))
        elif day == "2" or day =="3" or day =="4" or day == "5":
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1002", "2"]))
        # day == "6"
        else: 
            query = reduce(operator.or_, (Q(service_id = item) for item in ["y1001", "0"]))
        return StopTimesUpdated.objects.filter(query, route_short_name=route_short_name, trip_headsign=trip_headsign)
        # trip_headsign = self.kwargs['trip_headsign']
        # return StopTimesUpdated.objects.filter(stop_id=stop_id)   

class RouteStopsView(generics.ListAPIView): 
    permission_classes = (AllowAny,) 
    serializer_class = RouteStopsSerializer
    # RouteStops.objects.get(route_short_name='1')
    
    # def get_queryset(request):
    #     print('findthisown',request)
    #     # route_short_name= self.request['route_short_name']
    #     # headSign= self.request.GET['headSign']
    #     return RouteStops.objects.filter(route_short_name='1')  
    
    def get_queryset(self):
        route_short_name = self.kwargs['route_short_name']
        trip_headsign = self.kwargs['trip_headsign']
        # short_name = self.kwargs.get('short_name')
        # headsign = self.kwargs.get('headsign')
        # queryset = StopTimesUpdated.objects.all()
        # print('hello',self.kwargs)
        return RouteStops.objects.filter(route_short_name=route_short_name, trip_headsign=trip_headsign)   

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
