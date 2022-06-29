from django.shortcuts import render, redirect
from .serializers import StopsSerializer 
from rest_framework import viewsets      
from .models import Stops     
from django.contrib.auth.models import User, auth
from django.contrib import messages

# Create your views here.
class StopsView(viewsets.ModelViewSet):  
    serializer_class = StopsSerializer   
    queryset = Stops.objects.all()     


# def login(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         password = request.POST['password']
#         user = auth.authenticate(username=username, password=password)
#         if user is not None:
#             auth.login(request, user)
#             return redirect('/')
#         else:
#             messages.info(request, 'Credentials invalid')
#             return redirect('/')
#     else:
#         return render(request, '/')

# def logout(request):
#     auth.logout(request)
#     return redirect('/')