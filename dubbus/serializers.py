from rest_framework import serializers
from .models import Stops, Weather

class StopsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stops
        fields = ('stop_id', 'stop_name', 'stop_lat', 'stop_long')

class WeatherSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Weather 
        fields = ('temperature', 'feels_like', 'timestamp')