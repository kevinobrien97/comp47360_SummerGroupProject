import { React } from "react";
import classes from "./Stops/Favourites.module.css";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const ScheduleTime = (props) => {

    const handleDateChange = (event) => {
        props.setDaySelection(event.target.value);
      };
    
      const handleTimeChange = (val) => {
        props.setTime(val);
      };
  return (
    <div>
      <h4 style={{ textAlign: "center" }}>Set Schedule Time</h4>
      <div className={classes.scheduleTime}>
        <FormControl sx={{ minWidth: 120, paddingRight: "1rem" }}>
          <InputLabel id="weekday-label">Weekday</InputLabel>
          <Select
            labelId="dayselector"
            id="dayselector"
            value={props.daySelection}
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
            value={props.time}
            ampm={false}
            onChange={handleTimeChange}
            renderInput={(params) => (
              <TextField sx={{ width: "10rem" }} {...params} />
            )}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default ScheduleTime;
