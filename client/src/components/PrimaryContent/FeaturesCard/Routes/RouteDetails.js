import { React, useState, useEffect } from "react";
import { AccordionDetails } from "@mui/material";
import LoadingSpinner from "../../../LoadingSpinner";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary } from "@mui/material";
import StopTable from "../StopTable";

const RouteDetails = (props) => {
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [loadingRouteStops, setLoadingRouteStops] = useState(false);
  const [routeStops, setRouteStops] = useState([]);

  useEffect(() => {
    const fetchRoutesData = (short_name, headsign) => {
      // setError(null);
      setLoadingRouteStops(true);
      const allStops = props.routeStops.filter((item) => {
        return (
          item.route_short_name === short_name &&
          item.trip_headsign === headsign
        );
      });
      setRouteStops(allStops);

      setLoadingRouteStops(false);
    };
    //   try {
    //     // fetch returns a promise
    //     // is asynchronous
    //     const response = await fetch(
    //         // `http://127.0.0.1:8000/api/routestops/${short_name}/${headsign}/`
    //       `http://3.90.184.148/api/routestops/${short_name}/${headsign}/`
    //     );
    //     if (!response.ok) {
    //       // wont continue with next line if error thrown
    //       throw new Error("Something went wrong loading routes");
    //     }
    //     const allStops = await response.json();
    //     setRouteStops(allStops);

    //     // console.log(allStops);
    //     //   props.setRouteMarkers(allStops);
    //   } catch (error) {
    //     console.log(error.message);
    //     // setError(error.message);
    //   }

    // };
    if (!props.routeStopsLoading) {
      fetchRoutesData(props.route.route_short_name, props.route.trip_headsign);
    }
    // only want it to run on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getSchedule = async (route_short_name, trip_headsign, day) => {
      // setError(null);
      props.setTimeClicked(false);
      setLoadingSchedule(true);

      try {
        // fetch returns a promise
        // is asynchronous
        const response = await fetch(
          // `http://127.0.0.1:8000/api/fullroutestoptimes/${route_short_name}/${trip_headsign}/${day}/`
          `http://54.157.240.210/api/fullroutestoptimes/${route_short_name}/${trip_headsign}/${day}/`
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
    //   // rerender whenever time is changed
    // }, [props.daySelection, props.time]);
    // rerender whenever button clicked
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.timeClicked]);

  return (
    <AccordionDetails sx={{ backgroundColor: "whitesmoke" }}>
      {loadingRouteStops && (
        <LoadingSpinner text={"Loading Stops..."}></LoadingSpinner>
      )}
      {!loadingRouteStops && (
        <div>
          {routeStops[0] &&
            routeStops.map((stop, index) => (
              <Accordion disableGutters={true} key={stop.stop_id}>
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
                  {loadingSchedule && (
                    <LoadingSpinner
                      text={"Loading Schedule..."}
                    ></LoadingSpinner>
                  )}
                  {!loadingSchedule && (
                    <StopTable
                      schedule={schedule
                        .filter((item) => {
                          return item.stop_id === stop.stop_id;
                        })
                        .splice(0, 3)}
                      time={props.time}
                      daySelection={props.daySelection}
                    ></StopTable>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
        </div>
      )}
    </AccordionDetails>
  );
};

export default RouteDetails;
