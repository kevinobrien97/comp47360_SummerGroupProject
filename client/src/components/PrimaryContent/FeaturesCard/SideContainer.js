import { React, useState } from "react";
import classes from "./SideContainer.module.css";
import MiniNav from "./MiniNav.js";
import Journey from "./Journey";
import RouteOptions from "./RouteOptions";
import Nearest from "./Nearest";
import Route from "./Route";
import Stop from "./Stop";
import Favourites from "./Favourites";
import LoadingSpinner from "../../LoadingSpinner";
import { IconButton } from "@mui/material";
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IconContext } from "react-icons";

const SideContainer = (props) => {
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
        />
        {container && (
          <div>
            {sidebarOption.journey && (
              <div>
                <Journey
                  routeCalculator={props.routeCalculator}
                  cancelRoute={props.cancelRoute}
                  centerMap={props.centerMap}
                ></Journey>

                {props.allRoutes && props.showRoutes && (
                  <div>
                    <RouteOptions
                      removeRoutes={props.removeRoutes}
                      chosenRoute={props.chosenRoute}
                      options={props.allRoutes}
                      selectedRoute={props.selectedRoute}
                    ></RouteOptions>
                  </div>
                )}
              </div>
            )}
            {sidebarOption.nearest && <Nearest></Nearest>}
            {sidebarOption.route && props.routesIsLoading && (
              <LoadingSpinner text={"Loading Routes..."}></LoadingSpinner>
            )}
            {sidebarOption.route && !props.routesIsLoading && (
              <Route
                routes={props.routes}
                setRouteMarkers={props.setRouteMarkers}
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
              <Favourites
                stops={props.stops}
                setMarker={setMarker}
              ></Favourites>
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
