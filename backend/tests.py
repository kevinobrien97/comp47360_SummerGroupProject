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