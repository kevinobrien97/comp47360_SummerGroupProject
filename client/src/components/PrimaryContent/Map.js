import "./Map.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState } from "react";
// import Journey from "./Journey/Journey";
// import RouteOptions from "./Journey/RouteOptions";
import SideContainer from "./FeaturesCard/SideContainer";

const center = { lat: 53.3473, lng: -6.2591 };
// not setting libraries directly to prevent a bug
const libraries = ["places"];

const Map = (props) => {
  const [allRoutes, setAllRoutes] = useState();
  const [chosenRoute, setChosenRoute] = useState();
  const [mapLoaded, setMapLoaded] = useState(null);
  const [directionsOutput, setDirectionsOutput] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [drawer, setDrawer] = useState(true);
  const [selectedStop, setSelectedStop] = useState(null);

  const setStopMarker = (coords) => {
    setSelectedStop(coords);
    mapLoaded.panTo(coords);
    mapLoaded.setZoom(15);
  };

  const selectedRouteHandler = (selection) => {
    setChosenRoute(selection);
  };

  const toggleDrawer = () => {
    // set the opposite of what it is
    console.log("triggered");
    setDrawer(!drawer);
  };

  // below loads google maps script
  const { isLoaded } = useJsApiLoader({
    // on server must create .env.local file in src to store API key
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return console.log("error loading map");

  async function routeCalculator(or, des, time) {
    console.log("map", time);
    // eslint-disable-next-line no-undef
    const dirServ = new google.maps.DirectionsService();
    const results = await dirServ.route({
      origin: or,
      destination: des,

      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: {
        departureTime: time,
        modes: ["BUS"],
      },
      provideRouteAlternatives: true,
    });
    console.log("res", results);
    setDirectionsOutput(results);
    getRoutesHandler(results.routes);
    setChosenRoute(0);
  }

  const getRoutesHandler = (r) => {
    console.log("app", r);
    setAllRoutes(r);
    setShowRoutes(true);
  };

  function cancelRoute() {
    setDirectionsOutput(null);
    setChosenRoute();
    setAllRoutes();
  }
  function centerMap(latLng) {
    mapLoaded.panTo(latLng);
  }

  function getRoute() {
    if (chosenRoute) {
      return parseInt(chosenRoute);
    }
    return 0;
  }
  function removeRoutes() {
    setShowRoutes(false);
  }

  return (
    <div style={{ height: "calc(100vh - 64px)",
      width: "100%",
      zIndex: "0",
      position: "absolute"
    }}>
      {/* <div className="journey-container"> */}
      {/* {allRoutes && showRoutes && (
          <RouteOptions
            removeRoutes={removeRoutes}
            chosenRoute={chosenRoute}
            options={allRoutes}
            selectedRoute={selectedRouteHandler}
          ></RouteOptions>
        )} */}
      {/* <Journey
          routeCalculator={routeCalculator}
          cancelRoute={cancelRoute}
          centerMap={centerMap}
          // toggleDrawer={toggleDrawer}
        ></Journey> */}
      {/* </div> */}
      {drawer && (
        <div>
          <SideContainer
            removeRoutes={removeRoutes}
            chosenRoute={chosenRoute}
            options={allRoutes}
            selectedRoute={selectedRouteHandler}
            allRoutes={allRoutes}
            showRoutes={showRoutes}
            routeCalculator={routeCalculator}
            cancelRoute={cancelRoute}
            centerMap={centerMap}
            setStopMarker={setStopMarker}
          ></SideContainer>
        </div>
      )}
      <div className="google-map">
        <GoogleMap
          // to do -- center map on users current location
          center={center}
          zoom={13}
          mapContainerStyle={{ width: "100%", height: "calc(100vh - 64px)", position: "relative" }}
          // can remove any default controls - should not need these for our app
          options={{ fullscreenControl: false, streetViewControl: false }}
          onLoad={(mapLoaded) => setMapLoaded(mapLoaded)}
        >
          {/* will need a variant of the below later */}
          <Marker position={selectedStop}></Marker>
          {directionsOutput && (
            <DirectionsRenderer
              directions={directionsOutput}
              routeIndex={getRoute()}
            />
          )}
          {}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
