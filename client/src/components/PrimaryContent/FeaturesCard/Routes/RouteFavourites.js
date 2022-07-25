import { React, useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import classes from "../Stops_routes.module.css";
import { FaTrash } from "react-icons/fa";

const RouteFavourites = (props) => {
    const [loadingRouteStops, setLoadingRouteStops] = useState(false)

  const pickRoutes = (event) => {
    const route = props.routes[event.target.value];
    const short_name = route.route_short_name
    const headsign = route.trip_headsign
    fetchRoutesData(short_name, headsign)
    console.log(route);

    // props.setMarker(stop.stop_lat, stop.stop_long);
  };

  const fetchRoutesData = async (short_name, headsign) => {
    // setError(null);
    setLoadingRouteStops(true);
    try {
      // fetch returns a promise
      // is asynchronous
      const response = await fetch(`http://127.0.0.1:8000/api/routestops/${short_name}/${headsign}/`);
      if (!response.ok) {
        // wont continue with next line if error thrown
        throw new Error("Something went wrong loading routes");
      }
      const allStops = await response.json();
      console.log(allStops)     
      props.setRouteMarkers(allStops);
    } catch (error) {
      console.log(error.message)
      // setError(error.message);
    }
    setLoadingRouteStops(false);
  };

  const removeRoute = (idx) => {
    const route = props.routes[idx];
    console.log(route);
    // update stopIDList
    props.setRouteList(props.routes.filter((item) => item !== route));
    // call method to delete from database
    props.deleteRoute(route.trip_headsign, route.route_short_name);
  };

  return (
    <div className={classes.favouriteStops}>
      <h3 style={{ marginTop: "0.75rem", marginBottom: "0.75rem" }}>
        Your Favourite Routes
      </h3>
      {console.log("bug", props.routes)}
      {props.routes[0] ? (
        <ul className={classes.stop_options}>
          {props.routes.map((route, index) => (
            <li key={index}>
              <Button
                sx={{
                  backgroundColor: "black",
                  width: 330,
                  color: "white",
                  border: 3,
                  borderRadius: 5,
                  padding: 1,
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "black",
                  },
                }}
                // style={bgColor(stop.stop_id)}
                value={index}
                onClick={pickRoutes}
              >
                {route.route_short_name.concat(": ", route.trip_headsign)}
              </Button>
              
              <IconButton onClick={(e) => removeRoute(index)} size="sm">
                <FaTrash />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>You haven't selected any favourite routes yet.</p>
          <p>Add routes with the search bar to stay updated!</p>
        </div>
      )}
    </div>
  );
};

export default RouteFavourites;
