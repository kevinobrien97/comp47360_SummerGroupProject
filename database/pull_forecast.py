#!/usr/bin/env python3
#requests must be pip installed
import math
import requests
import time
from sqlalchemy import create_engine
import os
SQLPW = os.environ['SQLPW']
api = os.environ['API']
engine = create_engine("mysql+mysqlconnector://shuttleup:" + SQLPW + "@dubbusv2.cimqwuwj7cb7.us-east-1.rds.amazonaws.com:3306/dublin_bus")
connection = engine.connect()
while True: 
    open_weather = f"http://api.openweathermap.org/data/2.5/forecast?lat=53.33306&lon=6.24889&appid={api}"
    data = requests.get(open_weather).json()

    create_table = f"CREATE TABLE IF NOT EXISTS forecast (temperature INTEGER, description VARCHAR(80), description_code INTEGER, wind_speed FLOAT(5), conditions VARCHAR(80), date_time DATETIME)"
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
        'temperature': math.floor(i['main']['temp']),
        'description': i['weather'][0]['description'],
        'description_code':i['weather'][0]['id'],
        'wind_speed': i['wind']['speed'],
        'conditions': i['weather'][0]['main'],
        'date_time': i['dt_txt'] 
        }
        sql = f"INSERT INTO forecast values('{field['temperature']}','{field['description']}','{field['description_code']} ',' {field['wind_speed']}','{field['conditions']} ',' {field['date_time']}')"
        try:
            print(connection.execute(sql).fetchall())
        except Exception as error:
            print(error)

    start = time.time()
    time.sleep(3600 - (time.time() - start) % 3600)

    empty_table="truncate table forecast"
    try: 
        print(connection.execute(empty_table).fetchall())
    except Exception as error: 
        print(error)

       
