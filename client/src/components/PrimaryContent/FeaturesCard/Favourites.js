import { React, useState, useContext } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import classes from "./Favourites.module.css";
import FavouriteStops from "./FavouriteStops";
import AuthContext from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const Favourites = (props) => {
  const { user } = useContext(AuthContext);

  const busStops = props.stops.map((stop, index) => {
    return { label: stop.stop_name, key: stop.stop_id };
  });

  const [stopsList, setStopsList] = useState([])

  const addStop = (stop) => {
    const idx = Object.keys(busStops).find(key => busStops[key]===stop)
    const stopObj = props.stops[idx]
    console.log(props.stops[stopObj])
    setStopsList((prevStopsList) => {
      return [...prevStopsList, stopObj];
    });
  };

  // const [selectedStop, setSelectedStop] = useState();
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [selectedStopList, setSelectedStopList] = useState(null);

  console.log(busStops);
  return (
    <div className={classes.fav_container}>
      <div>
        <Autocomplete
          value={selectedStopList}
          onChange={(_event, newStop) => {
            console.log("0", typeof newStop);
            console.log("1", typeof busStops[0]);
            console.log(newStop === busStops[0]);
            setSelectedStopList(newStop);
            addStop(newStop);
          }}
          inputValue={autocompleteSelection}
          onInputChange={(_event, newInputValue) => {
            setAutocompleteSelection(newInputValue);
          }}
          disablePortal
          id="stop-search"
          options={busStops}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Bus Stop" />
          )}
        />
      </div>
      <div>
        {user ? (
          <FavouriteStops stops={stopsList} setMarker={props.setMarker}></FavouriteStops>
        ) : (
          <div className={classes.loggedOut}>
            <h4>You are not logged in.</h4>
            <p>
              {" "}
              <Link to={"/login/"} style={{ textDecoration: "none" }}>
                <Button type="submit">Login</Button>
              </Link>
              {"or"}
              <Button type="submit">Register</Button>
              to view your favourites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
