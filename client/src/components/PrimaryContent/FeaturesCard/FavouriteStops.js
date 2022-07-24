import { React, useState } from "react";
import {
  FormControl,
  InputLabel,
  IconButton,
  Select,
  Accordion,
  MenuItem,
  AccordionSummary,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import classes from "./Favourites.module.css";
import { FaTrash } from "react-icons/fa";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StopDetails from "./StopDetails";

const FavouriteStops = (props) => {
  const day = new Date();
  const [daySelection, setDaySelection] = useState(day.getDay(0));
  const [time, setTime] = useState(day);

  console.log(day.toTimeString().split(" ")[0]);
  const removeStop = (idx) => {
    const stop = props.stops[idx];
    console.log(stop);
    // update stopIDList
    props.setStopsList(props.stops.filter((item) => item !== stop));
    // call method to delete from database
    props.deleteStop(stop.stop_id);
  };
  const handleDateChange = (event) => {
    setDaySelection(event.target.value);
  };

  const handleTimeChange = (val) => {
    setTime(val);
  };

  return (
    <div className={classes.favouriteStops}>
      <div className={classes.scheduleTime}>
      <FormControl sx={{  minWidth: 120, paddingRight: "1rem" }}>
        <InputLabel id="weekday-label">Weekday</InputLabel>
        <Select
          labelId="dayselector"
          id="dayselector"
          value={daySelection}
          onChange={handleDateChange}
          label="Weekday"
        >
          <MenuItem value={1}>Monday</MenuItem>
          <MenuItem value={2}>Tuesday</MenuItem>
          <MenuItem value={3}>Wednesday</MenuItem>
          <MenuItem value={4}>Thursday</MenuItem>
          <MenuItem value={5}>Friday</MenuItem>
          <MenuItem value={6}>Saturday</MenuItem>
          <MenuItem value={0}>Sunday</MenuItem>
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="Time"
          value={time}
          ampm={false}
          onChange={handleTimeChange}
          
          renderInput={(params) => <TextField sx={{width: "10rem"}} {...params} />}
        />
      </LocalizationProvider>
      </div>
      <h3
        style={{
          marginTop: "0.75rem",
          marginBottom: "0.75rem",
          textAlign: "center",
        }}
      >
        Your Favourite Stops
      </h3>
      {props.stops[0] ? (
        <div>
          {props.stops.map((stop, index) => (
            <div
              key={stop.stop_id}
              style={{
                minWidth: "100%",
                width: "25rem",
                borderTop: "0.05rem solid lightgrey",
              }}
            >
              <Accordion
                disableGutters={true}
                onClick={() => props.setMarker(stop.stop_lat, stop.stop_long)}
              >
                <AccordionSummary
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "25rem",
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  // value={index}
                  // onClick={() => {
                  //   props.selectedRoute(index);
                  // }}
                >
                  <div
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      paddingLeft: "0.30rem",
                    }}
                  >
                    {stop.stop_name}
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                    }}
                  >
                    <IconButton onClick={(e) => removeStop(index)} size="sm">
                      <FaTrash />
                    </IconButton>
                  </div>
                </AccordionSummary>
                <StopDetails stop={stop} time={time} daySelection={daySelection}></StopDetails>
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>You haven't selected any favourite stops yet.</p>
          <p>Add stops with the search bar to stay updated!</p>
        </div>
      )}
    </div>
    //   {console.log("bug", props.stops)}
    //   {props.stops[0] ? (
    //     <ul className={classes.stop_options}>
    //       {props.stops.map((stop, index) => (
    //         <li key={stop.stop_id}>
    //           <Button
    //             sx={{
    //               backgroundColor: "black",
    //               width: 330,
    //               color: "white",
    //               border: 3,
    //               borderRadius: 5,
    //               padding: 1,
    //               "&:hover": {
    //                 backgroundColor: "#fff",
    //                 color: "black",
    //               },
    //             }}
    //             // style={bgColor(stop.stop_id)}
    //             value={index}
    //             onClick={pickStops}
    //           >
    //             {stop.stop_name}
    //           </Button>
    //           <IconButton onClick={(e) => removeStop(index)} size="sm">
    //             <FaTrash />
    //           </IconButton>
    //         </li>
    //       ))}
    //     </ul>
    //   )
    // </div>
  );
};

export default FavouriteStops;
