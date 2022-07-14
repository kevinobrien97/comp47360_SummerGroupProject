import { React, useState, useCallback, useEffect } from "react";
import "./SideContainer.css";
import MiniNav from "./MiniNav.js";
import Journey from "./Journey";
import RouteOptions from "./RouteOptions";
import Nearest from "./Nearest";
import Route from "./Route";
import Stop from "./Stop";
import Favourites from "./Favourites";

const SideContainer = (props) => {
  const [sidebarOption, setSidebarOption] = useState({
    journey: true,
    nearest: false,
    route: false,
    stop: false,
    favourites: false,
  });

  function routeCalculator(or, des, time) {
    props.routeCalculator(or, des, time);
  }

  function cancelRoute() {
    props.cancelRoute();
  }

  function centerMap(latLng) {
    props.centerMap(latLng);
  }

  function setMarker(lat, long) {
    const pos = { lat: lat, lng: long };
    props.setStopMarker(pos);
  }

  function removeRoutes() {
    props.removeRoutes();
  }

  let chosenRoute = props.chosenRoute;

  let allRoutes = props.allRoutes;

  function selectedRoute(sel) {
    props.selectedRoute(sel);
  }

  const [stops, setStops] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStopsData = useCallback(async () => {
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
      console.log(data[0]);
      setStops(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStopsData();
  }, [fetchStopsData]);

  // handling possible output states
  let content = <p>Sending request...</p>;
  if (Object.keys(stops).length > 0) {
    content = <p>{stops["stop_name"]}</p>;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading data...</p>;
  }

  return (
    <div className="side-container">
      <MiniNav setSidebarOption={setSidebarOption} />

      <div className="display">
        {sidebarOption.journey && (
          <div>
            <Journey
              routeCalculator={routeCalculator}
              cancelRoute={cancelRoute}
              centerMap={centerMap}
            ></Journey>

            {props.allRoutes && props.showRoutes && (
              <RouteOptions
                removeRoutes={removeRoutes}
                chosenRoute={chosenRoute}
                options={allRoutes}
                selectedRoute={selectedRoute}
              ></RouteOptions>
            )}
          </div>
        )}
        {sidebarOption.nearest && <Nearest></Nearest>}
        {sidebarOption.route && <Route></Route>}
        {sidebarOption.stop && !isLoading && (
          <Stop stops={stops} setMarker={setMarker}></Stop>
        )}
        {sidebarOption.favourites && <Favourites></Favourites>}
      </div>
    </div>
  );
};
export default SideContainer;
