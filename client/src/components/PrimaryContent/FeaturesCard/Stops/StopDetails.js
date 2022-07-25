import { React, useState, useEffect } from "react";
import { AccordionDetails } from "@mui/material";
import LoadingSpinner from "../../../LoadingSpinner";
import StopTable from "./StopTable"


const StopDetails = (props) => {
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const getSchedule = async (stop_id, day) => {
      // setError(null);
      setLoadingSchedule(true);
      try {
          console.log("here")
        // fetch returns a promise
        // is asynchronous
        const response = await fetch(
          `http://127.0.0.1:8000/api/stoptimes/${stop_id}/${day}/`
        );
        if (!response.ok) {
          // wont continue with next line if error thrown
          throw new Error("Something went wrong loading schedule");
        }
        const stopSchedule = await response.json();
        // filter out any times less than current time
        const filtered = stopSchedule.filter((d) => {
            return d.departure_time >= props.time.toTimeString().split(' ')[0];
          });
        // sort remaining values by time 
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          // sensitivity: "base",
        });
        const sorted = filtered.sort((a, b) => {
          return collator.compare(a.departure_time, b.departure_time);
        });
        const noDuplicates = sorted.reduce((unique, t) => {
            if(!unique.some(trip => trip.departure_time === t.departure_time && trip.stop_headsign===t.stop_headsign)) {
              unique.push(t);
            }
            return unique;
        },[]);
        // set schedule to next 10 bus stops
        setSchedule(noDuplicates.splice(0,10));
      } catch (error) {
        console.log(error.message);
        // setError(error.message);
      }
      setLoadingSchedule(false);
    };
    getSchedule(props.stop.stop_id, props.daySelection);
    // rerender whenever time is changed
  }, [props.daySelection, props.time]);

  return (
    <AccordionDetails sx={{ backgroundColor: "whitesmoke" }}>
       {loadingSchedule && (
        <LoadingSpinner text={"Loading Schedule..."}></LoadingSpinner>
      )}
      {!loadingSchedule && (
        <StopTable schedule={schedule} time={props.time} daySelection={props.daySelection}></StopTable>
      )}
    </AccordionDetails>
  );
};

export default StopDetails;