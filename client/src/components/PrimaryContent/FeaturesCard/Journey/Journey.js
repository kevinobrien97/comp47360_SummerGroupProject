import { React, useState } from "react";
import { ButtonGroup, Button, Box, TextField } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import classes from "./Journey.module.css";
import CachedIcon from "@mui/icons-material/Cached";
import { FaLocationArrow, FaArrowsAltV } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// date-fns
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Warning from "../Warning";

const currentTime = new Date();

const searchLimits = {
  componentRestrictions: { country: ["ie"] },
};

const Journey = (props) => {
  const originRef = useRef("");
  const destinationRef = useRef("");
  const [validTime, setValidTime] = useState(true);
  const [validTimeMessage, setValidTimeMessage] = useState("");

  useEffect(() => {}, [props.dateTime]);

  const triggerRouteCalculator = () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      props.cancelRoute();
      return;
    }
    if (isNaN(props.dateTime)) {
      setValidTimeMessage("Enter a valid time.");
      setValidTime(false);
      props.cancelRoute();
      return;
    }
    if (props.dateTime < currentTime) {
      setValidTime(false);
      setValidTimeMessage(
        "This is not a time machine! Enter a time in the future."
      );
      props.cancelRoute();
      return;
    }

    props.routeCalculator(
      originRef.current.value,
      destinationRef.current.value,
      props.dateTime
    );
  };

  const triggerCancelRoute = () => {
    originRef.current.value = "";
    destinationRef.current.value = "";
    props.cancelRoute();
  };

  function centerMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(panLocation, locationError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    //set zoom
    // function will need to be updated to center to users location (or 'center' variable updated)
  }

  function panLocation(location) {
    // eslint-disable-next-line no-undef
    let latLng = new google.maps.LatLng(
      location.coords.latitude,
      location.coords.longitude
    );
    props.centerMap(latLng);
    // getAddress(location.coords.latitude, location.coords.longitude);
    getAddress(latLng);
  }

  function getAddress(latLng) {
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng: latLng }, (result, status) => {
      // eslint-disable-next-line no-undef
      if (status !== google.maps.GeocoderStatus.OK) {
        console.log(status);
      }
      // eslint-disable-next-line no-undef
      if (status === google.maps.GeocoderStatus.OK && result) {
        console.log(result);
        originRef.current.value = result[0].formatted_address;
      }
    });
  }
  function locationError() {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          alert(
            "To use this feature you must enable location permissions in your settings."
          );
        }
      });
    } else {
      alert("Unable to locate you. You can enter your location manually.");
    }
  }

  function reverseJourney() {
    let temp = originRef.current.value;
    originRef.current.value = destinationRef.current.value;
    destinationRef.current.value = temp;
  }

  function handleTimeChange(value) {
    setValidTime(true);
    setValidTimeMessage("");
    props.setDateTime(value);
    props.setMapError(false);
    props.setMapErrorText("");
  }

  function resetTime() {
    setValidTime(true);
    setValidTimeMessage("");
    props.setDateTime(new Date());
  }

  return (
    <Box className={classes.journey_planner}>
      <div className={classes.journey_options}>
        <div className={classes.origin_destination}>
          <div className={classes.input_options}>
            <Autocomplete options={searchLimits}>
              <input
                onChange={() => {
                  props.setMapError(false);
                  props.setMapErrorText("");
                }}
                className={classes.origin}
                id="origin"
                placeholder="Origin"
                ref={originRef}
              />
            </Autocomplete>
          </div>
          <div className={classes.reverse_button}>
            <Button
              sx={{
                color: "#323336",
              }}
              aria-label="center back"
              size="medium"
              onClick={reverseJourney}
            >
              {<FaArrowsAltV />}
            </Button>
          </div>
          <div className={classes.input_options}>
            <Autocomplete options={searchLimits}>
              <input
                onChange={() => {
                  props.setMapError(false);
                  props.setMapErrorText("");
                }}
                className={classes.destination}
                id="destination"
                placeholder="Destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </div>
        </div>
        <div className={classes.journeyError}>
          {props.mapError && <Warning error={props.mapErrorText}></Warning>}
        </div>
        <div className={classes.stack}>
          <div className={classes.input_options}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Departure Time"
                minDateTime={currentTime}
                value={props.dateTime}
                onChange={handleTimeChange}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </LocalizationProvider>
          </div>
          <Button
            aria-label="center back"
            size="large"
            onClick={resetTime}
            sx={{
              borderColor: "darkgrey",
              color: "black",
              "&:hover": {
                backgroundColor: "#EEEAEA",
              },
            }}
          >
            {<CachedIcon />}
          </Button>
        </div>
        <div className={classes.journeyError}>
          {!validTime && <Warning error={validTimeMessage}></Warning>}
        </div>
      </div>

      <div className={classes.buttons}>
        <ButtonGroup
          sx={{
            backgroundColor: "#d8d8d5",
            "& .MuiButtonGroup-grouped": {
              color: "#323336",
            },
            "& .MuiButtonGroup-grouped:not(:last-of-type)": {
              borderColor: "darkgrey",
            },
          }}
        >
          <Button
            sx={{
              width: "9.5rem",
              "&:hover": {
                backgroundColor: "#EEEAEA",
              },
            }}
            type="submit"
            onClick={triggerRouteCalculator}
          >
            Calculate
          </Button>
          <Button
            sx={{
              width: "9.5rem",
              "&:hover": {
                backgroundColor: "#EEEAEA",
              },
            }}
            type="submit"
            onClick={triggerCancelRoute}
          >
            Cancel
          </Button>
          {/* not using as we do not have ssl setup on deployed version */}
          {/* <Button
            sx={{
              "&:hover": {
                backgroundColor: "#EEEAEA",
              },
            }}
            aria-label="center back"
            size="large"
            onClick={centerMap}
          >
            {<FaLocationArrow />}
          </Button> */}
        </ButtonGroup>
      </div>
    </Box>
  );
};

export default Journey;
