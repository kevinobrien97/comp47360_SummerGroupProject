import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Autocomplete, Button } from "@mui/material";
import classes from "./Stop.module.css";
import Box from "@mui/material/Box";
const Stop = (props) => {
  // const busStops = props.stops.map((stop) => {
  //   return { label: stop.stop_name, key: stop.stop_id };
  // });
  const busStops = props.stops.map((stop) => {
    return { label: stop.stop_name, key: stop.stop_id };
  });

  const [selectedStop, setSelectedStop] = useState();
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [selectedStopList, setSelectedStopList] = useState(false);

  const bgColor = (id) => {
    if (id === selectedStop) {
      return { backgroundColor: "#fff", color: "black" };
    }
  };
  const pickStops = (event) => {
    const stop = props.stops[event.target.value]
    console.log("here", props.stops[event.target.value]);
    setSelectedStop(stop.stop_id);
    props.setMarker(stop.stop_lat, stop.stop_long)
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
        {/* <Autocomplete
          value={selectedStopList}
          onChange={(event, newStop) => {
            console.log("0", newStop);
            setSelectedStopList(newStop);
          }}
          inputValue={autocompleteSelection}
          onInputChange={(event, newInputValue) => {
            setAutocompleteSelection(newInputValue);
          }}
          disablePortal
          id="stop-search"
          options={busStops}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Bus Stop" />
          )}
          // classes={{
          //   root: classes.root,
          // }}
        /> */}
      </Box>
      {console.log("sel", selectedStop)}
      <Box className="stop-info">
        {!selectedStopList && (
          <ul className={classes.stop_options}>
            {props.stops.map((stop, index) => (
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
                  // style={bgColor(stop.stop_id)}
                  value={index}
                  onClick={pickStops}
                >
                  {stop.stop_name}
                </Button>
              </li>
            ))}
          </ul>
        )}

        {selectedStopList && (
          <ul className={classes.stop_option}>
            {props.stops.map((stop) =>
              stop.stop_id === selectedStopList.key ? (
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
                    {stop.stop_name}
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
