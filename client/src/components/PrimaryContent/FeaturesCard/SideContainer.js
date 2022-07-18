import { React, useState, useCallback, useEffect } from "react";
import "./SideContainer.css";
import MiniNav from "./MiniNav.js";
import Journey from "./Journey";
import RouteOptions from "./RouteOptions";
import Nearest from "./Nearest";
import Route from "./Route";
import Stop from "./Stop";
import Favourites from "./Favourites";
import LoadingSpinner from "../../LoadingSpinner";

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
        {sidebarOption.stop && props.isLoading && (
          <LoadingSpinner text={"Loading Stops..."}></LoadingSpinner>
        )}
        {sidebarOption.stop && !props.isLoading && (
          <Stop stops={props.stops} setMarker={setMarker}></Stop>
        )}
        {sidebarOption.favourites && props.isLoading && (
          <LoadingSpinner text={"Loading Stops..."}></LoadingSpinner>
        )}
        {sidebarOption.favourites && !props.isLoading && (
          <Favourites stops={props.stops} setMarker={setMarker}></Favourites>
        )}
      </div>
    </div>
  );
};
export default SideContainer;
