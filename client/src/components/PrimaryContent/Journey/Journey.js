import { ButtonGroup, Button, Box, Grid } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import "./Journey.css";
import { FaLocationArrow } from "react-icons/fa";
import { useRef } from "react";

const searchLimits = {
  componentRestrictions: { country: ["ie"] },
};

const Journey = (props) => {
  const originRef = useRef("");
  const destinationRef = useRef("");

  const triggerRouteCalculator = () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    props.routeCalculator(
      originRef.current.value,
      destinationRef.current.value
    );
  };

  const triggerCancelRoute = () => {
    originRef.current.value = "";
    destinationRef.current.value = "";
    props.cancelRoute();
  };

  const panMap = () => {
    props.centerMap();
  };

  return (
    <div>
      <div className="journey-headings">
        <h3>From: </h3>
        <h3>To: </h3>
      </div>
      <Box className="journey-planner">
        <Grid container direction="column" spacing={2}>
          <div className="origin-select">
            <Autocomplete options={searchLimits}>
              <input id="origin" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </div>
          <div className="destination-select">
            <Autocomplete options={searchLimits}>
              <input
                id="destination"
                placeholder="Destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </div>
        </Grid>

        <ButtonGroup>
          <Button type="submit" onClick={triggerRouteCalculator}>
            Calculate Route
          </Button>
          <Button type="submit" onClick={triggerCancelRoute}>
            Cancel
          </Button>
          {/* will need to change this to users location at some stage */}
          <Button aria-label="center back" size="large" onClick={panMap}>
            {<FaLocationArrow />}
          </Button>
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default Journey;
