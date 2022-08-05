from rest_framework import serializers
from .models import Stops, Weather, FavouriteStops, RoutesUpdated, FavouriteRoutes, StopTimesUpdated, RouteStops
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class StopsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stops
        fields = ('stop_id', 'stop_name', 'stop_lat', 'stop_long')

class WeatherSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Weather 
        fields = ('temperature', 'feels_like', 'time_stamp', 'weather_icon')

class TokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2')

    def validate(self, attributes):
        if attributes['password'] != attributes['password2']:
            raise serializers.ValidationError(
                {"password": "Both passwords did not match."})

        return attributes

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

class FavouriteStopsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FavouriteStops
        read_only_fields = (
            "id",
            "created_at",
            "created_by",
        )
        fields = (
            "id",
            "created_at",
            "created_by",
            "stop_id"
        )

class RoutesUpdatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutesUpdated
        fields = ('trip_headsign', 'route_short_name')

class FavouriteRoutesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FavouriteRoutes
        read_only_fields = (
            "id",
            "created_at",
            "created_by",
        )
        fields = (
            "id",
            "created_at",
            "created_by",
            "trip_headsign",
            "route_short_name",
        )

class StopTimesUpdatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StopTimesUpdated
        # using '__all__' instead of listing each
        fields = '__all__'

class RouteStopsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStops
        # using '__all__' instead of listing each
        fields = '__all__'