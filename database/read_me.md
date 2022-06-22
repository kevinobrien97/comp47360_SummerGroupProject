The following commands were run on MySQLWorkbench to export the csv files (obtained from https://www.transportforireland.ie/transitData/PT_Data.html) to the SQL DB

LOAD DATA LOCAL INFILE '/file/path/calendar.txt' INTO TABLE dublin_bus.calendar FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/file/path/calendar_dates.txt' INTO TABLE dublin_bus.calendar_dates FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/file/path/routes.txt' INTO TABLE dublin_bus.routes FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/file/path/shapes.txt' INTO TABLE dublin_bus.shapes FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/file/path/stops.txt' INTO TABLE dublin_bus.stops FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/file/path/stop_times.txt' INTO TABLE dublin_bus.stop_times FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/file/path/transfers.txt' INTO TABLE dublin_bus.transfers FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

LOAD DATA LOCAL INFILE '/file/path/trips.txt' INTO TABLE dublin_bus.trips FIELDS TERMINATED BY "," ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;