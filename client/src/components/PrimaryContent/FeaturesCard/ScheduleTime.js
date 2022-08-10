import { React, useState } from "react";
import classes from "./Stops_routes.module.css";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { IconContext } from "react-icons";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";

const ScheduleTime = (props) => {
  const day = new Date();
  const [showButton, setShowButton] = useState(false);
  const [dropdownDay, setDropdownDay] = useState(day.getDay(0));
  const [drowdownTime, setDropdownTime] = useState(day);

  const handleDateChange = (event) => {
    // props.setDaySelection(event.target.value);
    setDropdownDay(event.target.value);
    setShowButton(true);
  };

  const handleTimeChange = (val) => {
    // props.setTime(val);
    setDropdownTime(val);
    setShowButton(true);
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
            value={dropdownDay}
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
            value={drowdownTime}
            ampm={false}
            onChange={handleTimeChange}
            renderInput={(params) => (
              <TextField sx={{ width: "8rem" }} {...params} />
            )}
          />
        </LocalizationProvider>
        {showButton ? (
          <Button
            sx={{
              width: "1rem",
              "&:hover": {
                backgroundColor: "#EEEAEA",
              },
            }}
            aria-label="center back"
            onClick={() => {
              props.setTimeClicked(true);
              setShowButton(false);
              props.setDaySelection(dropdownDay);
              props.setTime(drowdownTime);
            }}
          >
            {
              <IconContext.Provider
                value={{ size: "1.5rem", color: "#F1B23E" }}
              >
                <BsFillCheckCircleFill />{" "}
              </IconContext.Provider>
            }
          </Button>
        ) : (
          <Button disabled aria-label="center back">
            {
              <IconContext.Provider value={{ size: "1.5rem" }}>
                <AiOutlineCheckCircle />{" "}
              </IconContext.Provider>
            }
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScheduleTime;
