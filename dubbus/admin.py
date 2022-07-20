from django.contrib import admin
# test model
from .models import Stops, Weather, Routes

# Register your models here.
class StopsAdmin(admin.ModelAdmin):
    list = ('stop_id', 'stop_name', 'stop_lat', 'stop_long')

admin.site.register(Stops, StopsAdmin)

class WeatherAdmin(admin.ModelAdmin): 
    list=('temperature', 'feels_like', 'timestamp', 'weather_icon')

admin.site.register(Weather, WeatherAdmin)

class RoutesAdmin(admin.ModelAdmin): 
    list=('route_id', 'agency_id', 'route_short_name', 'route_long_name', 'route_type' )

admin.site.register(Routes, RoutesAdmin)