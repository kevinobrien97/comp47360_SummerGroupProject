import { React, useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import classes from "../Stops_routes.module.css";
import StopList from "./StopList";
import AuthContext from "../../../../context/AuthContext";
// import { Link } from "react-router-dom";
import Warning from "../Warning";
import useAxios from "../../../../utils/useAxios";
import LoadingSpinner from "../../../LoadingSpinner";
import ScheduleTime from "../ScheduleTime";
import Dropdown from "../Dropdown";
import DialogueBox from "../DialogueBox";
import ToggleFavourites from "../ToggleFavourites";

const Stops = (props) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [favStopsList, setFavStopsList] = useState([]);
  const [stopsList, setStopsList] = useState([]);

  const [deleteFavourite, setDeleteFavourite] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [timeClicked, setTimeClicked] = useState(false);

  // stopIDList holds array of database IDs and their associated bus stop
  // need it to pass delete requests to DB
  // cannot store ID in stopsList as new IDs made on a post request
  const [stopIDList, setStopIDList] = useState([]);

  const [loadingFavourites, setLoadingFavourites] = useState(false);
  const [viewFavourites, setViewFavourites] = useState(false);
  const day = new Date();
  const [daySelection, setDaySelection] = useState(day.getDay(0));
  const [time, setTime] = useState(day);

  const api = useAxios(props.setUserLoggedOut, props.toggleLogIn);

  // function to add a favourite stop to the database for the user
  const postStop = async (id) => {
    try {
      const response = await api.post("/favourites/", {
        stop_id: id,
      });
      if (response.status === 201) {
  
        // need to add response array to stopIDList to store the ID
        const arr = response.data;
        setStopIDList((prevStopIDList) => {
          return [...prevStopIDList, arr];
        });
      }
    } catch {
      console.log("Couldn't add to database");
    }
  };

  // function to delete a favourite stop to the database for the user
  const deleteStop = async (stop) => {
    const id = stop.stop_id;
    // need to delete via pk of database, but only have stop_id in list populating favouritestops
    // use stopIDList which has updated for every post and the initial get request
    const obj = stopIDList.find((x) => x.stop_id === id);
    const primaryKey = obj.id;
    try {
      const response = await api.delete(`/favourites/${primaryKey}`);
      if (response.status === 204) {
        // update stopIDList
        setStopIDList(stopIDList.filter((item) => item !== obj));
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
        response = await api.get("/favourites/");
        for (let i = 0; i < response.data.length; i++) {
          const item = props.stops.find(
            (x) => x.stop_id === response.data[i].stop_id
          );
          setFavStopsList((prevStopsList) => {
            return [...prevStopsList, item];
          });

          const arr = response.data[i];
          setStopIDList((prevStopIDList) => {
            return [...prevStopIDList, arr];
          });
        }
        setLoadingFavourites(false);
      } catch {
        console.log("Couldn't retrieve from database");
      }
    };
    // only load if logged in
    if (user) {
      fetchData();
    }
    // only want it to run on load - they are being added to the db via postStop above, and also to the stops list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busStops = props.stops.map((stop, index) => {
    return { label: stop.stop_name, key: stop.stop_id };
  });

  const addFavStop = (stop) => {
    // remove error initially, reset below on conditional
    setError(null);
    // if not blank
    if (stop) {
      if (user) {
        // complex object - comparing specific elements of object instead of entire object
        const idx = Object.keys(busStops).find(
          (key) => busStops[key].key === stop.key
        );
        const stopObj = props.stops[idx];
        // returns true if the stop is already in favStopsList
        const inArr = favStopsList.some(
          (elem) => elem.stop_id === stopObj.stop_id
        );

        if (!inArr) {
          postStop(stop.key);
          setFavStopsList((prevStopsList) => {
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

  const addStop = (stop) => {
    // remove error initially, reset below on conditional
    setError(null);
    // if not blank
    if (stop) {
      // complex object - comparing specific elements of object instead of entire object
      const idx = Object.keys(busStops).find(
        (key) => busStops[key].key === stop.key
      );
      const stopObj = props.stops[idx];
      // returns true if the stop is already in stopsList
      const inArr = stopsList.some((elem) => elem.stop_id === stopObj.stop_id);
      if (!inArr) {
        setStopsList((prevStopsList) => {
          return [...prevStopsList, stopObj];
        });
      } else {
        setError("Chosen stop is already shown");
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
        {/* pass different add function to dropdown depending on if in favourites or regular stop view */}
        {!viewFavourites ? (
          <Dropdown
            text={"Stop"}
            options={busStops}
            addStop={addStop}
            viewFavourites={viewFavourites}
          ></Dropdown>
        ) : (
          <Dropdown
            text={"Stop"}
            options={busStops}
            addStop={addFavStop}
            viewFavourites={viewFavourites}
            setError={setError}
          ></Dropdown>
        )}
        {error && <Warning error={error}></Warning>}
        <ScheduleTime
          daySelection={daySelection}
          setDaySelection={setDaySelection}
          time={time}
          setTime={setTime}
          setTimeClicked={setTimeClicked}
        ></ScheduleTime>
      </div>

      <div>
        {viewFavourites ? (
          <div>
            {user ? (
              <div>
                {loadingFavourites && (
                  <LoadingSpinner
                    text={"Loading Favourite Stops..."}
                  ></LoadingSpinner>
                )}
                {!loadingFavourites && (
                  <div>
                    {showDelete && (
                      <DialogueBox
                        header={"Remove Stop from Favourites?"}
                        body={"removed from"}
                        setDialogueController={setShowDelete}
                        func={deleteStop}
                        item={deleteFavourite}
                        list={favStopsList}
                        setSelectedItem={setDeleteFavourite}
                        setList={setFavStopsList}
                        reCenter={props.reCenter}
                        setMarker={props.setSelectedStopMarker}
                        resetMarker={null}
                      ></DialogueBox>
                    )}
                    <StopList
                      viewFavourites={viewFavourites}
                      daySelection={daySelection}
                      time={time}
                      stops={favStopsList}
                      // setStopsList={setFavStopsList}
                      setMarker={props.setMarker}
                      deleteStop={setDeleteFavourite}
                      setShowDelete={setShowDelete}
                      timeClicked={timeClicked}
                      setTimeClicked={setTimeClicked}
                    ></StopList>
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
                  {/* <Link to={"/register/"} style={{ textDecoration: "none" }}> */}
                  <Button type="submit" onClick={() => props.toggleRegister()}>
                    Register
                  </Button>{" "}
                  {/* </Link> */}
                  to view your favourites.
                </p>
              </div>
            )}
          </div>
        ) : (
          <StopList
            viewFavourites={viewFavourites}
            daySelection={daySelection}
            time={time}
            stops={stopsList}
            setStopsList={setStopsList}
            setMarker={props.setMarker}
            timeClicked={timeClicked}
            setTimeClicked={setTimeClicked}
          ></StopList>
        )}
      </div>
    </div>
  );
};

export default Stops;
