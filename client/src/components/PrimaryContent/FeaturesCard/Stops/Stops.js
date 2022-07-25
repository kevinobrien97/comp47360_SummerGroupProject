import { React, useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import classes from "./Favourites.module.css";
import FavouriteStops from "./FavouriteStops";
import AuthContext from "../../../../context/AuthContext";
import { Link } from "react-router-dom";
import Warning from "../Warning";
import useAxios from "../../../../utils/useAxios";
import LoadingSpinner from "../../../LoadingSpinner";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import ScheduleTime from "../ScheduleTime";
import StopDropdown from "./StopDropdown";

const Stops = (props) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [favStopsList, setFavStopsList] = useState([]);

  // stopIDList holds array of database IDs and their associated bus stop
  // need it to pass delete requests to DB
  // cannot store ID in stopsList as new IDs made on a post request
  const [stopIDList, setStopIDList] = useState([]);

  const [loadingFavourites, setLoadingFavourites] = useState(false);
  const [viewFavourites, setViewFavourites] = useState(false);
  const day = new Date();
  const [daySelection, setDaySelection] = useState(day.getDay(0));
  const [time, setTime] = useState(day);

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
    const obj = stopIDList.find((x) => x.stop_id === id);
    const primaryKey = obj.id;
    const response = await api.delete(`/favourites/${primaryKey}`);
    console.log("del res", response);
    if (response.status === 204) {
      console.log(response);
      // update stopIDList
      setStopIDList(stopIDList.filter((item) => item !== obj));
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
        setFavStopsList((prevStopsList) => {
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
        const idx = Object.keys(busStops).find((key) => busStops[key] === stop);
        const stopObj = props.stops[idx];

        // returns true if the stop is already in stopsList
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

  return (
    <div>
      {!viewFavourites && (
        <div className={classes.viewingFavs}>
          <Button onClick={() => setViewFavourites(true)}>
            <span style={{ color: "#F1B23E" }}>
              View Favourite Stops &nbsp;
              <HiOutlineArrowNarrowRight />
            </span>
          </Button>
        </div>
      )}
      {viewFavourites && (
        <div className={classes.regularView}>
          <Button onClick={() => setViewFavourites(false)}>
            <span style={{ color: "#F1B23E" }}>
              <HiOutlineArrowNarrowLeft />
              &nbsp;Back to Stop Search
            </span>
          </Button>
        </div>
      )}

      <div className={classes.fav_container}>
        <StopDropdown options={busStops} addStop={addFavStop}></StopDropdown>
        {error && <Warning error={error}></Warning>}
        <ScheduleTime
          daySelection={daySelection}
          setDaySelection={setDaySelection}
          time={time}
          setTime={setTime}
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
                  <FavouriteStops
                    daySelection={daySelection}
                    time={time}
                    stops={favStopsList}
                    setStopsList={setFavStopsList}
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
                  <Link to={"/register/"} style={{ textDecoration: "none" }}>
                    <Button type="submit">Register</Button>{" "}
                  </Link>
                  to view your favourites.
                </p>
              </div>
            )}
          </div>
        ):(<div></div>)}
      </div>
    </div>
  );
};

export default Stops;
