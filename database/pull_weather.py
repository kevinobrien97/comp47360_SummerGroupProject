#!/usr/bin/env python3
#requests must be pip installed
import connect_db
import math
import requests
import time
from datetime import datetime, timedelta
import os

api = os.environ['API']
accuapi = os.environ['ACCUAPI']
def pull_weather(api, accuapi):
    accu_weather = f"http://dataservice.accuweather.com/currentconditions/v1/207931?apikey={accuapi}"
    open_weather = f"http://api.openweathermap.org/data/2.5/weather?lat=53.33306&lon=-6.24889&appid={api}&units=metric"

    curr_temp = requests.get(open_weather).json()
    curr_conditions = requests.get(accu_weather).json() 

    temperature = math.floor(curr_temp['main']['temp'])
    feels_like = math.floor(curr_temp['main']['feels_like'])
    time_stamp = datetime.now() + timedelta(hours=1)
    weather_icon = curr_temp['weather'][0]['icon']
    return {
    'weather_icon': weather_icon,
    'temperature': temperature,
    'feels_like': feels_like,
    'time_stamp': time_stamp
    } 

con = connect_db
con.create_weather_table()
while True:
    weather = pull_weather(api, accuapi)
    start = time.time()
    con.insert_weather(weather)
    time.sleep(3600 - (time.time() - start) % 3600)

