import datetime
from math import sin,cos,pi
import requests
import os
import json
import pickle
import pandas as pd
import sklearn
# get current time
def current_time():
    # current time:- 2022-07-20 03:07:48.055880
    ct = datetime.datetime.now()
    weekday = ct.weekday()
    month = ct.month
    hour = ct.hour
    # timestamp:- 1658282868.05588
    ts = ct.timestamp()
    return (month,weekday,hour,ts)

api = os.environ['API']
#api = 'use an api key to test'
#accuapi = os.environ['ACCUAPI']
def future_weather(api, timestamp):
    #accu_weather = f"http://dataservice.accuweather.com/forecasts/v1/daily/5day/207931?apikey={accuapi}"
    open_weather = f"http://api.openweathermap.org/data/2.5/forecast?lat=53.33306&lon=-6.24889&appid={api}&units=metric"
    forecast_temp = requests.get(open_weather).json()
    #forecast_conditions = requests.get(accu_weather).json() 
    # store all predicted 5 days temperature in a dict: futureweather
    futuretemp = {}
    for i in forecast_temp['list']:
        futuretemp[i['dt']] = i['main']['temp']
    # match with the closest timestamp, time_key is time and temp_val is returned temperature
    time_key, temp_val = min(futuretemp.items(), key=lambda x: abs(timestamp - x[0]))

    futureweather = {}
    for j in forecast_temp['list']:
        futureweather[j['dt']] = j['weather'][0]['main']
    weather_key, weather_val = min(futureweather.items(), key=lambda x: abs(timestamp - x[0]))
    return [temp_val,weather_val]


# encode time in dummy way
def encode_month(month):
    month_dummy = [0,0,0,0,0,0,0,0,0,0,0,0]
    month_dummy[month-1] = 1
    return month_dummy

def encode_weekday(weekday):
    weekday_dummy = [0,0,0,0,0,0,0]
    weekday_dummy[weekday] = 1
    return weekday_dummy

def encode_hour(hour):
    # the datetime.now range from 0-23 but our model is from 4-24 means interval
    # 0 means the first interval, 3 means the forth interval
    hour_dummy = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    hour_dummy[hour] = 1
    return hour_dummy


def encode_rush_hour(hour):
    if 7<=hour<=0 or 17<=hour<=19:
        rush_hour = 1
    else:
        rush_hour = 0
    return rush_hour

# transfer weather type str to 0/1
def encode_weather(weather_type):
    if (weather_type == "Rain" or weather_type == "Mist" or weather_type == "Thunderstorm"):
        weather_type = 1
    else:
        weather_type = 0
    return weather_type

# our journey time was divided by 60, should be abandoned to new model
def planned_journey(deparature,arrival):
    planned_time = (arrival - deparature)
    return planned_time

# read json

with open('Google.json','r',encoding='utf-8') as f:
    gtfs = json.load(f)
    # print(type(realtimegtfs))  # Output: dict
    # print(realtimegtfs.keys())
    lineid = gtfs['routes'][0]['legs'][0]['steps'][1]['transit_details']['line']['short_name']
    #print(lineid)
    departure_seconds =  gtfs['routes'][0]['legs'][0]['steps'][1]['transit_details']['departure_time']['value']
    #print(departure_seconds)
    arrival_seconds = gtfs['routes'][0]['legs'][0]['steps'][1]['transit_details']['arrival_time']['value']
    #print(arrival_seconds)
    # here should also be passed the date in yymmdd


# read data
month,weekday,hour,ts = current_time()
month_dummy = encode_month(month)
weekday_dummy = encode_weekday(weekday)
hour_dummy = encode_hour(hour)
rush_hour = encode_rush_hour(hour)
temp,weather_main = future_weather(api,ts)
weather_main = encode_weather(weather_main)
planned_journey_time = planned_journey(departure_seconds,arrival_seconds)


# open pickle
# use a fixed pickle to test, need be changed
f = open('39A_1.pickle', 'rb')
model = pickle.load(f)


data = {
        'temp':  temp,
        'weather_main': weather_main,
'rush_hour': rush_hour,  
'HOUR_DEPARTURE_4': hour_dummy[3],   
'HOUR_DEPARTURE_5': hour_dummy[4],
'HOUR_DEPARTURE_6':hour_dummy[5],
'HOUR_DEPARTURE_7':hour_dummy[6],
'HOUR_DEPARTURE_8':hour_dummy[7],
'HOUR_DEPARTURE_9':hour_dummy[8],
'HOUR_DEPARTURE_10':hour_dummy[9],
'HOUR_DEPARTURE_11':hour_dummy[10], 
'HOUR_DEPARTURE_12':hour_dummy[11],  
'HOUR_DEPARTURE_13':hour_dummy[12],  
'HOUR_DEPARTURE_14':hour_dummy[13], 
'HOUR_DEPARTURE_15':hour_dummy[14],   
'HOUR_DEPARTURE_16':hour_dummy[15], 
'HOUR_DEPARTURE_17':hour_dummy[16], 
'HOUR_DEPARTURE_18':hour_dummy[17],  
'HOUR_DEPARTURE_19':hour_dummy[18],   
'HOUR_DEPARTURE_20':hour_dummy[19],  
'HOUR_DEPARTURE_21':hour_dummy[20],  
'HOUR_DEPARTURE_22':hour_dummy[21], 
'HOUR_DEPARTURE_23':hour_dummy[22], 
'HOUR_DEPARTURE_24':hour_dummy[0],   
'DAYOFWEEK_0':weekday_dummy[0],  
'DAYOFWEEK_1':weekday_dummy[1],  
'DAYOFWEEK_2':weekday_dummy[2], 
'DAYOFWEEK_3':weekday_dummy[3], 
'DAYOFWEEK_4':weekday_dummy[4], 
'DAYOFWEEK_5':weekday_dummy[5],  
'DAYOFWEEK_6':weekday_dummy[6], 
'MONTH_1':month_dummy[0],  
'MONTH_2':month_dummy[1],  
'MONTH_3':month_dummy[2],  
'MONTH_4':month_dummy[3], 
'MONTH_5':month_dummy[4],
'MONTH_6':month_dummy[5], 
'MONTH_7':month_dummy[6], 
'MONTH_8':month_dummy[7],  
'MONTH_9':month_dummy[8], 
'MONTH_10':month_dummy[9], 
'MONTH_11':month_dummy[10],
'MONTH_12':month_dummy[11],
       }

df = pd.DataFrame([data])
# print(model)
# print(df)
prediction = model.predict(df)
print('Predicted journey time is: ', prediction)