# ShuttleUp Installation Guide 

Clone repo to your desired location and run the following:

##### virtualenv envname
##### source envname/bin/activate 

##### pip install -r requirements.txt
##### pip install django-cors-headers

### cd client

## **Ensure React is installed for "npm" ** 
##### npm install

in ./src/components/Navbar/ rename navbar.js to Navbar.js

##### npm start 

You must store your personal Google Maps API key in the env folder, please ensure that you have enabled access to GoogleMaps' Javascript, Directions and Places APIs. 

## For other keys: 

##### export SQLPW="password-to-shuttleup-DB" 
##### export API="your-openweather-api-key"
##### export django_key="your-own-secret-django-key"

In a second terminal you can optionally do the following: 

##### python manage.py runserver 

this will start Django, however all instances of api calls to the backend would have to be changed from the server ip to your localhost, this can be done by sifting through each file and using "ctrl+f" to find where "127.0.0.1" has been commented out in favour of the server ip. 
