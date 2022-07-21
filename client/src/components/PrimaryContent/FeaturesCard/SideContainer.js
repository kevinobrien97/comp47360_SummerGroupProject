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
import { Button } from "@mui/material";

const SideContainer = (props) => {
  const [sidebarOption, setSidebarOption] = useState({
    journey: true,
    route: false,
    stop: false,
    favourites: false,
  });

  const [container, setContainer] = useState(true);

  const toggleContainer = () => {
    // set the opposite of what it is
    console.log("triggered");
    setContainer(!container);
  };

  function setMarker(lat, long) {
    const pos = { lat: lat, lng: long };
    props.setStopMarker(pos);
  }

  return (
    <div className={classes.side_container}>
      <div className={classes.side_main}>
        <MiniNav setSidebarOption={setSidebarOption} />
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
                  <div className={classes.overflow}>
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
              <Favourites
                stops={props.stops}
                setMarker={setMarker}
              ></Favourites>
            )}
          </div>
        )}
      </div>
      <div>
      <Button sx={{backgroundColor: "pink", color:"red"}}onClick={toggleContainer}> Click</Button>
      </div>
    </div>
  );
};
export default SideContainer;
