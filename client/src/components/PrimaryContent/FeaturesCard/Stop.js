import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Autocomplete, Button } from "@mui/material";
import classes from "./Stop.module.css";

const Stop = (props) => {
  const [selectedStop, setSelectedStop] = useState();
  const [selectedStopList, setSelectedStopList] = useState();


  const busStops = props.stops.map((stop) => {
    return { label: stop.stop_name, key: stop.stop_id };
  });
  const bgColor = (id) => {
      console.log('1,', id)
      console.log('12,', selectedStopList)
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
        renderInput={(params) => <TextField {...params} label="Bus Stop" />}
      />
      {console.log("sel", selectedStop)}

      {!selectedStop && <ul className={classes.stop_options}>
        {props.stops.map((stop) => (
          <li key={stop.stop_id}>
            <Button
              style={bgColor(stop.stop_id)}
              value={stop.stop_id}
              onClick={pickStops}
            >
              Stop Name: {stop.stop_name}
            </Button>
          </li>
        ))}
      </ul>}

      {selectedStop && <ul className={classes.stop_option}>
          {props.stops.map((stop) => (
              stop.stop_id=== selectedStop ?
          <li key={stop.stop_id}>
            <Button
              style={bgColor(stop.stop_id)}
              value={stop.stop_id}
              onClick={pickStops}
            >
              Stop Name: {stop.stop_name}
            </Button>
          </li> : null
        ))}
      </ul>}
    </div>
  );
};

export default Stop;
