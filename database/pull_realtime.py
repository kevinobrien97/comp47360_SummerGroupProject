import connect_db
import math
import requests
import time
from datetime import datetime, timedelta
import os

apireal = os.environ['APIREAL']

connect_db.create_weather_table()
while True:
    def pull_weather(api):
        open_weather = f"http://api.openweathermap.org/data/2.5/weather?lat=53.33306&lon=-6.24889&appid={api}&units=metric"
        data = requests.get(open_weather).json()  
        time_stamp = datetime.now() + timedelta(hours=1)
        
        return {
        'temperature': math.floor(data['main']['temp']),
        'feels_like': math.floor(data['main']['feels_like']),
        'time_stamp': time_stamp
        } 

    weather = pull_weather(apireal)
    start = time.time()
    connect_db.insert_weather(weather)
    time.sleep(3600 - (time.time() - start) % 3600)