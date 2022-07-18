import { React } from "react";
import { Button } from "@mui/material";
import classes from "./Favourites.module.css";

const FavouriteStops = (props) => {
  const pickStops = (event) => {
    const stop = props.stops[event.target.value];
    props.setMarker(stop.stop_lat, stop.stop_long);
  };
  return (
    <div className={classes.favouriteStops}>
      <h3>Your Favourite Stops</h3>
      {console.log('bug',props.stops)}
      {props.stops[0] ? (
        <ul className={classes.stop_options}>
          {props.stops.map((stop, index) => (
            <li key={stop.stop_id}>
              <Button
                sx={{
                  backgroundColor: "black",
                  width: 370,
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
                onClick={pickStops}
              >
                {stop.stop_name}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>You haven't selected any favourite stops yet.</p>
          <p>Add stops with the search bar to stay updated!</p>
        </div>
      )}
    </div>
  );
};

export default FavouriteStops;
