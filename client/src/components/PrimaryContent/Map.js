import { React, useState, useEffect } from "react";
import classes from "./Map.module.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";

import SideContainer from "./FeaturesCard/SideContainer";
import axios from "axios";

const center = { lat: 53.3473, lng: -6.2591 };
// not setting libraries directly to prevent a bug
const libraries = ["places"];

const Map = (props) => {
  const [stops, setStops] = useState({});
  const [routes, setRoutes] = useState({});
  const [routesIsLoading, setRoutesIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [routeMarkers, setRouteMarkers] = useState([]);
  const [currentClickedMarker, setCurrentClickedMarker] = useState(null);
  const [allRoutes, setAllRoutes] = useState();
  const [chosenRoute, setChosenRoute] = useState();
  const [mapLoaded, setMapLoaded] = useState(null);
  const [directionsOutput, setDirectionsOutput] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedStopMarker, setSelectedStopMarker] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [mapErrorText, setMapErrorText] = useState("");
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [routeStops, setRouteStops] = useState({});
  const [routeStopsLoading, setRouteStopsLoading] = useState(false);

  useEffect(() => {
    const fetchStopsData = async () => {
      setIsLoading(true);
      try {
        // fetch returns a promise
        // is asynchronous
        const response = await fetch("http://54.157.240.210/api/stops/");
        // const response = await fetch("http://127.0.0.1:8000/api/stops/");
        if (!response.ok) {
          // wont continue with next line if error thrown
          throw new Error("Something went wrong loading stops");
        }
        const data = await response.json();
        setStops(data);
      } catch (error) {
        console.log(error.message);
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
        const response = await fetch("http://54.157.240.210/api/routes/");
        // const response = await fetch("http://127.0.0.1:8000/api/routes/");
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
        console.log(error.message);
      }
      setRoutesIsLoading(false);
    };
    fetchRoutesData();
  }, []);

  useEffect(() => {
    const fetchRouteStopsData = async () => {
      setRouteStopsLoading(true);
      try {
        // fetch returns a promise
        // is asynchronous
        const response = await fetch(
          // `http://127.0.0.1:8000/api/routestops/`
          `http://54.157.240.210/api/routestops/`
        );
        if (!response.ok) {
          // wont continue with next line if error thrown
          throw new Error("Something went wrong loading routes");
        }
        const allStops = await response.json();
        setRouteStops(allStops);
      } catch (error) {
        console.log(error.message);
        // setError(error.message);
      }
      setRouteStopsLoading(false);
    };
    fetchRouteStopsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (!isLoaded) return console.log("loading map");

  async function routeCalculator(or, des, time) {
    // set loading state true initially
    setPredictionsLoading(true);
    try {
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
      customiseResults(results, time);
      getRoutesHandler(results.routes);
      setChosenRoute(0);
    } catch (error) {
      // remove current route details
      cancelRoute();
      setPredictionsLoading(false);
      // set error text
      if (error.code === "ZERO_RESULTS") {
        setMapErrorText("No bus routes were found for this trip.");
      } else if (error.code === "NOT_FOUND") {
        setMapErrorText("Enter a valid origin and destination.");
      }
      // catch all
      else {
        setMapErrorText("Something went wrong calculating the journey.");
      }
      // display the error
      setMapError(true);
    }
  }

  // middleware function to amend the contents of the returned result, to include our predictions, as well as the resulting total journey time
  async function customiseResults(results, time) {
    for (let i = 0; i < results.routes.length; i++) {
      let totalJourneyTime = 0;
      for (let j = 0; j < results.routes[i].legs[0].steps.length; j++) {
        // will not show departure time if the route is only walking (no transit)
        if (!results.routes[i].legs[0].departure_time) {
          totalJourneyTime += parseInt(
            results.routes[i].legs[0].duration.value / 60
          );
        }
        // if not just walking
        else {
          if (results.routes[i].legs[0].steps[j].travel_mode === "WALKING") {
            totalJourneyTime += parseInt(
              results.routes[i].legs[0].steps[j].duration.value / 60
            );
          } else {
            // below is a check to ensure each of the elements are returned, and if not the google prediction is used. For example, if line.short_name does not exist
            // it is the case that the bus is outside the dublin bus network
            // some of the below checks will never fail but this acts as a semse check in any case
            if (results.routes[i].legs[0].steps[j].transit) {
              const transitDetails = results.routes[i].legs[0].steps[j].transit;
              if (
                transitDetails.line.short_name &&
                transitDetails.line.name &&
                transitDetails.arrival_stop.name &&
                transitDetails.departure_stop.name &&
                transitDetails.num_stops
              ) {
                const route_id = transitDetails.line.short_name;
                const headsign = transitDetails.line.name;
                const start_stop = transitDetails.departure_stop.name;
                const end_stop = transitDetails.arrival_stop.name;
                const total_stops = transitDetails.num_stops;
                // iniitally want error deleted if one was there previously
                //   setError(null);
                //   if (predictionPossible) {
                try {
                  const res = await axios.get(
                    "http://54.157.240.210/api/getPrediction/",
                    // "http://127.0.0.1:8000/api/getPrediction/",
                    {
                      // "http://3.90.184.148/api/token/",{
                      params: {
                        route_id: route_id,
                        headsign: headsign,
                        start_stop: start_stop,
                        end_stop: end_stop,
                        total_stops: total_stops,
                        timestamp: time.getTime(),
                      },
                    }
                  );
                  if (res.data.result === "None") {
                    // journey time was not returned - google time will be used
                    totalJourneyTime += parseInt(
                      results.routes[i].legs[0].steps[j].duration.value / 60
                    );
                  } else {
                    const prediction = res.data.result;
                    // console.log(prediction / 60);
                    totalJourneyTime += prediction / 60;
                    // add prediction to object
                    results.routes[i].legs[0].steps[j].shuttleup_prediction =
                      prediction / 60;
                  }
                  // console.log(res);
                } catch (e) {
                  console.log(e);
                  // setPredictionPossible(false);
                }
              } else {
                totalJourneyTime += parseInt(
                  results.routes[i].legs[0].steps[j].duration.value / 60
                );
              }
            } else {
              totalJourneyTime += parseInt(
                results.routes[i].legs[0].steps[j].duration.value / 60
              );
            }
          }
        }
      }
      // add total journey time to object
      results.routes[i].legs[0].total_journey_time =
        Math.round(totalJourneyTime);
      // console.log("time", totalJourneyTime, i);
    }
    setPredictionsLoading(false);
    // new object passed to children
    setDirectionsOutput(results);
  }

  const getRoutesHandler = (r) => {
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
          predictionsLoading={predictionsLoading}
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
          setUserLoggedOut={props.setUserLoggedOut}
          toggleLogIn={props.toggleLogIn}
          toggleRegister={props.toggleRegister}
          mapError={mapError}
          setMapError={setMapError}
          setDirectionsOutput={setDirectionsOutput}
          mapErrorText={mapErrorText}
          setMapErrorText={setMapErrorText}
          routeStops={routeStops}
          routeStopsLoading={routeStopsLoading}
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
          {routeMarkers && (
            <div>
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
                      options={{ maxWidth: 250 }}
                      onCloseClick={() => {
                        setCurrentClickedMarker(null);
                      }}
                    >
                      <div>
                        <header>
                          <h4>{stop.stop_name}</h4>
                        </header>
                        <div>
                          Stop on route {stop.route_short_name} from{" "}
                          {stop.trip_headsign}
                        </div>
                      </div>
                    </InfoWindow>
                  ) : null}
                </Marker>
              ))}
            </div>
          )}
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
