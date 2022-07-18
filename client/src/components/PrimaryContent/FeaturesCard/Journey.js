import { ButtonGroup, Button, Box, Grid, TextField } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import "./Journey.css";
import CachedIcon from "@mui/icons-material/Cached";
import { FaEllipsisV } from "react-icons/fa";
import { FaLocationArrow, FaArrowsAltV } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// date-fns
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const searchLimits = {
  componentRestrictions: { country: ["ie"] },
};

const currentTime = new Date();

const Journey = (props) => {
  const originRef = useRef("");
  const destinationRef = useRef("");
  const [dateTime, setDateTime] = useState(currentTime);

  useEffect(() => {}, [dateTime]);

  const triggerRouteCalculator = () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    props.routeCalculator(
      originRef.current.value,
      destinationRef.current.value,
      dateTime
    );
  };

  const triggerCancelRoute = () => {
    originRef.current.value = "";
    destinationRef.current.value = "";
    props.cancelRoute();
  };

  // const panMap = () => {
  //   props.centerMap();
  // };

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
    setDateTime(value);
  }
  function resetTime() {
    setDateTime(new Date());
  }

  return (
    <div className="journey1-container">
      <Box className="journey-planner">
        <div className="journey-options">
          <div className="origin-destination">
            <div className="input-options">
              <Autocomplete options={searchLimits}>
                <input id="origin" placeholder="Origin" ref={originRef} />
              </Autocomplete>
            </div>
            <div className="reverse-button">
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
            <div className="input-options">
              <Autocomplete options={searchLimits}>
                <input
                  id="destination"
                  placeholder="Destination"
                  ref={destinationRef}
                />
              </Autocomplete>
            </div>
          </div>
          <div className="timing">
            <div className="input-options">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Departure Time"
                  minDateTime={currentTime}
                  value={dateTime}
                  onChange={handleTimeChange}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
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
        </div>

        <div className="buttons">
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
                "&:hover": {
                  backgroundColor: "#EEEAEA",
                },
              }}
              type="submit"
              onClick={triggerCancelRoute}
            >
              Cancel
            </Button>
            {/* will need to change this to users location at some stage */}
            <Button
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
            </Button>
            <Button
              aria-label="center back"
              size="large"
              onClick={props.toggleDrawer}
              sx={{
                borderColor: "darkgrey",
                color: "black",
                "&:hover": {
                  backgroundColor: "#EEEAEA",
                },
              }}
            >
              {<FaEllipsisV />}
            </Button>
          </ButtonGroup>
        </div>
      </Box>
    </div>
  );
};

export default Journey;
