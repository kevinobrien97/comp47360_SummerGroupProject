from sqlalchemy import create_engine
import os
SQLPW = os.environ['SQLPW']

engine = create_engine("mysql+mysqlconnector://shuttleup:" + SQLPW + "@shupdublinbus.cimqwuwj7cb7.us-east-1.rds.amazonaws.com:3306/dublin_bus")

connection = engine.connect()

# def create_weather():
#     sql = """
#     CREATE TABLE IF NOT EXISTS weather (
#     temperature INTEGER, 
#     feels_like INTEGER,
#     )
#     """
#     try:
#         print(connection.execute(sql).fetchall())
#     except Exception as error:
#         print(error)

# def insert_weather(value: dict):
#     try:
#         run = connection.execute(
#             f"INSERT INTO weather values('{value['temp']}','{value['feels_like']}')")
#         print(run.fetchall())
#     except Exception as error:
#         print(error)


testData = "INSERT INTO test_table (test_col) VALUES (123)"
connection.execute(testData)
print('Success')


connection.close()