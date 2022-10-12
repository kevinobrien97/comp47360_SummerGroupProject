# ShuttleUp Installation Guide 

Clone repo and run the following:

##### virtualenv envname
##### source envname/bin/activate 

##### pip install -r requirements.txt
##### pip install django-cors-headers

### cd client

##### npm install

##### npm start 

Store your personal Google Maps API key in the env folder and ensure you have enabled access to GoogleMaps' Javascript, Directions and Places APIs. 

## For other keys: 

##### export SQLPW="password-to-shuttleup-DB" 
##### export API="your-openweather-api-key"
##### export django_key="your-own-secret-django-key"

In a second terminal you can optionally do the following: 

##### python manage.py runserver 

this will start Django. To use a local version of our backend you will need to replace our deployed backend IP address to "127.0.0.1", by commenting back in the lines with this IP (and removing the lines with the deployed version). 
