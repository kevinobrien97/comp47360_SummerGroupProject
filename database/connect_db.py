#!/usr/bin/env python3
from sqlalchemy import create_engine
import json
import os
SQLPW = os.environ['SQLPW']

engine = create_engine("mysql+mysqlconnector://shuttleup:" + SQLPW + "@dubbusv2.cimqwuwj7cb7.us-east-1.rds.amazonaws.com:3306/dublin_bus")

connection = engine.connect()

def create_weather_table():
    create_table = f"CREATE TABLE IF NOT EXISTS weather (temperature INTEGER, feels_like INTEGER, time_stamp DATETIME, weather_icon VARCHAR(5))"
    try:
        print(connection.execute(create_table).fetchall())
    except Exception as error:
        print(error)

def insert_weather(value: dict):
    empty_table="truncate table weather"
    try: 
        print(connection.execute(empty_table).fetchall())
    except Exception as error: 
        print(error)
    sql = f"INSERT INTO weather values('{value['temperature']}','{value['feels_like']}','{value['time_stamp']}','{value['weather_icon']}')"
    try:
        print(connection.execute(sql).fetchall())
    except Exception as error:
        print(error)
        
def select_forecast():
    get_table = f"SELECT * FROM forecast"
    f_list = []

    with open('dubbus/models/forecast.json', 'w') as f:
        data = connection.execute(get_table).fetchall()
        try:
            print(data)
        except Exception as error:
            print(error)
        for i in data: 
            f_list.append({"description_code": i[0], "conditions": i[1], "weather_type": i[2], "date_time":i[3]})
        test = json.dump(f_list, f)
    print(test)

    return (test)


#testData = "INSERT INTO test_table (test_col) VALUES (123)"
#connection.execute(testData)
#print('Success')

#connection.close()
