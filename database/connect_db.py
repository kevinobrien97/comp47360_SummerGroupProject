#!/usr/bin/env python3
from sqlalchemy import create_engine
import os
SQLPW = os.environ['SQLPW']

engine = create_engine("mysql+mysqlconnector://shuttleup:" + SQLPW + "@shupdublinbus.cimqwuwj7cb7.us-east-1.rds.amazonaws.com:3306/dublin_bus")

connection = engine.connect()

def create_weather_table():
    create_table = f"CREATE TABLE IF NOT EXISTS weather (temperature INTEGER, feels_like INTEGER, time_stamp DATETIME)"
    try:
        print(connection.execute(create_table).fetchall())
    except Exception as error:
        print(error)

def insert_weather(value: dict):
    sql = f"INSERT INTO weather values('{value['temperature']}','{value['feels_like']}','{value['time_stamp']}')"
    try:
        print(connection.execute(sql).fetchall())
    except Exception as error:
        print(error)

#testData = "INSERT INTO test_table (test_col) VALUES (123)"
#connection.execute(testData)
#print('Success')


#connection.close()