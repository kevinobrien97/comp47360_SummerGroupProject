#!/usr/bin/env python3
from sqlalchemy import create_engine
import os
SQLPW = os.environ['SQLPW']

connection = engine.connect()

def create_weather_table():
    create_table = f"CREATE TABLE IF NOT EXISTS weather (temperature INTEGER, feels_like INTEGER, time_stamp DATETIME, weather_text VARCHAR(50))"
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
    sql = f"INSERT INTO weather values('{value['temperature']}','{value['feels_like']}','{value['time_stamp']}','{value['weather_text']}')"
    try:
        print(connection.execute(sql).fetchall())
    except Exception as error:
        print(error)

#testData = "INSERT INTO test_table (test_col) VALUES (123)"
#connection.execute(testData)
#print('Success')

#connection.close()
