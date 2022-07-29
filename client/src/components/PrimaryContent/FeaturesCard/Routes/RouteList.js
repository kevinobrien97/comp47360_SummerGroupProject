import { React, useState } from "react";
import { IconButton, Accordion, AccordionSummary } from "@mui/material";

import classes from "../Stops_routes.module.css";
import { FaTrash } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RouteDetails from "./RouteDetails";

const RouteFavourites = (props) => {
  const [loadingRouteStops, setLoadingRouteStops] = useState(false);

  const pickRoutes = (index) => {
    const route = props.routes[index];
    const short_name = route.route_short_name;
    const headsign = route.trip_headsign;
    fetchRoutesData(short_name, headsign);
    // console.log(route);

    // props.setMarker(stop.stop_lat, stop.stop_long);
  };

  const fetchRoutesData = async (short_name, headsign) => {
    // setError(null);
    setLoadingRouteStops(true);
    try {
      // fetch returns a promise
      // is asynchronous
      const response = await fetch(
        `http://127.0.0.1:8000/api/routestops/${short_name}/${headsign}/`
      );
      if (!response.ok) {
        // wont continue with next line if error thrown
        throw new Error("Something went wrong loading routes");
      }
      const allStops = await response.json();
      // console.log(allStops);
      props.setRouteMarkers(allStops);
    } catch (error) {
      console.log(error.message);
      // setError(error.message);
    }
    setLoadingRouteStops(false);
  };

  const removeFavRoute = (idx) => {
    const route = props.routes[idx];
    console.log(route);
    // props.setRouteList(props.routes.filter((item) => item !== route));
    // call method to delete from database
    props.deleteRoute(route);
    props.setShowDelete(true);
  };

  const removeRoute = (idx) => {
    const route = props.routes[idx];
    console.log(route);
    props.setRouteList(props.routes.filter((item) => item !== route));
  };

  return (
    <div>
      {props.viewFavourites ? (
        <h3 className={classes.h3}>Your Favourite Routes</h3>
      ) : (
        <h3 className={classes.h3}>Selected Routes</h3>
      )}
      {/* {console.log(props.routes)} */}
      {props.routes[0] ? (
        <div>
          {props.routes.map((route, index) => (
            <div
              key={index}
              style={{
                minWidth: "100%",
                width: "25rem",
                borderTop: "0.05rem solid lightgrey",
              }}
            >
              <Accordion
                disableGutters={true}
                onClick={() => pickRoutes(index)}
              >
                <AccordionSummary
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "25rem",
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      paddingLeft: "0.30rem",
                    }}
                  >
                    {route.route_short_name.concat(": ", route.trip_headsign)}
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                    }}
                  >
                    {props.viewFavourites ? (
                      <IconButton
                        onClick={(e) => removeFavRoute(index)}
                        size="sm"
                      >
                        <FaTrash />
                      </IconButton>
                    ) : (
                      <IconButton onClick={(e) => removeRoute(index)} size="sm">
                        <MdClear />
                      </IconButton>
                    )}
                  </div>
                </AccordionSummary>
                <RouteDetails
                  route={route}
                  time={props.time}
                  daySelection={props.daySelection}
                ></RouteDetails>
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.no_selection}>
          {props.viewFavourites ? (
            <div>
              <p>You haven't selected any favourite routes yet.</p>
              <p>Add routes with the search bar to stay updated!</p>
            </div>
          ) : (
            <p>
              Add routes with the search bar to view route and stop schedule
              information.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteFavourites;
