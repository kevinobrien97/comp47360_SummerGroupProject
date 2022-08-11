import { React, useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import classes from "../Stops_routes.module.css";
import AuthContext from "../../../../context/AuthContext";
import Warning from "../Warning";
import useAxios from "../../../../utils/useAxios";
import LoadingSpinner from "../../../LoadingSpinner";
import RouteList from "./RouteList";
import ToggleFavourites from "../ToggleFavourites";
import Dropdown from "../Dropdown";
import ScheduleTime from "../ScheduleTime";
import DialogueBox from "../DialogueBox";

const Route = (props) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [favRouteList, setFavRouteList] = useState([]);
  const [routeList, setRouteList] = useState([]);
  const [loadingFavourites, setLoadingFavourites] = useState(false);
  const [viewFavourites, setViewFavourites] = useState(false);

  const [deleteFavourite, setDeleteFavourite] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [timeClicked, setTimeClicked] = useState(false);

  // routeIDList holds array of database IDs and their associated bus route
  // need it to pass delete requests to DB
  // cannot store ID in routeList as new IDs made on a post request
  const [routeIDList, setRouteIDList] = useState([]);
  const day = new Date();
  const [daySelection, setDaySelection] = useState(day.getDay(0));
  const [time, setTime] = useState(day);

  const api = useAxios(props.setUserLoggedOut, props.toggleLogIn);

  // function to add a favourite stop to the database for the user
  const postRoute = async (trip_headsign, route_short_name) => {
    try {
      const response = await api.post("/favouriteroutes/", {
        trip_headsign: trip_headsign,
        route_short_name: route_short_name,
      });
      if (response.status === 201) {

        // need to add response array to routeIDList to store the ID
        const arr = response.data;

        setRouteIDList((prevRouteIDList) => {
          return [...prevRouteIDList, arr];
        });
      }
    } catch {
      console.log("Couldn't add to database");
    }
  };

  // function to delete a favourite route to the database for the user
  const deleteRoute = async (route) => {
    const trip_headsign = route.trip_headsign;
    const route_short_name = route.route_short_name;
    // need to delete via pk of database, but don't have this in list populating favouriteroutes
    // use routeIDList which has updated for every post and the initial get request
    const obj = routeIDList.find(
      (x) =>
        x.trip_headsign === trip_headsign &&
        x.route_short_name === route_short_name
    );
    const primaryKey = obj.id;
    try {
      const response = await api.delete(`/favouriteroutes/${primaryKey}`);
      if (response.status === 204) {
        // update routeIDList
        setRouteIDList(routeIDList.filter((item) => item !== obj));
        props.setRouteMarkers([]);
      }
    } catch {
      console.log("Couldn't remove from database");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingFavourites(true);
      let response;
      try {
        response = await api.get("/favouriteroutes/");
        for (let i = 0; i < response.data.length; i++) {
          // creating a temporary object for each elem of the response to be added to the list that will be displayed on screen
          const tempObj = {
            trip_headsign: response.data[i].trip_headsign,
            route_short_name: response.data[i].route_short_name,
          };
          // const item = props.routes.find(
          //   (x) => x === tempObj
          // );

          setFavRouteList((prevRouteList) => {
            return [...prevRouteList, tempObj];
          });
          // adding arr to routeIDList - used for deletions (stores primary key used in database)
          const arr = response.data[i];
          setRouteIDList((prevRouteIDList) => {
            return [...prevRouteIDList, arr];
          });
        }
      } catch {
        console.log("Couldn't retrieve from database");
      }

      setLoadingFavourites(false);
    };
    // only load if logged in
    if (user) {
      fetchData();
    }
    // only want it to run on load - they are being added to the db via postRoute above, and also to the routes list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busRoutes = props.routes.map((route, index) => {
    // combine values in props.routes to show route name and headsign
    const label = route.route_short_name.concat(": ", route.trip_headsign);
    return { label: label, key: index };
  });

  const addFavRoute = (route) => {
    // remove error initially, reset below on conditional
    setError(null);
    // if not blank
    if (route) {
      if (user) {
          // complex object - comparing specific elements of object instead of entire object
        const idx = Object.keys(busRoutes).find(
          (key) => busRoutes[key].label === route.label
        );
        const routeObj = props.routes[idx];
        // returns true if the route is already in favRouteList
        const inArr = favRouteList.some(
          (elem) =>
            elem.route_short_name === routeObj.route_short_name &&
            elem.trip_headsign === routeObj.trip_headsign
        );

        if (!inArr) {
          postRoute(routeObj.trip_headsign, routeObj.route_short_name);
          setFavRouteList((prevRouteList) => {
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

  const addRoute = (route) => {
    // remove error initially, reset below on conditional
    setError(null);
    // if not blank
    if (route) {
        // complex object - comparing specific elements of object instead of entire object
      const idx = Object.keys(busRoutes).find(
        (key) => busRoutes[key].label === route.label
      );
      const routeObj = props.routes[idx];
      // returns true if the stop is already in routeList
      const inArr = routeList.some(
        (elem) =>
          elem.route_short_name === routeObj.route_short_name &&
          elem.trip_headsign === routeObj.trip_headsign
      );
      if (!inArr) {
        setRouteList((prevRouteList) => {
          return [...prevRouteList, routeObj];
        });
      } else {
        setError("Chosen route is already is already shown");
      }
    }
  };

  return (
    <div>
      <ToggleFavourites
        viewFavourites={viewFavourites}
        setViewFavourites={setViewFavourites}
        setError={setError}
      ></ToggleFavourites>
      <div className={classes.fav_container}>
        {!viewFavourites ? (
          <Dropdown
            text={"Route"}
            options={busRoutes}
            addStop={addRoute}
            viewFavourites={viewFavourites}
          ></Dropdown>
        ) : (
          <Dropdown
            text={"Route"}
            options={busRoutes}
            addStop={addFavRoute}
            viewFavourites={viewFavourites}
            setError={setError}
          ></Dropdown>
        )}
      </div>

      {error && <Warning error={error}></Warning>}
      <ScheduleTime
        daySelection={daySelection}
        setDaySelection={setDaySelection}
        time={time}
        setTime={setTime}
        setTimeClicked={setTimeClicked}
      ></ScheduleTime>

      <div>
        {viewFavourites ? (
          <div>
            {user ? (
              <div>
                {loadingFavourites && (
                  <LoadingSpinner
                    text={"Loading Favourite Routes..."}
                  ></LoadingSpinner>
                )}
                {!loadingFavourites && (
                  <div>
                    {showDelete && (
                      <DialogueBox
                        header={"Remove Route from Favourites?"}
                        body={"removed from"}
                        setDialogueController={setShowDelete}
                        func={deleteRoute}
                        item={deleteFavourite}
                        list={favRouteList}
                        setSelectedItem={setDeleteFavourite}
                        setList={setFavRouteList}
                        reCenter={props.reCenter}
                        setMarker={props.setRouteMarkers}
                        resetMarker={[]}
                      ></DialogueBox>
                    )}
                    <RouteList
                      viewFavourites={viewFavourites}
                      routes={favRouteList}
                      daySelection={daySelection}
                      time={time}
                      setRouteList={setFavRouteList}
                      setRouteMarkers={props.setRouteMarkers}
                      deleteRoute={setDeleteFavourite}
                      setShowDelete={setShowDelete}
                      timeClicked={timeClicked}
                      setTimeClicked={setTimeClicked}
                      routeStops={props.routeStops}
                    ></RouteList>
                  </div>
                )}
              </div>
            ) : (
              <div className={classes.loggedOut}>
                <h4>You are not logged in.</h4>
                <p>
                  {" "}
                  {/* <Link to={"/login/"} style={{ textDecoration: "none" }}> */}
                    <Button type="submit" onClick={() => props.toggleLogIn()}>
                      Login
                    </Button>
                  {/* </Link> */}
                  {"or"}
                  <Button type="submit" onClick={() => props.toggleRegister()}>
                    Register
                  </Button>
                  to view your favourites.
                </p>
              </div>
            )}
          </div>
        ) : (
          <RouteList
            viewFavourites={viewFavourites}
            routes={routeList}
            daySelection={daySelection}
            time={time}
            // delete below once popups implemented
            setRouteList={setRouteList}
            setRouteMarkers={props.setRouteMarkers}
            timeClicked={timeClicked}
            setTimeClicked={setTimeClicked}
            routeStops={props.routeStops}
          ></RouteList>
        )}
      </div>
    </div>
  );
};

export default Route;
