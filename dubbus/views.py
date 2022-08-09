from .serializers import StopsSerializer, WeatherSerializer, TokenObtainPairSerializer, RegisterSerializer, FavouriteStopsSerializer, RoutesUpdatedSerializer, FavouriteRoutesSerializer, StopTimesUpdatedSerializer, RouteStopsSerializer
from rest_framework import viewsets, status, generics  
from .models import Stops, Weather, FavouriteStops, RoutesUpdated, FavouriteRoutes, StopTimesUpdated, RouteStops
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
    http_method_names = ['get']
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


    # to call the prediction
api = os.environ['API']
class StopPredictionView(APIView):
    permission_classes = (AllowAny,) 
    http_method_names = ['get']
    def get(self, request):
        route_id = request.query_params.get('route_id')
        print('r1',route_id)
        route_id = route_id.upper()
        print('r1',route_id)
        headsign = request.query_params.get('headsign')
        print('r1',headsign)
        start_stop = request.query_params.get('start_stop')
        print('r1',start_stop)
        end_stop = request.query_params.get('end_stop')
        print('r1',end_stop)
        total_stops = request.query_params.get('total_stops')
        print('r1',total_stops)
        timestamp = request.query_params.get('timestamp')
        print('r1',timestamp)

        return JsonResponse({'result':"prediction"})
        # month = request.query_params.get('month')
        # print('r1',month)
        # weekday = request.query_params.get('weekday')
        # print('r1',weekday)
        # hour = request.query_params.get('hour')
        # print('r1',hour)
        # # map direction through headsign
        # direction = get_direction_id(headsign)
        # # map programnum through routeid and direction
        # start_num = get_progress_number(route_id,start_stop)
        # end_num = get_progress_number(route_id,end_stop)
        # # open pickle through routeid and direction, assume to store the pickles in model folder
        # modelName = route_id + '_' + direction + '.pickle'
        # f = open(modelName, 'rb')
        # model = pickle.load(f)
        # weather_main = future_weather(api,timestamp)
        # rush_hour = encode_rush_hour(hour)
        # frisat = encode_frisat(weekday)
        # late_night = encode_late_night(hour)
        # midday = encode_midday(hour)
        # midweek = encode_midweek(weekday)
        # summer = encode_summer(month)
        # winter = encode_winter(month)
        # morning = encode_morning(hour)
        # prediction = get_prediction(model,start_num,end_num,weather_main,rush_hour,late_night,midweek,summer,winter,midday,frisat,morning)
        # return JsonResponse({'result':prediction})