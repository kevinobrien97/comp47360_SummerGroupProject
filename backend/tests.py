from django.contrib.auth.models import User
from django.test import TestCase
import json

sample_users = [
    {"username": "kevinTestDB1", "password": "testpassword123", "password2": "testpassword123"},
    {"username": "kevinTestDB2", "password": "testpassword234", "password2": "testpassword234"},
    {"username": "1", "password": "testpassword345", "password2": "testpassword345"},
    {"username": "kevinTestDB3", "password": "short", "password2": "short"},
    {"username": "kevinTestDB4", "password": "password", "password2": "password"},
    {"username": "kevinTestDuplicated", "password": "testpassword1234", "password2": "testpassword1234"},
    ]

sample_bus_routes = [
    {"trip_headsign": "Harristown Bus Garage - Monkstown Avenue (Richmond Grove)", "route_short_name": "4"}
]

class TestLogin(TestCase):
    def setUp(self):
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
    # set up a user
    def setUp(self):
        user = User.objects.create(
            username=sample_users[0]['username']
            )
        user.set_password(sample_users[0]['password'])
        user.save()
    
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
        # should be true as its the first favourite added in test database
        # id is the primary key assigned that also lists the order favourites were added in
        self.assertEquals(result["id"], 1)
        self.assertEquals(result["trip_headsign"], "Harristown Bus Garage - Monkstown Avenue (Richmond Grove)")
        # no need to test entire output
    
    def test_post_favourite_route_fail(self):

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