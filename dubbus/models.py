from django.db import models

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