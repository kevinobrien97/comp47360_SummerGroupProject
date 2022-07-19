import { React, useState, useContext, useEffect } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import classes from "./Favourites.module.css";
import FavouriteStops from "./FavouriteStops";
import AuthContext from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import Warning from "./Warning";
import useAxios from "../../../utils/useAxios";
import LoadingSpinner from "../../LoadingSpinner";

const Favourites = (props) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [stopsList, setStopsList] = useState([]);
  // const [selectedStop, setSelectedStop] = useState();
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [selectedStopList, setSelectedStopList] = useState(null);
  const [loadingFavourites, setLoadingFavourites] = useState(false);

  // const [favs, setFavs] = useState("");
  const api = useAxios();

  // function to add a favourite stop to the database for the user
  const postStop = async (id) => {
    const response = await api.post("/favourites/", {
      stop_id: id,
    });
    if (response.status === 201) {
      console.log(response);
    } else {
      // change
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingFavourites(true);
      let response;
      try {
        response = await api.get("/favourites/");
      } catch {
        // change
        console.log('bug')
      }
      for (let i = 0; i < response.data.length; i++) {
        const item = props.stops.find((x) => x.stop_id === response.data[i].stop_id);
        setStopsList((prevStopsList) => {
          return [...prevStopsList, item];
        });
        console.log("idx", item);
      }
      setLoadingFavourites(false);
    };
    fetchData();
    console.log("fetching");
    // only want it to run on load - they are being added to the db via postSample above, and also to the stops list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busStops = props.stops.map((stop, index) => {
    return { label: stop.stop_name, key: stop.stop_id };
  });

  const addStop = (stop) => {
    // remove error initially, reset below on conditional
    setError(null);

    // if not blank
    if (stop) {
      if (user) {
        const idx = Object.keys(busStops).find((key) => busStops[key] === stop);
        const stopObj = props.stops[idx];

        // returns true if the stop is already in stopsList
        const inArr = stopsList.some(
          (elem) => elem.stop_id === stopObj.stop_id
        );

        if (!inArr) {
          postStop(stop.key);
          setStopsList((prevStopsList) => {
            return [...prevStopsList, stopObj];
          });
        } else {
          setError("Chosen stop is already in your favourites");
        }
      } else {
        setError("You need to be logged in to set favourites");
      }
    }
  };

  return (
    <div className={classes.fav_container}>
      <div>
        <Autocomplete
          value={selectedStopList}
          onChange={(_event, newStop) => {
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
      {error && <Warning error={error}></Warning>}
      <div>
        {user ? (
          <div>
            {console.log("stops list", stopsList)}
            {loadingFavourites && (
              <LoadingSpinner text={"Loading Favourites..."}></LoadingSpinner>
            )}
            {!loadingFavourites && (
              <FavouriteStops
                stops={stopsList}
                setMarker={props.setMarker}
              ></FavouriteStops>
            )}
          </div>
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
