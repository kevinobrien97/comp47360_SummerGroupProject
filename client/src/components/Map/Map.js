import "./Map.css";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";
import {
  ButtonGroup,
  Button,
  Box,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import { FaLocationArrow } from "react-icons/fa";

const center = { lat: 53.3473, lng: -6.2591 };

const Map = () => {
  const [mapLoaded, setMapLoaded] = useState(null) 
  // below loads google maps script
  const { isLoaded } = useJsApiLoader({
    // on server must create .env.local file in src to store API key
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });
  if (!isLoaded) return console.log("error loading map");
  return (
    <div>
    <Box className="journey-planner">
      <Grid container direction="row" spacing={2}>
        <TextField
          id="origin"
          placeholder="Origin"
          variant="outlined"
        ></TextField>
        <TextField
          id="destination"
          placeholder="Destination"
          variant="outlined"
        ></TextField>
      </Grid>

      <ButtonGroup>
        <Button type="submit">Calculate Route</Button>
        <Button type="submit">Cancel</Button>
        {/* will need to change this to users location at some stage */}
        <Button
            aria-label='center back'
            
         size="large"
            onClick={() => mapLoaded.panTo(center)}
          >{<FaLocationArrow />}</Button>
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
        {}
        
      </GoogleMap>
    </div>
    </div>
  );
};

export default Map;
