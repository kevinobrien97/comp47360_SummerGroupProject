#!/usr/bin/env python3
#requests must be pip installed
import math
import requests
import time
from sqlalchemy import create_engine
import os
SQLPW = os.environ['SQLPW']
api = os.environ['API']
engine = create_engine("mysql+mysqlconnector://shuttleup:" + SQLPW + "@dubbus.cimqwuwj7cb7.us-east-1.rds.amazonaws.com:3306/dublin_bus")
connection = engine.connect()
while True: 
    open_weather = f"http://api.openweathermap.org/data/2.5/forecast?lat=53.33306&lon=6.24889&appid={api}"
    data = requests.get(open_weather).json()

    create_table = f"CREATE TABLE IF NOT EXISTS forecast (description_code VARCHAR(10), conditions VARCHAR(80), weather_type VARCHAR(2), date_time VARCHAR(50))"
    try:
        print(connection.execute(create_table).fetchall())
    except Exception as error:
        print(error)

    empty_table="truncate table forecast"
    try: 
        print(connection.execute(empty_table).fetchall())
    except Exception as error: 
        print(error)

    
    for i in data['list']:
        field ={
        'description_code':i['weather'][0]['id'],
        'conditions': i['weather'][0]['main'],
        'date_time': i['dt'] 
        }

        #print(weather_val)
        if (field['conditions'] == "Rain" or field['conditions']== "Mist" or field['conditions'] == "Thunderstorm"): 
            weather_val = { 
                "weather_type": 1
                }
        else:
            weather_val = {
                "weather_type": 0
            }
        sql = f"INSERT INTO forecast values('{field['description_code']} ',' {field['conditions']} ',' {weather_val['weather_type']}',' {field['date_time']}')"
        try:
            print(connection.execute(sql).fetchall())
        except Exception as error:
            print(error)

    start = time.time()
    time.sleep(3600 - (time.time() - start) % 3600)

       
