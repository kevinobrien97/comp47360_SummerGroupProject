from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
# test class
class Stops(models.Model):
    stop_id = models.CharField(primary_key=True, max_length=30)
    stop_name = models.CharField(max_length=255, blank=True, null=True)
    stop_lat = models.FloatField(blank=True, null=True)
    stop_long = models.FloatField(blank=True, null=True)

    class Meta:
        # keep false so Django doesnt change our tables (django specific tables should be True)
        db_table = 'stops'

class Weather(models.Model):
    temperature = models.IntegerField(blank=True, null=True)
    feels_like = models.IntegerField(blank=True, null=True)
    time_stamp = models.DateTimeField(primary_key=True)
    weather_icon = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        db_table = 'weather'

# class Routes(models.Model):
#     route_id = models.CharField(primary_key=True, max_length=30)
#     agency_id = models.CharField(max_length=30, blank=True, null=True)
#     route_short_name = models.CharField(max_length=30, blank=True, null=True)
#     route_long_name = models.CharField(max_length=255, blank=True, null=True)
#     route_type = models.IntegerField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'routes'

class FavouriteStops(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    # delete for user if the user is deleted
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    stop_id = models.CharField(max_length=300)

    class Meta:
        db_table = 'favouritestops'

class RoutesUpdated(models.Model):
    trip_headsign = models.CharField(primary_key=True, max_length=255)
    route_short_name = models.CharField(max_length=30)

    class Meta:
        db_table = 'routes_updated'
        unique_together = (('trip_headsign', 'route_short_name'),)

class FavouriteRoutes(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    # delete for user if the user is deleted
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    trip_headsign = models.CharField(max_length=300)
    route_short_name = models.CharField(max_length=300)

    class Meta:
        db_table = 'favouriteroutes'

class StopTimesUpdated(models.Model):
    trip_id = models.CharField(max_length=255)
    departure_time = models.CharField(max_length=30)
    stop_id = models.CharField(primary_key=True, max_length=255)
    stop_sequence = models.IntegerField(blank=True, null=True)
    stop_headsign = models.CharField(max_length=255, blank=True, null=True)
    route_id = models.CharField(max_length=30, blank=True, null=True)
    service_id = models.CharField(max_length=30, blank=True, null=True)
    trip_headsign = models.CharField(max_length=255, blank=True, null=True)
    route_short_name = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        db_table = 'stop_times_updated'
        unique_together = (('stop_id', 'trip_id'),)

class RouteStops(models.Model):
    stop_id = models.CharField(max_length=255)
    trip_headsign = models.CharField(max_length=255)
    route_short_name = models.CharField(primary_key=True, max_length=30)
    stop_name = models.CharField(max_length=255, blank=True, null=True)
    stop_lat = models.FloatField(blank=True, null=True)
    stop_long = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'route_stops'
        unique_together = (('route_short_name', 'trip_headsign', 'stop_id'),)

class Forecast(models.Model):
    description_code = models.CharField(max_length=10, blank=True, null=True)
    conditions = models.CharField(max_length=80, blank=True, null=True)
    weather_type = models.CharField(max_length=2, blank=True, null=True)
    date_time = models.CharField(primary_key=True, max_length=50)

    class Meta:
        db_table = 'forecast'