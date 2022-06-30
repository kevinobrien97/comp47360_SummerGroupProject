from django.contrib import admin
# test model
from .models import Stops, Weather

# Register your models here.
class StopsAdmin(admin.ModelAdmin):
    list = ('stop_id', 'stop_name', 'stop_lat', 'stop_long')

admin.site.register(Stops, StopsAdmin)

class WeatherAdmin(admin.ModelAdmin): 
    list=('temperature', 'feels_like', 'timestamp')

admin.site.register(Weather, WeatherAdmin)