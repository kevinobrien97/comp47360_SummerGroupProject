from sqlalchemy import create_engine
import os
SQLPW = os.environ['SQLPW']

engine = create_engine("mysql+mysqlconnector://shuttleup:" + SQLPW + "@shupdublinbus.cimqwuwj7cb7.us-east-1.rds.amazonaws.com:3306/dublin_bus")

connection = engine.connect()

testData = "INSERT INTO test_table (test_col) VALUES (123)"
connection.execute(testData)
print('Success')


connection.close()