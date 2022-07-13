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
router.register(r'routes', views.RoutesView, 'dubbus')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('weather/', include(router.urls)),
    path('routes/', include(router.urls)),
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='auth_register'),
    #path('', views.getRoutes),
    path('test/', views.testEndPoint, name='test'),
    url(r'^api/v1/', include('djoser.urls')),
    url(r'^api/v1/', include('djoser.urls.authtoken')),  
]

urlpatterns += router.urls