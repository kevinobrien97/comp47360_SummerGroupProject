import "./Map.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useRef } from "react";
import { ButtonGroup, Button, Box, Grid } from "@mui/material";
import { FaLocationArrow } from "react-icons/fa";

const searchLimits = {
  componentRestrictions: { country: ["ie"] },
};

const center = { lat: 53.3473, lng: -6.2591 };
// not setting libraries directly to prevent a bug
const libraries = ["places"];

const Map = (props) => {
  const [mapLoaded, setMapLoaded] = useState(null);
  const [directionsOutput, setDirectionsOutput] = useState(null);
  const [distance, setDistance] = useState("");
 
  const originRef = useRef("");
  const destinationRef = useRef("");

  // below loads google maps script
  const { isLoaded } = useJsApiLoader({
    // on server must create .env.local file in src to store API key
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return console.log("error loading map");

  async function routeCalculator() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    // eslint-disable-next-line no-undef
    const dirServ = new google.maps.DirectionsService();

    const results = await dirServ.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: { modes: ["BUS"] },
      provideRouteAlternatives: true,
    });
    console.log("res", results);
    setDirectionsOutput(results);

    setDistance(results.routes[0].legs[0].distance.text);
    props.onJourney(results.routes);
  }

  function cancelRoute() {
    setDirectionsOutput(null);
    setDistance("");
    props.onCancelJourney();
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  function getRoute() {
    if (props.chosenRoute){
      return parseInt(props.chosenRoute)
    }
    return 0
  }

  return (
    <div>
      <Box className="journey-planner">
        <Grid container direction="row" spacing={2}>
          <Autocomplete options={searchLimits}>
            <input id="origin" placeholder="Origin" ref={originRef} />
          </Autocomplete>
          <Autocomplete options={searchLimits}>
            <input
              id="destination"
              placeholder="Destination"
              ref={destinationRef}
            />
          </Autocomplete>
        </Grid>

        <ButtonGroup>
          <Button type="submit" onClick={routeCalculator}>
            Calculate Route
          </Button>
          <Button type="submit" onClick={cancelRoute}>
            Cancel
          </Button>
          {/* will need to change this to users location at some stage */}
          <Button
            aria-label="center back"
            size="large"
            onClick={() => mapLoaded.panTo(center)}
          >
            {<FaLocationArrow />}
          </Button>
        </ButtonGroup>
      </Box>
      <div className="google-map">
        <GoogleMap
          // to do -- center map on users current location
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          // can remove any default controls - should not need these for our app
          options={{ fullscreenControl: false, streetViewControl: false }}
          onLoad={(mapLoaded) => setMapLoaded(mapLoaded)}
        >
          {/* will need a variant of the below later */}
          {/* <Marker position={center}></Marker> */}
          {directionsOutput && (
            
            <DirectionsRenderer directions={directionsOutput} routeIndex={getRoute()} />
          )}
          {}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
