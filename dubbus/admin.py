from django.contrib import admin
from .models import FavouriteStops, FavouriteRoutes

# Register your models here.
class FavouriteStopsAdmin(admin.ModelAdmin):
    list = (
            "id",
            "created_at",
            "created_by",
            "stop_id"
        )

admin.site.register(FavouriteStops, FavouriteStopsAdmin)

class FavouriteRoutesAdmin(admin.ModelAdmin): 
    list=("id",
            "created_at",
            "created_by",
            "trip_headsign",
            "route_short_name",)

admin.site.register(FavouriteRoutes, FavouriteStopsAdmin)
