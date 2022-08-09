import { React, useEffect, useState } from "react";
import LoadingSpinner from "../../../LoadingSpinner";
import axios from "axios";

const JourneyPrediction = (props) => {
  const [predictionPossible, setPredictionPossible] = useState(true);
  const [predictionLoading, setpredictionLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  let route_id;
  let headsign;
  let start_stop;
  let end_stop;
  let total_stops;

  const handlePrediction = (prediction) => {
    if (prediction === "None") {
      setPredictionPossible(false);
    } else {
      console.log(Math.round(prediction / 60));
      setPrediction(Math.round(prediction / 60));
      // and add to total
    }
  };

  // below is a check to ensure each of the elements are returned, and if not the google prediction is used. For example, if line.short_name does not exist
  // it is the case that the bus is outside the dublin bus network
  // some of the below checks will never fail but this acts as a semse check in any case

  useEffect(() => {
    const fetchPrediction = async () => {
      setpredictionLoading(true);
      if (props.step.transit) {
        const transitDetails = props.step.transit;
        if (
          transitDetails.line.short_name &&
          transitDetails.line.name &&
          transitDetails.arrival_stop.name &&
          transitDetails.departure_stop.name &&
          transitDetails.num_stops
        ) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          route_id = transitDetails.line.short_name;
          // eslint-disable-next-line react-hooks/exhaustive-deps
          headsign = transitDetails.line.name;
          // eslint-disable-next-line react-hooks/exhaustive-deps
          start_stop = transitDetails.departure_stop.name;
          // eslint-disable-next-line react-hooks/exhaustive-deps
          end_stop = transitDetails.arrival_stop.name;
          // eslint-disable-next-line react-hooks/exhaustive-deps
          total_stops = transitDetails.num_stops;

          // iniitally want error deleted if one was there previously
          //   setError(null);
          //   if (predictionPossible) {
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
                  total_stops: total_stops,
                  timestamp: props.dateTime.getTime(),
                },
              }
            );
            console.log(res);
            handlePrediction(res.data.result);
            // const data = res.data;
            // navigate("/");
          } catch (e) {
            console.log(e);
            setPredictionPossible(false);
          }
        } else {
          setPredictionPossible(false);
        }
      } else {
        setPredictionPossible(false);
      }
      //   }
      setpredictionLoading(false);
    };
    // console.log(predictionPossible);
    // if (predictionPossible) {
    fetchPrediction();
    // }
  }, []);

  return (
    <span>
      {console.log(parseInt(prediction))}
      {predictionLoading ? (
        "Loading..."
      ) : (
        <span>
          {predictionPossible ? (
            <span>ShuttleUp Journey Time: {prediction} mins vs {props.step.duration.text}</span>
          ) : (
            <span>Google Maps Journey Time: {props.step.duration.text}</span>
          )}
        </span>
      )}
    </span>
  );
};

export default JourneyPrediction;