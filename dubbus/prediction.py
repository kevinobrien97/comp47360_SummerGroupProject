import datetime
from math import sin,cos,pi
from re import S
import requests
import os
import json
import pickle
import pandas as pd
# import sklearn
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
def future_weather(api, timestamp):
    open_weather = f"http://api.openweathermap.org/data/2.5/forecast?lat=53.33306&lon=-6.24889&appid={api}&units=metric"
    r = requests.get(open_weather)
    # if the request of weather api success, or set default as cloudy
    if r.status_code == requests.codes.ok:
        forecast_temp = r.json()
        # store all predicted 5 days weather type in a dict: futureweather
        futureweather = {}
        for j in forecast_temp['list']:
            futureweather[j['dt']] = j['weather'][0]['main']
        # match with the closest timestamp, weather_key is time and weather_val is returned weather type
        weather_key, weather_val = min(futureweather.items(), key=lambda x: abs(timestamp - x[0]))
        #print(weather_val)
        if (weather_val == "Rain" or weather_val == "Mist" or weather_val == "Thunderstorm"): 
            weather_type = 1
        else:
            weather_type = 0
        return weather_type
    else:
        return 0


# transfer weather type str to 0/1
def encode_weather(weather_type):
    if (weather_type == "Rain" or weather_type == "Mist" or weather_type == "Thunderstorm"):
        weather_type = 1
    else:
        weather_type = 0
    return weather_type

def encode_rush_hour(hour):
    if hour in [7,8,9,16,17,18,19]:
        rush_hour = 1
    else:
        rush_hour = 0
    return rush_hour

# Friday and Saturdays grouped together because both are popular for socialising
def encode_frisat(weekday):
    if weekday in [4, 5]:
        frisat = 1
    else:
        frisat = 0
    return frisat

# Late nights are between 8pm and midnight. After midnight is seperate because many buses don't run then so it would be wrong to group.
def encode_late_night(hour):
    night = [20, 21, 22, 23, 0]
    if hour in night:
        late_night = 1
    else:
        late_night = 0
    return late_night

# Midday is between 10am and 3pm. By adding this feature it also distinguishes the very early hours of the morning by having a zero for all time columns.
def encode_midday(hour):
    midday_hour = [10, 11, 12, 13, 14, 15]
    if hour in midday_hour:
        midday = 1
    else:
        midday = 0
    return midday

# Weekdays are from Monday to Friday. 
def encode_midweek(weekday):
    weekofday = [0, 1, 2, 3, 4]
    if weekday in weekofday:
        midweek = 1
    else:
        midweek = 0
    return midweek

# Summer Months are June July and August as those are the months when most students are not in school so route changes occur.
def encode_summer(month):
    if month in [6,7,8]:
        summer = 1
    else:
        summer = 0
    return summer

# Winter is the months of November, December, January and February because this when the coldest weather is. Note that no seperate columns were created for Autumn and Spring because they have similar weather and students will stillbe in school for both.
def encode_winter(month):
    if month in [11,12,1,2]:
        winter = 1
    else:
        winter = 0
    return winter

# Morning column is for times between 5am and 12(midday).
def encode_morning(hour):
    if hour in [4, 5, 6, 7, 8, 9, 10, 11, 12]:
        morning = 1
    else:
        morning = 0
    return morning

# function to encode trip_headsign as a direction_id
def get_direction_id(trip_headsign):
    direction_ids = json.loads(open ('dubbus/models/direction_id.json').read())
    # look for a direct match
    if trip_headsign in direction_ids:
        return direction_ids[trip_headsign]
    else:
        # default to direction 1 if not found
        return str(1)

def get_progress_number(route_id, stop_name):
    # json object stores route IDs in lower case
    route_id = route_id.lower()
    progress_numbers = json.loads(open ('dubbus/models/progress_numbers.json').read())
    if route_id not in progress_numbers:
        return -1
    elif stop_name not in progress_numbers[route_id]:
        return -1
    else: 
        return progress_numbers[route_id][stop_name]
    
print(get_progress_number("46a_1","Westmoreland Street, stop 319"))
# need to be fetched from frontend
start_pronum = 1
end_pronum = 20

# read data
month,weekday,hour,ts = current_time()
weather_main = future_weather(api,ts)
#print(ts)
#print(type(weather_main))
#weather_main = encode_weather(weather_main)
# rush_hour = encode_rush_hour(hour)
# frisat = encode_frisat(weekday)
# late_night = encode_late_night(hour)
# midday = encode_midday(hour)
# midweek = encode_midweek(weekday)
# summer = encode_summer(month)
# winter = encode_winter(month)
# morning = encode_morning(hour)

direction_id = get_direction_id("Ringsend Road - Tallaght Luas")
#print(direction_id, 'test')

# prog_num = get_progress_number("37_1","Pearse Street, stop 7588")
#print('prog_num',prog_num)

# open pickle
# use a fixed pickle to test, need be changed

def get_prediction(model, start_pronum, end_pronum, weather, rush_hour, late_night, midweek, summer, winter, midday, frisat, morning):
    f = open('dubbus/models/46A_2.pickle', 'rb')
    model = pickle.load(f)  
    start = {
        'PROGRNUMBER': start_pronum, 
        'weather_main':weather_main,
        'rush_hour':rush_hour,
        'LATE_NIGHT':late_night,
        'WEEKDAY':midweek,
        'SUMMER':summer,
        'WINTER':winter,
        'MIDDAY':midday,  
        'frisat':frisat,
        'MORNING':morning,
        }

    end = {
            'PROGRNUMBER': end_pronum, 
            'weather_main':weather_main,
            'rush_hour':rush_hour,
            'LATE_NIGHT':late_night,
            'WEEKDAY':midweek,
            'SUMMER':summer,
            'WINTER':winter,
            'MIDDAY':midday,  
            'frisat':frisat,
            'MORNING':morning,
            }

    start_df = pd.DataFrame([start])
    end_df = pd.DataFrame([end])
    # if the programnumber=1, then the prediction should be set as 0 
    if start_pronum == 1:
        start_prediction = 0
    else:
        start_prediction = model.predict(start_df)
    end_prediction = model.predict(end_df)

    prediction = end_prediction - start_prediction
    #print('Predicted journey time is: ', prediction)
    return prediction[0]

# x = get_prediction(model,start_pronum,end_pronum,weather_main,rush_hour,late_night,midweek,summer,winter,midday,frisat,morning)
# print(x)

