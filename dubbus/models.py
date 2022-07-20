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
        managed = False
        db_table = 'stops'

class Weather(models.Model):
    temperature = models.IntegerField()
    feels_like = models.IntegerField()
    time_stamp = models.DateTimeField(primary_key=True, unique=True)
    weather_icon = models.IntegerField()

    class Meta: 
        managed = False
        db_table = 'weather'

class Routes(models.Model):
    route_id = models.CharField(primary_key=True, max_length=30)
    agency_id = models.CharField(max_length=30, blank=True, null=True)
    route_short_name = models.CharField(max_length=30, blank=True, null=True)
    route_long_name = models.CharField(max_length=255, blank=True, null=True)
    route_type = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'routes'

class FavouriteStops(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    # delete for user if the user is deleted
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    stop_id = models.CharField(max_length=300)

    class Meta:
        managed = True
        db_table = 'favouritestops'



