"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.urls import re_path as url
from rest_framework import routers
from dubbus import views 
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = routers.DefaultRouter()                   
router.register(r'stops', views.StopsView, 'dubbus')  
router.register(r'weather', views.WeatherView, 'dubbus')
router.register(r'favourites', views.FavouritesView, 'dubbus')
router.register(r'routes', views.RoutesUpdatedView, 'dubbus')
router.register(r'favouriteroutes', views.FavouriteRoutesView, 'dubbus')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('weather/', include(router.urls)),
    path('api/routes/', include(router.urls)),
    path('api/favouriteroutes/', include(router.urls)),
    path('api/fullroutestoptimes/<str:route_short_name>/<str:trip_headsign>/<str:day>/', views.FullRouteStopTimesUpdatedView.as_view() ),
    path('api/routestops/', views.RouteStopsView.as_view() ),
    path('api/stoptimes/<str:stop_id>/<str:day>/', views.StopTimesUpdatedView.as_view() ),
    path('api/token/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='auth_register'),
    path('api/favourites/', include(router.urls)),
    path('api/getPrediction/', views.StopPredictionView.as_view(),name='get_prediction_info')
]

urlpatterns += router.urls
