import { React, useState, useEffect } from "react";
import { AccordionDetails } from "@mui/material";
import LoadingSpinner from "../../../LoadingSpinner";

const RouteDetails = (props) => {
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const getSchedule = async (route_short_name, trip_headsign, day) => {
      // setError(null);
      setLoadingSchedule(true);
      try {
        console.log("here");
        // fetch returns a promise
        // is asynchronous
        const response = await fetch(
          `http://127.0.0.1:8000/api/fullroutestoptimes/${route_short_name}/${trip_headsign}/${day}/`
        );
        if (!response.ok) {
          // wont continue with next line if error thrown
          throw new Error("Something went wrong loading schedule");
        }
        const routeSchedule = await response.json();
        // filter out any times less than current time
        const filtered = routeSchedule.filter((d) => {
          return d.departure_time >= props.time.toTimeString().split(" ")[0];
        });
        console.log(filtered);
        // sort remaining values by time
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          // sensitivity: "base",
        });
        const sorted = filtered.sort((a, b) => {
          return collator.compare(a.departure_time, b.departure_time);
        });
        // different schedule keys have the same stop information sometimes (multiple keys can apply on same day)
        const noDuplicates = sorted.reduce((unique, t) => {
          if (
            !unique.some(
              (trip) =>
                trip.departure_time === t.departure_time &&
                trip.stop_headsign === t.stop_headsign
            )
          ) {
            unique.push(t);
          }
          return unique;
        }, []);
        // setSchedule(noDuplicates.splice(0, 10));
        setSchedule(noDuplicates);
      } catch (error) {
        console.log(error.message);
        // setError(error.message);
      }
      setLoadingSchedule(false);
    };
    getSchedule(
      props.route.route_short_name,
      props.route.trip_headsign,
      props.daySelection
    );
    // rerender whenever time is changed
  }, [props.daySelection, props.time]);

  return (
    <AccordionDetails sx={{ backgroundColor: "whitesmoke" }}>
      {loadingSchedule && (
        <LoadingSpinner text={"Loading Schedule..."}></LoadingSpinner>
      )}
      {!loadingSchedule && (
        <div />
        // <StopTable schedule={schedule} time={props.time} daySelection={props.daySelection}></StopTable>
      )}
    </AccordionDetails>
  );
};

export default RouteDetails;
