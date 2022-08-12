from re import S
import json
import pickle
import pandas as pd
from os import path


def encode_weather(json_ob, currenttime):
    # if weather retrieval fails for any reason - should never happen
    if isinstance(json_ob, str):
        return 0 
    forecast_dict = {}
    for j in json.loads(json_ob):
        forecast_dict[int(j['pk'])] = j['fields']['conditions']
    weather_key, weather_val = min(forecast_dict.items(), key=lambda x: abs(currenttime - x[0]))
    # weather forecast is every 3 hours 5 days out so if greater than 14400 (4 hours in seconds) means its past 5 days 
    if currenttime - weather_key > 14400:
        print("older than 5 days")
        return 0

    if (weather_val == "Rain" or weather_val == "Mist" or weather_val == "Thunderstorm"): 
        return 1
    else: 
        return 0

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
        # if cannot find it the headsign may have just changed
        # therefore try both directions for the route
        return -1

def get_progress_number(route_id, stop_name):
    # json object stores route IDs in lower case
    route_id = route_id.lower()
    progress_numbers = json.loads(open ('dubbus/models/progress_numbers.json').read())
    if route_id not in progress_numbers:
        return -1
    # sometimes Google Maps returns a partial stop name in which case it should still be returned
    elif any(stop_name in k for k in progress_numbers[route_id].keys()):
        stops = [val for key, val in progress_numbers[route_id].items() if stop_name in key]
        return stops[0]
    elif stop_name not in progress_numbers[route_id]:
        return -1
 
    else: 
        return progress_numbers[route_id][stop_name]
    

def get_prediction(model_name, start_pronum, end_pronum, weather, rush_hour, late_night, midweek, summer, winter, midday, frisat, morning):
    # add some checks if the prog numbers were retrieved incorrectly
    # None results in Google Maps prediction being used
    if int(end_pronum) <= int(start_pronum) or int(end_pronum) <= 0 or int(start_pronum) <0:
        return "None"
    upper_model_name = model_name.upper()
    print('in prediction method',upper_model_name)

    print('EXISTS?',path.exists(f'dubbus/models/pickle_files/{upper_model_name}.pickle'))
    if path.exists(f'dubbus/models/pickle_files/{upper_model_name}.pickle'):
        f = open(f'dubbus/models/pickle_files/{upper_model_name}.pickle', 'rb')
        # f = open('dubbus/models/46A_2.pickle', 'rb')
        model = pickle.load(f)  
        start = {
            'PROGRNUMBER': start_pronum, 
            'weather_main':weather,
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
                'weather_main':weather,
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
        f.close()
        prediction = end_prediction - start_prediction
        return prediction[0]
    else:
        return "None"


