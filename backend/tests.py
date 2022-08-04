from django.contrib.auth.models import User
from django.test import TestCase
import json

sample_users = [
    {"username": "kevinTestDB1", "password": "testpassword123", "password2": "testpassword123"},
    {"username": "testinguser2", "password": "testpassword234", "password2": "testpassword234"},
    ]

class TestLogin(TestCase):
    def setUp(self):
        testuser = sample_users[0]
        for testuser in sample_users:
            user = User.objects.create(
                username=testuser['username']
                )
            user.set_password(testuser['password'])
            user.save() 

    def test_login(self):
        # send user info to url to see if refresh and access tokens are returned (testing access specifically)
        response = self.client.post('/api/token/'
        , {
             'username': sample_users[0]["username"],
             'password': sample_users[0]["password"]}, follow=True)
        # should be logged in
        # convert to json format to access the tokens
        result = json.loads(response.content)
        self.assertTrue("access" in result)

class TestLoginWrongPassword(TestCase):
    def setUp(self):
        testuser = sample_users[0]
        for testuser in sample_users:
            user = User.objects.create(
                username=testuser['username']
                )
            user.set_password(testuser['password'])
            user.save() 

    def test_login(self):
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