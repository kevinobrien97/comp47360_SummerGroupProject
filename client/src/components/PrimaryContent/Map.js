import "./Map.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState } from "react";
import Journey from "./Journey/Journey";
import RouteOptions from "./Journey/RouteOptions";

const center = { lat: 53.3473, lng: -6.2591 };
// not setting libraries directly to prevent a bug
const libraries = ["places"];

const Map = (props) => {
  const [allRoutes, setAllRoutes] = useState();
  const [chosenRoute, setChosenRoute] = useState();
  const [mapLoaded, setMapLoaded] = useState(null);
  const [directionsOutput, setDirectionsOutput] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [distance, setDistance] = useState("");
  const selectedRouteHandler = (selection) => {
    setChosenRoute(selection);
  };
  // below loads google maps script
  const { isLoaded } = useJsApiLoader({
    // on server must create .env.local file in src to store API key
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return console.log("error loading map");

  async function routeCalculator(or, des) {
    // eslint-disable-next-line no-undef
    const dirServ = new google.maps.DirectionsService();
    const results = await dirServ.route({
      origin: or,
      destination: des,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: { modes: ["BUS"] },
      provideRouteAlternatives: true,
    });
    console.log("res", results);
    setDirectionsOutput(results);
    setDistance(results.routes[0].legs[0].distance.text);
    getRoutesHandler(results.routes);
    setChosenRoute(0);
  }

  const getRoutesHandler = (r) => {
    console.log("app", r);

    const transformedRoutes = r.map((route, index) => {
      return {
        id: index,
        time: route.legs[0].arrival_time.text,
      };
    });
    setAllRoutes(transformedRoutes);
    setShowRoutes(true);
  };

  function cancelRoute() {
    setDirectionsOutput(null);
    setDistance("");
    setChosenRoute();
    setAllRoutes();
  }

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
    let latLng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    mapLoaded.panTo(latLng);
  }

  function locationError() {
    if(navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'denied') {
          alert('To use this feature you must enable location permissions in your settings.')
        }
      })
    } else {
      alert('Unable to locate you. You can enter your location manually.')
    }
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
    <div>
      {/* <div className={`journey-container ${showRoutes ? 'journey_back_drop' : ''}`}> */}
      <div className="journey-container">
        {allRoutes && showRoutes && (
          <RouteOptions
            removeRoutes={removeRoutes}
            chosenRoute={chosenRoute}
            options={allRoutes}
            selectedRoute={selectedRouteHandler}
          ></RouteOptions>
        )}
        <Journey
          routeCalculator={routeCalculator}
          cancelRoute={cancelRoute}
          centerMap={centerMap}
        ></Journey>
      </div>
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
