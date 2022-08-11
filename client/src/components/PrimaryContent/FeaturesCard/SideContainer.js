import { React, useState } from "react";
import classes from "./SideContainer.module.css";
import MiniNav from "./MiniNav.js";
import Journey from "./Journey/Journey";
import RouteOptionsSetUp from "./Journey/RouteOptionsSetUp";
import Route from "./Routes/Route";
import Stops from "./Stops/Stops";
import LoadingSpinner from "../../LoadingSpinner";
import { IconButton } from "@mui/material";
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IconContext } from "react-icons";

const currentTime = new Date();
const SideContainer = (props) => {

  const [dateTime, setDateTime] = useState(currentTime);
  const [sidebarOption, setSidebarOption] = useState({
    journey: true,
    route: false,
    stop: false,
  });

  const [container, setContainer] = useState(true);

  function setMarker(lat, long) {
    const pos = { lat: lat, lng: long };
    props.setStopMarker(pos);
  }

  return (
    <div className={classes.side_container}>
      <div className={classes.side_main}>
        <MiniNav
          setSidebarOption={setSidebarOption}
          setRouteMarkers={props.setRouteMarkers}
          setSelectedStopMarker={props.setSelectedStopMarker}
          reCenter={props.reCenter}
          setDirectionsOutput={props.setDirectionsOutput}
        />
        {container && (
          <div>
            {sidebarOption.journey && (
              <div>
                <Journey
                  routeCalculator={props.routeCalculator}
                  cancelRoute={props.cancelRoute}
                  centerMap={props.centerMap}
                  mapError={props.mapError}
                  setMapError={props.setMapError}
                  mapErrorText={props.mapErrorText}
                  setMapErrorText={props.setMapErrorText}
                  dateTime={dateTime}
                  setDateTime={setDateTime}
                ></Journey>

                {props.allRoutes && props.showRoutes && (
                  <div>
                    {props.predictionsLoading ? (<div><LoadingSpinner text={"Calculating Journey..."}></LoadingSpinner></div>):(
                  <div>
                    <RouteOptionsSetUp
                      dateTime={dateTime}
                      removeRoutes={props.removeRoutes}
                      chosenRoute={props.chosenRoute}
                      options={props.allRoutes}
                      selectedRoute={props.selectedRoute}
                    ></RouteOptionsSetUp>
                  </div>)}
                  </div>
                )}
              </div>
            )}
            {sidebarOption.route && props.routesIsLoading && props.routeStopsLoading && (
              <LoadingSpinner text={"Loading Routes..."}></LoadingSpinner>
            )}
            {sidebarOption.route && !props.routesIsLoading && !props.routeStopsLoading && (
              <Route
                routes={props.routes}
                setRouteMarkers={props.setRouteMarkers}
                reCenter={props.reCenter}
                setUserLoggedOut={props.setUserLoggedOut}
                toggleLogIn={props.toggleLogIn}
                toggleRegister={props.toggleRegister}
                routeStops={props.routeStops}
              ></Route>
            )}
            {/* {sidebarOption.stop && props.isLoading && (
              <LoadingSpinner text={"Loading Stops..."}></LoadingSpinner>
            )}
            {sidebarOption.stop && !props.isLoading && (
              <Stop stops={props.stops} setMarker={setMarker}></Stop>
            )} */}
            {sidebarOption.stop && props.isLoading && (
              <LoadingSpinner text={"Loading Stops..."}></LoadingSpinner>
            )}
            {sidebarOption.stop && !props.isLoading && (
              <Stops
                stops={props.stops}
                setMarker={setMarker}
                setSelectedStopMarker={props.setSelectedStopMarker}
                reCenter={props.reCenter}
                setUserLoggedOut={props.setUserLoggedOut}
                toggleLogIn={props.toggleLogIn}
                toggleRegister={props.toggleRegister}
              ></Stops>
            )}
          </div>
        )}
      </div>
      <div className={classes.toggleButton}>
        <IconButton
          onClick={() => {
            setContainer(!container);
          }}
          style={{
            width: "3rem",
            height: "1.5rem",
            // backgroundColor: "#F1B23E",
            // borderRadius: "10px",
          }}
        >
          <IconContext.Provider value={{ size: "2rem", color: "white" }}>
            {!container ? (
              <MdOutlineKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowUp />
            )}{" "}
          </IconContext.Provider>
        </IconButton>
      </div>
    </div>
  );
};
export default SideContainer;
