import { React, useState, useContext, useEffect } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import classes from "./Favourites.module.css";
// import FavouriteStops from "./FavouriteStops";
import AuthContext from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import Warning from "./Warning";
import useAxios from "../../../utils/useAxios";
import LoadingSpinner from "../../LoadingSpinner";

const Route = (props) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [routeList, setRouteList] = useState([]);
  const [autocompleteSelection, setAutocompleteSelection] = useState("");
  const [selectedRouteList, setSelectedRouteList] = useState(null);
  const [loadingFavourites, setLoadingFavourites] = useState(false);

  // routeIDList holds array of database IDs and their associated bus route
  // need it to pass delete requests to DB
  // cannot store ID in routeList as new IDs made on a post request
  const [routeIDList, setRouteIDList] = useState([]);

  const api = useAxios();

  // function to add a favourite stop to the database for the user
  const postRoute = async (trip_headsign, route_short_name) => {
    const response = await api.post("/favouriteroutes/", {
      trip_headsign: trip_headsign,
      route_short_name: route_short_name,
    });
    if (response.status === 201) {
      console.log(response);

      // need to add response array to routeIDList to store the ID
      const arr = response.data;
      setRouteIDList((prevRouteIDList) => {
        return [...prevRouteIDList, arr];
      });
    } else {
      // change
      alert("Something went wrong!");
    }
  };

  // function to delete a favourite route to the database for the user
  const deleteRoute = async (id) => {
    // need to delete via pk of database, but don't have this in list populating favouritestops
    // use routeIDList which has updated for every post and the initial get request
    const obj = routeIDList.find((x) => x.stop_id === id);
    const primaryKey = obj.id;
    const response = await api.delete(`/favourites/${primaryKey}`);
    console.log("del res", response);
    if (response.status === 204) {
      console.log(response);
      // update routeIDList
      setRouteIDList(routeIDList.filter((item) => item !== obj));
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
        response = await api.get("/favouriteroutes/");
        console.log(response);
      } catch {
        // change
        console.log("bug");
      }
      for (let i = 0; i < response.data.length; i++) {
        const item = props.routes.find(
          (x) => x.stop_id === response.data[i].stop_id
        );
        setRouteList((prevRouteList) => {
          return [...prevRouteList, item];
        });

        const arr = response.data[i];
        setRouteIDList((prevRouteIDList) => {
          return [...prevRouteIDList, arr];
        });
      }
      setLoadingFavourites(false);
    };
    fetchData();
    // console.log("deleting");

    // only want it to run on load - they are being added to the db via postRoute above, and also to the routes list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busRoutes = props.routes.map((route, index) => {
    // combine values in props.routes to show route name and headsign
    const label = route.route_short_name.concat(": ", route.trip_headsign);
    return { label: label, key: index };
  });

  const addRoute = (route) => {
    // remove error initially, reset below on conditional
    setError(null);

    // if not blank
    if (route) {
      if (user) {
        const idx = Object.keys(busRoutes).find(
          (key) => busRoutes[key] === route
        );
        const routeObj = props.routes[idx];
        console.log(routeObj);
        // returns true if the stop is already in routeList
        const inArr = routeList.some(
          (elem) => elem === routeObj
        );
          console.log(route)
        if (!inArr) {
          postRoute(routeObj.trip_headsign, routeObj.route_short_name);
          setRouteList((prevRouteList) => {
            return [...prevRouteList, routeObj];
          });
        } else {
          setError("Chosen route is already in your favourites");
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
          value={selectedRouteList}
          onChange={(_event, newStop) => {
            console.log(newStop);
            setSelectedRouteList(newStop);
            addRoute(newStop);
          }}
          inputValue={autocompleteSelection}
          onInputChange={(_event, newInputValue) => {
            setAutocompleteSelection(newInputValue);
          }}
          groupBy={(option) => option.firstLetter}
          disablePortal
          id="route-search"
          options={busRoutes}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Bus Route" />
          )}
        />
      </div>
      {error && <Warning error={error}></Warning>}
      <div>
        {user ? (
          <div>
            {console.log("routes list", routeIDList)}

            {loadingFavourites && (
              <LoadingSpinner text={"Loading Favourites..."}></LoadingSpinner>
            )}
            {!loadingFavourites && (
              <p>update</p>
              // <FavouriteStops
              //   stops={stopsList}
              //   setStopsList={setStopsList}
              //   // setMarker={props.setMarker}
              //   deleteStop={deleteStop}
              // ></FavouriteStops>
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

export default Route;
