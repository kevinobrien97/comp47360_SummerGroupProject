#!/usr/bin/python
#requests must be pip installed
import connect_db
import math
import requests
import time
import datetime
import os

key = os.environ['WEATHERAPI']

def pull_weather(key):
    open_weather = f"http://api.openweathermap.org/data/2.5/weather?lat=53.33306&lon=-6.24889&appid={key}&units=metric"

    data = requests.get(open_weather).json()  

    temperature = math.floor(data['main']['temp'])
    feels_like = math.floor(data['main']['feels_like'])
    time_stamp = datetime.datetime.now()
    return {
    'temperature': temperature,
    'feels_like': feels_like,
    'time_stamp': time_stamp
    } 

con = connect_db
con.create_weather_table()
while True:
    weather = pull_weather(key)
    start = time.time()
    time.sleep(3600 - ((time.time() - start) % 3600))

    con.insert_weather(weather)