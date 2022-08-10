from sqlalchemy import create_engine
import os
SQLPW = os.environ['SQLPW']

engine = create_engine("mysql+mysqlconnector://shuttleup:" + SQLPW + "@dubbus.cimqwuwj7cb7.us-east-1.rds.amazonaws.com:3306/dublin_bus")

connection = engine.connect()

# to add - PKs and FKs

calendar_dates = "CREATE TABLE `calendar_dates`(`service_id` varchar(30), `date` varchar(30), `exception_type` int);"
calendar = "CREATE TABLE `calendar`(`service_id` varchar(30), `monday` int, `tuesday` int, `wednesday` int, `thursday` int,`friday` int, `saturday` int, `sunday` int, `start_date` varchar(30), `end_date` varchar(30));"
routes = "CREATE TABLE `routes`(`route_id` varchar(30),`agency_id` varchar(30),`route_short_name` varchar(30),`route_long_name` varchar(255),`route_type` int);"
shapes = "CREATE TABLE `shapes`(`shape_id` varchar(30),`shape_pt_lat` double,`shape_pt_lon` double,`shape_pt_sequence` int,`shape_dist_traveled` double);"
stop_times = "CREATE TABLE `stop_times`(`trip_id` varchar(255),`arrival_time` time,`departure_time` time,`stop_id` varchar(255),`stop_sequence` int, `stop_headsign` varchar(255),`pickup_type` int, `drop_off_type` int, `shape_dist_traveled` double);"
stops = "CREATE TABLE `stops`(`stop_id` varchar(30),`stop_name` varchar(255),`stop_lat` double,`stop_long` double);"
transfers = "CREATE TABLE `transfers`(`from_stop_id` varchar(30),`to_stop_id` varchar(30),`transfer_type` int,`min_transfer_time` int);"
trips = "CREATE TABLE `trips`(`route_id` varchar(30),`service_id` varchar(30),`trip_id` varchar(255),`shape_id` varchar(30),`trip_headsign` varchar(255),`direction_id` int);"

# created files
routes_updated = "CREATE TABLE `routes_updated`(`trip_headsign` varchar(255), `route_short_name` varchar(30));"
route_stops = "CREATE TABLE `route_stops`(`stop_id` varchar(255), `trip_headsign` varchar(255), `route_short_name` varchar(30),`stop_name` varchar(255), `stop_lat` double,`stop_long` double);"
stop_times_updated = "CREATE TABLE `stop_times_updated`(`trip_id` varchar(255), `departure_time` time, `stop_id` varchar(255), `stop_sequence` int, `stop_headsign` varchar(255), `route_id` varchar(30), `service_id` varchar(30), `trip_headsign` varchar(255), `route_short_name` varchar(30));"

connection.execute(calendar_dates)
connection.execute(calendar)
connection.execute(routes)
connection.execute(shapes)
connection.execute(stop_times)
connection.execute(stops)
connection.execute(transfers)
connection.execute(trips)

connection.execute(routes_updated)
connection.execute(route_stops)
connection.execute(stop_times_updated)

# calendar_insert = """LOAD DATA LOCAL INFILE '/Users/Kevin/Documents/CS Conversion/COMP47360 Research Practicum/ResearchProject/comp47360_SummerGroupProject/database/gtfsdata/calendar.txt' INTO TABLE `calendar` FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY "\r\n";"""

# connection.execute(calendar_insert)

print('Success')

connection.close()