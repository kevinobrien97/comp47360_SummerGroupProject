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

  // stopIDList holds array of database IDs and their associated bus stop
  // need it to pass delete requests to DB
  // cannot store ID in stopsList as new IDs made on a post request
  const [stopIDList, setStopIDList] = useState([]);

  // const [favs, setFavs] = useState("");
  const api = useAxios();

  // function to add a favourite stop to the database for the user
  const postStop = async (id) => {
    const response = await api.post("/favourites/", {
      stop_id: id,
    });
    if (response.status === 201) {
      console.log(response);

      // need to add response array to stopIDList to store the ID
      const arr = response.data;
      setStopIDList((prevStopIDList) => {
        return [...prevStopIDList, arr];
      });

    } else {
      // change
      alert("Something went wrong!");
    }
  };

  // function to delete a favourite stop to the database for the user
  const deleteStop = async (id) => {
    // need to delete via pk of database, but only have stop_id in list populating favouritestops
    // use stopIDList which has updated for every post and the initial get request
    const obj = stopIDList.find(
      (x) => x.stop_id === id
    );
    const primaryKey = obj.id;
    const response = await api.delete(`/favourites/${primaryKey}`);
    console.log('del res', response)
    if (response.status === 204) {
      console.log(response);
      // update stopIDList
      setStopIDList(stopIDList.filter(item => item !== obj));
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
        console.log(response);
      } catch {
        // change
        console.log("bug");
      }
      for (let i = 0; i < response.data.length; i++) {
        const item = props.stops.find(
          (x) => x.stop_id === response.data[i].stop_id
        );
        setStopsList((prevStopsList) => {
          return [...prevStopsList, item];
        });

        const arr = response.data[i];
        setStopIDList((prevStopIDList) => {
          return [...prevStopIDList, arr];
        });
      }
      setLoadingFavourites(false);
    };
    fetchData();
    // console.log("deleting");


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
            {console.log("stops list", stopIDList)}
            
            {loadingFavourites && (
              <LoadingSpinner text={"Loading Favourites..."}></LoadingSpinner>
            )}
            {!loadingFavourites && (
              <FavouriteStops
                stops={stopsList}
                setStopsList={setStopsList}
                setMarker={props.setMarker}
                deleteStop={deleteStop}
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
