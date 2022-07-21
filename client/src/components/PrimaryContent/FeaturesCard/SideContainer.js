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
import { BsCaretDownSquare, BsCaretUpSquare } from "react-icons/bs";
import { IconContext } from "react-icons";

const SideContainer = (props) => {
  const [sidebarOption, setSidebarOption] = useState({
    journey: true,
    route: false,
    stop: false,
    favourites: false,
  });

  const [container, setContainer] = useState(true);

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
      <div className={classes.toggleButton}>
        <IconButton
          onClick={() => {
            setContainer(!container);
          }}
        >
          <IconContext.Provider
            value={{ size: "2rem", color: "black"}}
          >
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
