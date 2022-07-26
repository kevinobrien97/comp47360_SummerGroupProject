import { React, useState, useEffect } from "react";
import { AccordionDetails } from "@mui/material";
import LoadingSpinner from "../../../LoadingSpinner";
import { MdStopScreenShare } from "react-icons/md";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary } from "@mui/material";
import StopTable from "../StopTable";

const RouteDetails = (props) => {
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [loadingRouteStops, setLoadingRouteStops] = useState(false);
  const [routeStops, setRouteStops] = useState([]);

  useEffect(() => {
    const fetchRoutesData = async (short_name, headsign) => {
      // setError(null);
      setLoadingRouteStops(true);
      try {
        // fetch returns a promise
        // is asynchronous
        const response = await fetch(
          `http://127.0.0.1:8000/api/routestops/${short_name}/${headsign}/`
        );
        if (!response.ok) {
          // wont continue with next line if error thrown
          throw new Error("Something went wrong loading routes");
        }
        const allStops = await response.json();
        setRouteStops(allStops);
        console.log("here");

        // console.log(allStops);
        //   props.setRouteMarkers(allStops);
      } catch (error) {
        console.log(error.message);
        // setError(error.message);
      }
      setLoadingRouteStops(false);
    };
    fetchRoutesData(props.route.route_short_name, props.route.trip_headsign);
    // only want it to run on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {loadingRouteStops && (
        <LoadingSpinner text={"Loading Stops..."}></LoadingSpinner>
      )}
      {!loadingRouteStops && (
        <div>
          {routeStops[0] &&
            routeStops.map((stop, index) => (
              <Accordion disableGutters={true}>
                <AccordionSummary
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // width: "25rem",
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  {" "}
                  {console.log(stop)}
                  <div
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      paddingLeft: "0.30rem",
                    }}
                  >
                    {stop.stop_name}
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "whitesmoke" }}>
                <StopTable
                  schedule={schedule.filter((item) => {
                    return item.stop_id === stop.stop_id;
                  })}   
                  time={props.time}
                  daySelection={props.daySelection}
                ></StopTable>
                </AccordionDetails>
              </Accordion>
            ))}
        </div>
      )}
    </AccordionDetails>
  );
};

export default RouteDetails;
