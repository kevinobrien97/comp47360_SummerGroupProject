import { React, useState, useContext } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import classes from "./Favourites.module.css";
import FavouriteStops from "./FavouriteStops";
import AuthContext from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const Favourites = (props) => {
  const { user } = useContext(AuthContext);

  const busStops = props.stops.map((stop) => {
    return { label: stop.stop_name, key: stop.stop_id };
  });

  const [selectedStop, setSelectedStop] = useState();
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [selectedStopList, setSelectedStopList] = useState();

  console.log(busStops);
  return (
    <div className={classes.fav_container}>
      <h6></h6>
      <div>
      <Autocomplete
        value={selectedStopList}
        onChange={(event, newStop) => {
          console.log("0", newStop);
          setSelectedStopList(newStop);
        }}
        inputValue={autocompleteSelection}
        onInputChange={(event, newInputValue) => {
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
        <FavouriteStops></FavouriteStops>
      ) : (
        <div className={classes.loggedOut}>
          <h4>You are not logged in.</h4>
          <p> <Link to={"/login/"} style={{ textDecoration: "none" }}> 
              <Button type="submit">
                Login
              </Button>
              </Link>
              {"or"} 

                <Button type="submit">
                  Register
                </Button>
        
         to view your favourites.
              
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Favourites;
