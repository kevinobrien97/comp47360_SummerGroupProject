import { React, useEffect, useState } from "react";
import LoadingSpinner from "../../../LoadingSpinner";
import axios from "axios";

const JourneyPrediction = (props) => {
  const [predictionPossible, setPredictionPossible] = useState(false);
  console.log(props.step);
  let route_id;
  let headsign;
  let start_stop;
  let end_stop;
  let total_stops;

  // below is a check to ensure each of the elements are returned, and if not the google prediction is used. For example, if line.short_name does not exist
  // it is the case that the bus is outside the dublin bus network
  // some of the below checks will never fail but this acts as a semse check in any case

  useEffect(() => {
    const fetchPrediction = async () => {
      if (props.step.transit) {
        const transitDetails = props.step.transit;
        console.log(transitDetails.line.short_name);
        if (
          transitDetails.line.short_name &&
          transitDetails.line.agencies[0].name &&
          transitDetails.arrival_stop.name &&
          transitDetails.departure_stop.name &&
          transitDetails.num_stops
        ) {
          route_id = transitDetails.line.short_name;
          headsign = transitDetails.line.agencies[0].name;
          start_stop = transitDetails.arrival_stop.name;
          end_stop = transitDetails.departure_stop.name;
          total_stops = transitDetails.num_stops;
          console.log(total_stops);
        } else {
          setPredictionPossible(false);
        }
      } else {
        setPredictionPossible(false);
      }
      // iniitally want error deleted if one was there previously
      //   setError(null);
      if (predictionPossible) {
        try {
          const res = await axios.get(
            "http://127.0.0.1:8000/api/getPrediction/",
            {
              // "http://3.90.184.148/api/token/",{
              params: {
                route_id: route_id,
                headsign: headsign,
                start_stop: start_stop,
                end_stop: end_stop,
                timestamp: total_stops,
              },
            }
          );
          console.log(res);
          // const data = res.data;
          // navigate("/");
        } catch (e) {
          console.log(e);
        }
      }
    };
    // console.log(predictionPossible);
    // if (predictionPossible) {
    fetchPrediction();
    // }
  }, []);

  return <span>xy mins</span>;
};

export default JourneyPrediction;
