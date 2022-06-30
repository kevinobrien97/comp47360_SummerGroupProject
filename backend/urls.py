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
from django.conf.urls import url

from rest_framework import routers
from dubbus import views 

# django.conf.urls.url() was deprecated in Django 3.0, and is removed in Django 4.0+.
# The easiest fix is to replace url() with re_path(). 
router = routers.DefaultRouter()                   
router.register(r'stops', views.StopsView, 'dubbus')  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    url(r'^api/v1/', include('djoser.urls')),
    url(r'^api/v1/', include('djoser.urls.authtoken')),  
]
