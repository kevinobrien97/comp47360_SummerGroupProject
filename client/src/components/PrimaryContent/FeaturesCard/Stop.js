import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Autocomplete, Button } from "@mui/material";
import classes from "./Stop.module.css";
import Box from "@mui/material/Box";
const Stop = (props) => {
  const [selectedStop, setSelectedStop] = useState();
  const [selectedStopList, setSelectedStopList] = useState();

  console.log('stops123', props.stops1);
  const busStops = props.stops.map((stop) => {
    return { label: stop.stop_name, key: stop.stop_id };
  });
  const bgColor = (id) => {
    console.log("1,", id);
    console.log("12,", selectedStopList);
    if (id === selectedStopList) {
      return { backgroundColor: "blue" };
    }
    return { backgroundColor: "white" };
  };
  const pickStops = (event) => {
    setSelectedStopList(event.target.value);
  };

  // const { stop: { stop.stop_number, stop.stop_id } } = props.stops;
  return (
    <div className={classes.stop}>
      <Box
        sx={{
          marginTop: 3,
          borderColor: "black",
          color: "black",
        }}
      >
        <Autocomplete
          value={selectedStop}
          onChange={(event, newStop) => {
            console.log(newStop.key);
            setSelectedStop(newStop.key);
          }}
          disablePortal
          id="stop-search"
          options={busStops}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Bus Stop" />
          )}
          classes={{
            root: classes.root,
          }}
        />
      </Box>
      {console.log("sel", selectedStop)}
      <Box className="stop-info">
        {!selectedStop && (
          <ul className={classes.stop_options}>
            {props.stops.map((stop) => (
              <li key={stop.stop_id}>
                <Button
                  sx={{
                    backgroundColor: "black",
                    width: 370,
                    color: "white",
                    border: 3,
                    borderRadius: 5,
                    padding: 1,
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "black",
                    },
                  }}
                  value={stop.stop_id}
                  onClick={pickStops}
                >
                  {stop.stop_name}
                </Button>
              </li>
            ))}
          </ul>
        )}

        {selectedStop && (
          <ul className={classes.stop_option}>
            {props.stops.map((stop) =>
              stop.stop_id === selectedStop ? (
                <li key={stop.stop_id}>
                  <Button
                    sx={{
                      backgroundColor: "black",
                      width: 370,
                      color: "white",
                      border: 3,
                      borderRadius: 5,
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "black",
                      },
                    }}
                    value={stop.stop_id}
                    onClick={pickStops}
                  >
                    Stop Name: {stop.stop_name}
                  </Button>
                </li>
              ) : null
            )}
          </ul>
        )}
      </Box>
    </div>
  );
};

export default Stop;
