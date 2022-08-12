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

#api = os.environ['API']
api = 'should be check sys environ'
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

# encode time
def encode_time(month,weekday,hour):
    month_sin = sin(2 * pi * month/12.0)
    month_cos = cos(2 * pi * month/12.0)
    weekday_sin = sin(2 * pi * weekday/6.0)
    weekday_cos = cos(2 * pi * weekday/6.0)
    hour_sin = sin(2 * pi * hour/23.0)
    hour_cos = cos(2 * pi * hour/23.0)
    return [month_sin,month_cos,weekday_sin,weekday_cos,hour_sin,hour_cos]

# transfer weather type str to 0/1
def encode_weather(weather_type):
    if (weather_type == "Rain" or weather_type == "Mist" or weather_type == "Thunderstorm"):
        weather_type = 1
    else:
        weather_type = 0
    return weather_type

# our journey time was divided by 60, should be abandoned to new model
def planned_journey(deparature,arrival):
    planned_time = (arrival - deparature)/60
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


with open('forecast.json','r',encoding='utf-8') as f:
    forecast = json.load(f)
    futureweather = {}
    for i in forecast['list']:
        futureweather[i['dt']] = i['main']['temp']
    test = 1658265200
    res_key, res_val = min(futureweather.items(), key=lambda x: abs(test - x[0]))
    # print(futureweather.items)
    # print(res_key)
    # print(res_val)
    # print(futureweather)



# read data
month,weekday,hour,ts = current_time()
month_sin,month_cos,weekday_sin,weekday_cos,hour_sin,hour_cos = encode_time(month,weekday,hour)
temp,weather_main = future_weather(api,ts)
#print(type(weather_main))
weather_main = encode_weather(weather_main)
#print(type(weather_main))
planned_journey_time = planned_journey(departure_seconds,arrival_seconds)

# open pickle
# use a fixed pickle to test, need be changed
f = open('75_1.pickle', 'rb')
model = pickle.load(f)

data = {
        'temp':  temp,
        'weather_main': weather_main,
        'planned_journey_time':planned_journey_time,
        'week_sin': weekday_sin,     
        'week_cos': weekday_cos,         
        'hour_sin':  hour_sin,    
        'hour_cos':  hour_cos,
        'month_sin': month_sin,    
        'month_cos': month_cos      
       }
print(data)
df = pd.DataFrame([data])
# print(model)
# print(df)
prediction = model.predict(df)
print('Predicted journey time is: ', prediction)