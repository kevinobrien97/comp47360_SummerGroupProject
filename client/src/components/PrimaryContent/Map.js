import { React, useState, useEffect } from "react";
import classes from "./Map.module.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";

// import Journey from "./Journey/Journey";
// import RouteOptions from "./Journey/RouteOptions";
import SideContainer from "./FeaturesCard/SideContainer";

const center = { lat: 53.3473, lng: -6.2591 };
// not setting libraries directly to prevent a bug
const libraries = ["places"];

const Map = (props) => {
  const [stops, setStops] = useState({});
  const [routes, setRoutes] = useState({});
  const [routesIsLoading, setRoutesIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeMarkers, setRouteMarkers] = useState([]);
  const [currentClickedMarker, setCurrentClickedMarker] = useState(null);

  useEffect(() => {
    const fetchStopsData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        // fetch returns a promise
        // is asynchronous
        const response = await fetch("http://127.0.0.1:8000/api/stops/");
        if (!response.ok) {
          // wont continue with next line if error thrown
          throw new Error("Something went wrong loading stops");
        }
        const data = await response.json();
        setStops(data);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    fetchStopsData();
  }, []);

  useEffect(() => {
    const fetchRoutesData = async () => {
      // setError(null);
      setRoutesIsLoading(true);
      try {
        // fetch returns a promise
        // is asynchronous
        const response = await fetch("http://127.0.0.1:8000/api/routes/");
        if (!response.ok) {
          // wont continue with next line if error thrown
          throw new Error("Something went wrong loading routes");
        }
        const allRoutes = await response.json();
        // sorting alphanumerically but the bus route
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base",
        });
        const sorted = allRoutes.sort((a, b) => {
          return collator.compare(a.route_short_name, b.route_short_name);
          // return (a.route_short_name).localeCompare((b.route_short_name), undefined, {
          //   numeric: true,
          //   sensitivity: "base",
          // });
        });
        setRoutes(sorted);
      } catch (error) {
        setError(error.message);
      }
      setRoutesIsLoading(false);
    };
    fetchRoutesData();
  }, []);

  const [allRoutes, setAllRoutes] = useState();
  const [chosenRoute, setChosenRoute] = useState();
  const [mapLoaded, setMapLoaded] = useState(null);
  const [directionsOutput, setDirectionsOutput] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedStopMarker, setSelectedStopMarker] = useState(null);

  const setStopMarker = (coords) => {
    setSelectedStopMarker(coords);
    mapLoaded.panTo(coords);
    mapLoaded.setZoom(15);
  };

  const reCenter = () => {
    mapLoaded.setZoom(13);
    mapLoaded.panTo(center);
  };

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
    <div
      style={{
        // manually calc height to take up space minus navbar space
        height: "calc(100vh - 64px)",
        width: "100%",
        zIndex: "0",
        position: "absolute",
      }}
    >
      <div>
        <SideContainer
          reCenter={reCenter}
          isLoading={isLoading}
          routesIsLoading={routesIsLoading}
          stops={stops}
          routes={routes}
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
          setRouteMarkers={setRouteMarkers}
          setSelectedStopMarker={setSelectedStopMarker}
        ></SideContainer>
      </div>
      <div className={classes.google_map}>
        <GoogleMap
          // to do -- center map on users current location
          onClick={() => setCurrentClickedMarker(null)}
          center={center}
          zoom={13}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
          // can remove any default controls - should not need these for our app
          options={{ fullscreenControl: false, streetViewControl: false }}
          onLoad={(mapLoaded) => setMapLoaded(mapLoaded)}
        >
          ({/* mapping the markers set by clicking a route */}
          {routeMarkers.map((stop, index) => (
            <Marker
              position={{ lat: stop.stop_lat, lng: stop.stop_long }}
              key={stop.stop_id}
              onClick={() => {
                setCurrentClickedMarker(stop.stop_id);
              }}
            >
              {currentClickedMarker === stop.stop_id ? (
                <InfoWindow
                options= {{maxWidth : 250 }}
                  onCloseClick={() => {
                    setCurrentClickedMarker(null);
                  }}
                >
                  <body>
                    <header><h4>{stop.stop_name}</h4></header>
                    <div>
                      Stop{" "}on route{" "}{stop.route_short_name}{" "}from{" "}
                      {stop.trip_headsign}
                    </div>
                  </body>
                </InfoWindow>
              ) : null}
            </Marker>
          ))}
          )<Marker position={selectedStopMarker}></Marker>
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
