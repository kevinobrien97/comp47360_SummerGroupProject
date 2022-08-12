from django.contrib.auth.models import User
from django.test import TestCase
import json
import unittest
from dubbus.views import WeatherView, RoutesUpdatedView, StopsView, StopTimesUpdatedView, FullRouteStopTimesUpdatedView, RouteStopsView
from rest_framework.test import APIRequestFactory
from django.http import JsonResponse
from dubbus.models import Stops, Weather, FavouriteStops, RoutesUpdated, FavouriteRoutes, StopTimesUpdated, RouteStops, Forecast
import time
from dubbus.prediction import get_progress_number, get_direction_id

sample_users = [
    {"username": "kevinTestDB1", "password": "testpassword123", "password2": "testpassword123"},
    {"username": "kevinTestDB2", "password": "testpassword234", "password2": "testpassword234"},
    {"username": "1", "password": "testpassword345", "password2": "testpassword345"},
    {"username": "kevinTestDB3", "password": "short", "password2": "short"},
    {"username": "kevinTestDB4", "password": "password", "password2": "password"},
    {"username": "kevinTestDuplicated", "password": "testpassword1234", "password2": "testpassword1234"},
    ]

sample_bus_routes = [
    {"trip_headsign": "Harristown Bus Garage - Monkstown Avenue (Richmond Grove)", "route_short_name": "4"},
    {"trip_headsign": "Dalriada Estate - Merrion Square South", "route_short_name": "15b"}
]

sample_bus_stops = [
    {"stop_id": "8220DB000894"},
    {"stop_id": "8220DB000010"}
]

# the below predictions were retrieved 
google_predictions_long = [
    {"route_id": "65", "headsign": "Poolbeg Street - Valleymount Road", "start_stop": "George's St, Exchequer Street", "end_stop": "Tallaght Hospital",  "total_stops": 34, "timestamp": 1660045350000, "prediction": 40},
    {"route_id": "14", "headsign": "Maryfield Drive - Outside Luas Station", "start_stop": "Dame Street, stop 7581", "end_stop": "Holy Cross Church",  "total_stops": 43, "timestamp": 1660045350000, "prediction": 41},
    {"route_id": "14", "headsign": "Maryfield Drive - Outside Luas Station", "start_stop": "D'Olier Street", "end_stop": "Holy Cross Church",  "total_stops": 44, "timestamp": 1660045350000, "prediction": 45},
]

google_predictions_short = [
    {"route_id": "14", "headsign": "Maryfield Drive - Outside Luas Station", "start_stop": "Fairview, stop 614", "end_stop": "Nth Strand Fire Stn, Stop 616",  "total_stops": 2, "timestamp": 1660045350000, "prediction": 2},
    {"route_id": "15", "headsign": "Main Street - Ballycullen Road (Hunter's Avenue)", "start_stop": "Fairview, stop 614", "end_stop": "Nth Strand Fire Stn, Stop 616",  "total_stops": 2, "timestamp": 1660045350000, "prediction": 2},
    {"route_id": "61", "headsign": "Eden Quay - Edmondstown Road (Rockbrook Park School)", "start_stop": "Charlemont Street, stop 2812", "end_stop": "Glenmalure Square, stop 2816",  "total_stops": 8, "timestamp": 1660045350000, "prediction": 10},
    {"route_id": "14", "headsign": "Maryfield Drive - Outside Luas Station", "start_stop": "Dame Street, stop 7581", "end_stop": "Rathgar Place",  "total_stops": 11, "timestamp": 1660309593000, "prediction": 15},
]

