from .serializers import StopsSerializer, WeatherSerializer, TokenObtainPairSerializer, RegisterSerializer, FavouriteStopsSerializer, RoutesUpdatedSerializer, FavouriteRoutesSerializer, StopTimesUpdatedSerializer, RouteStopsSerializer
from rest_framework import viewsets, status, generics  
from .models import Stops, Weather, FavouriteStops, RoutesUpdated, FavouriteRoutes, StopTimesUpdated, RouteStops, Forecast
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from django.db.models import Q
from functools import reduce
import operator
from .prediction import *
from django.http import JsonResponse
from rest_framework.views import APIView
from datetime import datetime, timedelta
from django.core import serializers

class StopsView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = StopsSerializer
    queryset = Stops.objects.all()
    http_method_names = ['get']

class WeatherView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = WeatherSerializer
    queryset = Weather.objects.all()
    http_method_names = ['get']

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
    http_method_names = ['get']

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
    http_method_names = ['get']   

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
    http_method_names = ['get']   

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
    queryset = RouteStops.objects.all()
    http_method_names = ['get']
    # RouteStops.objects.get(route_short_name='1')
    
    # def get_queryset(request):
    #     print('findthisown',request)
    #     # route_short_name= self.request['route_short_name']
    #     # headSign= self.request.GET['headSign']
    #     return RouteStops.objects.filter(route_short_name='1')  
    
    # def get_queryset(self):
    #     route_short_name = self.kwargs['route_short_name']
    #     trip_headsign = self.kwargs['trip_headsign']
    #     # short_name = self.kwargs.get('short_name')
    #     # headsign = self.kwargs.get('headsign')
    #     # queryset = StopTimesUpdated.objects.all()
    #     # print('hello',self.kwargs)
    #     return RouteStops.objects.filter(route_short_name=route_short_name, trip_headsign=trip_headsign)


    # to call the prediction
class StopPredictionView(APIView):
    permission_classes = (AllowAny,) 
    http_method_names = ['get']
    def get(self, request):
        route_id = request.query_params.get('route_id')
        headsign = request.query_params.get('headsign')
        start_stop = request.query_params.get('start_stop')
        end_stop = request.query_params.get('end_stop')
        total_stops = request.query_params.get('total_stops')
        timestamp = request.query_params.get('timestamp')
        forecast_queryset = Forecast.objects.all()
        forecast_json = serializers.serialize('json', forecast_queryset)
        weather = encode_weather(forecast_json, int(timestamp)/1000)
        time_real = datetime.fromtimestamp((int(timestamp)/1000))
        time_real_timezone = time_real + timedelta(hours=1)
        # returns new timestamp with the hour rounded to nearest hour
        rounded_hour = time_real_timezone.replace(second=0, microsecond=0, minute=0, hour=time_real_timezone.hour) + timedelta(hours=time_real_timezone.minute//30)
        month = time_real_timezone.month
        hour = rounded_hour.hour
        day = time_real_timezone.weekday()
        rush_hour = encode_rush_hour(hour)
        frisat = encode_frisat(day)
        late_night = encode_late_night(hour)
        midday = encode_midday(hour)
        midweek = encode_midweek(day)
        summer = encode_summer(month)
        winter = encode_winter(month)
        morning = encode_morning(hour)

        direction_id = get_direction_id(headsign)
        # if we could not find the direction
        if direction_id == -1:
            # model could be either direction 1 or 2, add both to list and loop through
            potential_models = [route_id + '_1', route_id + '_2']
            for potential in potential_models:
                # in this instance we have to find both the starting and ending stop
                start_progr = get_progress_number(potential, start_stop)
                end_progr = get_progress_number(potential, end_stop)
                print('start_stop',start_stop)
                print(potential)
                print('end_stop',end_stop)
                # if either is invalid
                if start_progr == -1 or end_progr == -1:
                    prediction = "None"
                # ending has to be > beginning
                elif int(start_progr) >= int(end_progr):
                    prediction = "None"
                else:
                    prediction = get_prediction(potential, start_progr, end_progr, weather, rush_hour, late_night, midweek, summer, winter, midday, frisat, morning)
                    # jump out of for loop so prediction isnt reevaluated
                    return JsonResponse({'result':prediction})
            return JsonResponse({'result':prediction})

        else:
            model_name = route_id + '_' + direction_id
            # print('mod',model_name)
            # want to check if we can get either of the progress numbers from the starting or ending stops
            # can use the number of stops to calculate the other
            # if neither are found use google maps prediction as route has changed too much since 2018

            start_progr = get_progress_number(model_name, start_stop)
            if start_progr != -1:
                end_progr = str(int(start_progr)+int(total_stops))
                # print('ifendprog', end_progr)
                prediction = get_prediction(model_name, start_progr, end_progr, weather, rush_hour, late_night, midweek, summer, winter, midday, frisat, morning)
                # print('ifpred', prediction)
            else:
                end_progr = get_progress_number(model_name, end_stop)
                if end_progr != -1:
                    start_progr = str(int(end_progr)-int(total_stops))
                    # print('elsestartprog', start_progr)
                    prediction = get_prediction(model_name, start_progr, end_progr, weather, rush_hour, late_night, midweek, summer, winter, midday, frisat, morning)
                    # print('elsepred', prediction)
                else:
                    prediction = "None"
            return JsonResponse({'result':prediction})