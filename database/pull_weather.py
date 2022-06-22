#requests must be pip installed
import connect_db
import math
import requests 
import time
import os


dublin_long = "-6.2603"
dublin_lat = "53.3498"  
key = os.environ['WEATHERAPI']


def pull_weather(api_key, dublin_long, dublin_lat): 
    open_weather = f"http://api.openweathermap.org/data/2.5/weather?lat={dublin_lat}&lon={dublin_long}&appid={key}&units=metric"

    data = requests.get(open_weather).json()  

    temperature = math.floor(data['main']['temperature'])
    feels_like = math.floor(data['main']['feels_like']) 

    return {
    'temperature': temperature,
    'feels_like': feels_like
    } 

con = connect_db
con.create_weather_table()
while True:
    weather = pull_weather(key, dublin_lat, dublin_long) 
    start = time.time()
    time.sleep(3600 - ((time.time() - start) % 3600))

    con.insert_weather(weather)