class TestLogin(TestCase):
    def setUp(self):
        # add users to db
        for testuser in sample_users:
            user = User.objects.create(
                username=testuser['username']
                )
            user.set_password(testuser['password'])
            user.save() 

    def test_login_correct(self):
        # send user info to url to see if refresh and access tokens are returned (testing access specifically)
        response = self.client.post('/api/token/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the tokens
        result = json.loads(response.content)
        self.assertTrue("access" in result)

    def test_login_incorrect(self):
        # send incorrect user info to url to see if an error is returned
        response = self.client.post('/api/token/'
        , {
            'username': sample_users[0]["username"],
            #  set the password to the wrong one
            'password': sample_users[1]["password"]}, follow=True)
        # should not be logged in
        # convert to json format to access response
        result = json.loads(response.content)    
        self.assertTrue("No active account found with the given credentials" in result['detail'])

class TestRefresh(TestCase):
    def setUp(self):
        user = User.objects.create(
            username=sample_users[0]['username']
            )
        user.set_password(sample_users[0]['password'])
        user.save()
    
    # test users new access token
    def test_access_tokens(self):
        # send user info to url and store access token
        response_token = self.client.post('/api/token/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the tokens
        result_token = json.loads(response_token.content)
        access_token_1 = result_token["access"]
        # store refresh token
        refresh_token = result_token["refresh"]
        response_refresh = self.client.post('/api/token/refresh/'
        , {
           'refresh': refresh_token
        }, follow=True)

        # success code
        self.assertEquals(response_refresh.status_code, 200)
        result_refresh = json.loads(response_refresh.content)

        # store new access token
        access_token_2 = result_refresh["access"]
        # check that the new access token is different from the first
        self.assertNotEqual(access_token_1, access_token_2)

    # test users new refresh token
    # to maintain security a refresh token is valid for a single use and therefore a new one should be returned along with a new access token
    def test_refresh_tokens(self):
        # send user info to url and store access token
        response_token = self.client.post('/api/token/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the tokens
        result_token = json.loads(response_token.content)
        access_token = result_token["access"]
        # store refresh token
        refresh_token_1 = result_token["refresh"]
        response_refresh = self.client.post('/api/token/refresh/'
        , {
           'refresh': refresh_token_1
        }, follow=True)

        # success code
        self.assertEquals(response_refresh.status_code, 200)
        result_refresh = json.loads(response_refresh.content)

        # store the returned refresh token
        refresh_token_2 = result_refresh["refresh"]
        # check returned refresh token is the same as the one that was provided
        self.assertNotEqual(refresh_token_1, refresh_token_2) 

class TestRegister(TestCase):
    # testing if a user can be created
    def test_register_correct(self):
        response = self.client.post('/api/register/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"],
             'password2': sample_users[0]["password2"]}, follow=True)
        result = json.loads(response.content)  
        self.assertTrue(sample_users[0]["username"] in result['username']) 

    # testing if only providing one password is acceptable
    def test_register_one_password(self):
        response = self.client.post('/api/register/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"]}, follow=True)
        result = json.loads(response.content)  
        self.assertTrue('This field is required.' in result['password2']) 
    
    # testing giving an incorrect second password
    def test_register_wrong_password(self):
        response = self.client.post('/api/register/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"],
             # different from the first
             'password2': sample_users[1]["password2"]}, follow=True)
        result = json.loads(response.content)  
        self.assertTrue('Both passwords did not match.' in result['password']) 

    # testing a weak password
    def test_register_short_password(self):
        response = self.client.post('/api/register/'
        , {
             'username': sample_users[3]["username"],
             'password': sample_users[3]["password"],
             'password2': sample_users[3]["password2"]}, follow=True)
        result = json.loads(response.content)  
        self.assertTrue('This password is too short. It must contain at least 8 characters.' in result['password']) 

    # testing a common password
    def test_register_common_password(self):
        response = self.client.post('/api/register/'
        , {
             'username': sample_users[4]["username"],
             'password': sample_users[4]["password"],
             'password2': sample_users[4]["password2"]}, follow=True)
        result = json.loads(response.content)  
        self.assertTrue('This password is too common.' in result['password']) 
    
    # setUp method to create a user that I will attempt to duplicated below
    def setUp(self):
        user = User.objects.create(
            username=sample_users[5]['username']
            )
        user.set_password(sample_users[5]['password'])
        user.save() 

    # testing a duplicated account (one made successfully in setUp above)
    def test_register_duplicated_user(self):
        response = self.client.post('/api/register/'
        , {
             'username': sample_users[5]["username"],
             'password': sample_users[5]["password"],
             'password2': sample_users[5]["password2"]}, follow=True)
        result = json.loads(response.content)  
        self.assertTrue('A user with that username already exists.' in result['username']) 

class TestFavouriteRoutes(TestCase):
    def setUp(self):
        # set up 2 users
        user1 = User.objects.create(
            username=sample_users[0]['username']
            )
        user1.set_password(sample_users[0]['password'])
        user1.save()

        user2 = User.objects.create(
            username=sample_users[1]['username']
            )
        user2.set_password(sample_users[1]['password'])
        user2.save()
        # add a route to favourites to test get and delete methods
        access_token = self.get_access_token()
        self.client.post('/api/favouriteroutes/',
        {
            "trip_headsign": sample_bus_routes[1]["trip_headsign"],
            "route_short_name": sample_bus_routes[1]["route_short_name"]
        }, 
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
    
    # set up a method to get the users access token
    def get_access_token(self):
        response = self.client.post('/api/token/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the token
        result = json.loads(response.content)
        return result["access"]

    # test if a user can post a favourite route
    def test_post_favourite_route(self):
        access_token = self.get_access_token()
        response = self.client.post('/api/favouriteroutes/',
        {
            "trip_headsign": sample_bus_routes[0]["trip_headsign"],
            "route_short_name": sample_bus_routes[0]["route_short_name"]
        }, 
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        self.assertEquals(response.status_code, 201)
        result = json.loads(response.content)
        self.assertEquals(result["trip_headsign"], "Harristown Bus Garage - Monkstown Avenue (Richmond Grove)")
        # no need to test entire output
    
    # test if a user can post without an access token
    def test_post_favourite_route_no_token(self):
        response = self.client.post('/api/favouriteroutes/',
        {
            "trip_headsign": sample_bus_routes[0]["trip_headsign"],
            "route_short_name": sample_bus_routes[0]["route_short_name"]
        }, 
        content_type='application/json',
        # HTTP_AUTHORIZATION not provided
        follow=True)
        self.assertEquals(response.status_code, 401)
        result = json.loads(response.content)
        self.assertEquals(result["detail"], "Authentication credentials were not provided.")
    
    # test if a user can post with an incorrect access token
    def test_post_favourite_route_wrong_token(self):
        response = self.client.post('/api/favouriteroutes/',
        {
            "trip_headsign": sample_bus_routes[0]["trip_headsign"],
            "route_short_name": sample_bus_routes[0]["route_short_name"]
        }, 
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer wrongtoken', 
        follow=True)
        self.assertEquals(response.status_code, 401)
        result = json.loads(response.content)
        self.assertEquals(result["detail"], "Given token not valid for any token type")

    # test if a user can get a favourite route
    def test_get_favourite_route(self):
        access_token = self.get_access_token()
        response = self.client.get('/api/favouriteroutes/',
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        self.assertEquals(response.status_code, 200)
        result = json.loads(response.content)
        self.assertEquals(result[0]["trip_headsign"], sample_bus_routes[1]["trip_headsign"])

    # test if a user can get other users favourites
    # in setUp I made 2 users and posted a favourite for one of them, I will now test if the second can access the favourite for the first
    def test_get_favourite_route_different_user(self):
        access_request = self.client.post('/api/token/'
        , {
             'username': sample_users[1]["username"],
             'password': sample_users[1]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the token
        access_result = json.loads(access_request.content)
        access_token = access_result["access"]

        response = self.client.get('/api/favouriteroutes/',
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        # still a valid request, just no favourites returned
        self.assertEquals(response.status_code, 200)
        result = json.loads(response.content)
        # length of an empty list is False
        self.assertEquals(len(result), False)

    # test if a user can delete a favourite route
    # in setUp I added a favourite route for a user
    # deletes are made by adding the primary key to the url
    # primary key is the order in which the favourites were made - this was favourte #1
    def test_delete_favourite_route(self):
        access_token = self.get_access_token()
        response = self.client.delete('/api/favouriteroutes/1/',
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        # success code for deletions
        self.assertEquals(response.status_code, 204)

    # note I am not testing posting duplicates or posting wrong information as this is not possible via checks I implemented on the frontend (i.e. no manual entry, user checks, duplicate postings prevented)

class TestFavouriteStops(TestCase):
    def setUp(self):
        # set up 2 users
        user1 = User.objects.create(
            username=sample_users[0]['username']
            )
        user1.set_password(sample_users[0]['password'])
        user1.save()

        user2 = User.objects.create(
            username=sample_users[1]['username']
            )
        user2.set_password(sample_users[1]['password'])
        user2.save()
        # add a stop to favourites to test get and delete methods
        access_token = self.get_access_token()
        self.client.post('/api/favourites/',
        {
            "stop_id": sample_bus_stops[1]["stop_id"]
        }, 
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
    
    # set up a method to get the users access token
    def get_access_token(self):
        response = self.client.post('/api/token/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the token
        result = json.loads(response.content)
        return result["access"]

    # test if a user can post a favourite stop
    def test_post_favourite_stop(self):
        access_token = self.get_access_token()
        response = self.client.post('/api/favourites/',
        {
            "stop_id": sample_bus_stops[0]["stop_id"]
        }, 
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        self.assertEquals(response.status_code, 201)
        result = json.loads(response.content)
        self.assertEquals(result["stop_id"], sample_bus_stops[0]["stop_id"])
        # no need to test entire output
    
    # test if a user can post without an access token
    def test_post_favourite_stop_no_token(self):
        response = self.client.post('/api/favourites/',
        {
            "stop_id": sample_bus_stops[0]["stop_id"]
        }, 
        content_type='application/json',
        # HTTP_AUTHORIZATION not provided
        follow=True)
        self.assertEquals(response.status_code, 401)
        result = json.loads(response.content)
        self.assertEquals(result["detail"], "Authentication credentials were not provided.")
    
    # test if a user can post with an incorrect access token
    def test_post_favourite_stop_wrong_token(self):
        response = self.client.post('/api/favourites/',
        {
            "stop_id": sample_bus_stops[0]["stop_id"]
        }, 
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer wrongtoken', 
        follow=True)
        self.assertEquals(response.status_code, 401)
        result = json.loads(response.content)
        self.assertEquals(result["detail"], "Given token not valid for any token type")

    # test if a user can get a favourite route
    def test_get_favourite_stop(self):
        access_token = self.get_access_token()
        response = self.client.get('/api/favourites/',
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        self.assertEquals(response.status_code, 200)
        result = json.loads(response.content)
        self.assertEquals(result[0]["stop_id"], sample_bus_stops[1]["stop_id"])

    # test if a user can get other users favourites
    # in setUp I made 2 users and posted a favourite for one of them, I will now test if the second can access the favourite for the first
    def test_get_favourite_stop_different_user(self):
        access_request = self.client.post('/api/token/'
        , {
             'username': sample_users[1]["username"],
             'password': sample_users[1]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the token
        access_result = json.loads(access_request.content)
        access_token = access_result["access"]

        response = self.client.get('/api/favourites/',
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        # still a valid request, just no favourites returned
        self.assertEquals(response.status_code, 200)
        result = json.loads(response.content)
        # length of an empty list is False
        self.assertEquals(len(result), False)

    # test if a user can delete a favourite stop
    # in setUp I added a favourite stop for a user
    # deletes are made by adding the primary key to the url
    # primary key is the order in which the favourites were made - this was favourte #1
    def test_delete_favourite_stop(self):
        access_token = self.get_access_token()
        response = self.client.delete('/api/favourites/1/',
        content_type='application/json',
        HTTP_AUTHORIZATION= f'Bearer {access_token}', 
        follow=True)
        # success code for deletions
        self.assertEquals(response.status_code, 204)

#    note I am not testing posting duplicates or posting wrong information as this is not possible via checks I implemented on the frontend (i.e. no manual entry, user checks, duplicate postings prevented)

# class TestWeather(unittest.TestCase):
#     def test_get_weather(self):
#         request = APIRequestFactory().get("")
#         # testing if weather is returned successfully
#         view = WeatherView.as_view({'get': 'retrieve'}, detail=True)
#         res = view(request, pk=Weather.objects.first().pk)
#         self.assertEquals(res.status_code, 200)

# class TestRoutes(unittest.TestCase):
#     def test_get_routes(self):
#         request = APIRequestFactory(content_type='application/json').get("")
#         # testing if routes are returned successfully
#         view = RoutesUpdatedView.as_view({'get': 'retrieve'}, detail=True)
#         print(RoutesUpdated.objects.filter(trip_headsign='Abbeyvale Brackenstown Road - Marlborough Street', route_short_name='41'))
#         sample = RoutesUpdated.objects.filter(trip_headsign='Abbeyvale Brackenstown Road - Marlborough Street', route_short_name='41')
#         res = view(request, pk=(('Aston Quay - Park West Hotel')))
#         # print(res)
#         # res = view(request, pk=sample['trip_headsign'])
#         self.assertEquals(res.status_code, 200)

# class TestStops(unittest.TestCase):
#     def test_get_all_stops(self):
#         request = APIRequestFactory().get("")
#         # testing if stops are returned successfully
#         view = StopsView.as_view({'get': 'retrieve'}, detail=True)
#         res = view(request, pk=Stops.objects.first().pk)
#         # print('rrr',JsonResponse(res.content))
#         self.assertEquals(res.status_code, 200)

class TestWeather(TestCase):
    def test_get_weather(self):
        # testing if weather is returned successfully
        response = self.client.get('/api/weather/', follow=True)
        self.assertEquals(response.status_code, 200)

class TestRoutes(TestCase):
    def test_get_routes(self):
        # testing if routes are returned successfully
        response = self.client.get('/api/routes/', follow=True)
        self.assertEquals(response.status_code, 200)

class TestStops(TestCase):
    def test_get_all_stops(self):
        # testing if stops are returned successfully
        response = self.client.get('/api/stops/', follow=True)
        self.assertEquals(response.status_code, 200)        

class TestStopTimes(TestCase):
    def test_get_stop_times(self):
        # testing if stop times are returned successfully
        # using a sample stop below
        response = self.client.get('/api/stoptimes/8220DB000007/5/', follow=True)
        self.assertEquals(response.status_code, 200)

class TestFullRouteStopTimes(TestCase):
    def test_get_full_route_stop_times(self):
        # testing if stop times are returned successfully
        # using a sample stop below
        response = self.client.get('/api/fullroutestoptimes/4/Harristown Bus Garage - Monkstown Avenue (Richmond Grove)/6/', follow=True)
        self.assertEquals(response.status_code, 200)

class TestFullRouteStop(TestCase):
    def test_get_full_route_stops(self):
        # testing if stop times are returned successfully
        # using a sample stop below
        response = self.client.get('/api/routestops/', follow=True)
        self.assertEquals(response.status_code, 200)

class TestPredictions(TestCase):
    # test retrieving a progress number given the stop name
    def testprogressnumber_easy(self):
        route_id = "1_1"
        stop_name = "Shanard Avenue, stop 226"
        progress_num = get_progress_number(route_id, stop_name)
        self.assertAlmostEqual(progress_num, "1")

    # test retrieving a progress number partial stop name
    def testprogressnumber_advanced(self):
        route_id = "1_1"
        # sometimes Google Maps returns a stop without its full name
        stop_name = "Shanard Avenue"
        progress_num = get_progress_number(route_id, stop_name)
        self.assertAlmostEqual(progress_num, "1")
    
    # test getting the bus direction given the headsign
    def testdirectionid(self):
        headsign = "Alensgrove - Saint Stephen's Green House"
        direction_id = get_direction_id(headsign)
        self.assertAlmostEqual(direction_id, "2")
    
    # test to see if the prediction endpoint returns a successful response with and without the headsign - also test if the predictions are equal
    def test_predictions_returned(self):
        # testing if stop times are returned successfully
        # using a sample stop below

        response1 = self.client.get('/api/getPrediction/',
      {
                        "route_id": "1",
                        "headsign": "Shanard Road (Shanard Avenue) - Shaw Street",
                        "start_stop": "Shanard Avenue, stop 226",
                        "end_stop": "Whitehall Church, stop 1642",
                        "total_stops": 7,
                        "timestamp": 1660152569329,
                      }, follow=True)
        # in the below i dont specify the headsign
        response2 = self.client.get('/api/getPrediction/',
      {
                        "route_id": "1",
                        "headsign": "N/A",
                        "start_stop": "Shanard Avenue, stop 226",
                        "end_stop": "Whitehall Church, stop 1642",
                        "total_stops": 7,
                        "timestamp": 1660152569329,
                      }, follow=True)

        result1 = json.loads(response1.content)
        result2 = json.loads(response1.content)
      
        self.assertEquals(response1.status_code, 200)
        self.assertEquals(response2.status_code, 200)
        self.assertEquals(result1, result2)
    
    
    # takes a random sample of actual journeys precalculated on Google and compares our estimated time to the associated Google prediction, plus or minus a range
    def test_predictions_google(self):
        # the below loops through 'long' journeys that were samplped from Google, comparing our prediction to Googles, +- 1.5 mins 
        for journey in google_predictions_long:


            response = self.client.get('/api/getPrediction/',
        {
                            "route_id": journey["route_id"],
                            "headsign": journey["headsign"],
                            "start_stop": journey["start_stop"],
                            "end_stop": journey["end_stop"],
                            "total_stops": journey["total_stops"],
                            "timestamp": journey["timestamp"],
                        }, follow=True)
            result = json.loads(response.content)
            print(journey, result['result'])
            prediction = int(result['result'])/60           
            self.assertTrue(journey["prediction"]-1.5 <= prediction <= journey["prediction"]+1.5)

        # the below loops through 'short' journeys that were samplped from Google, comparing our prediction to Googles, +- 1 mins 
        for journey in google_predictions_short:
            response = self.client.get('/api/getPrediction/',
        {
                            "route_id": journey["route_id"],
                            "headsign": journey["headsign"],
                            "start_stop": journey["start_stop"],
                            "end_stop": journey["end_stop"],
                            "total_stops": journey["total_stops"],
                            "timestamp": journey["timestamp"],
                        }, follow=True)
            result = json.loads(response.content)
            prediction = int(result['result'])/60            
            self.assertTrue(journey["prediction"]-1.0 <= prediction <= journey["prediction"]+1.0)
    

