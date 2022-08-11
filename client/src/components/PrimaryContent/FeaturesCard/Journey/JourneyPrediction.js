import { React } from "react";

const JourneyPrediction = (props) => {
  return (
    <span>
      {/* {predictionPossible ? (
            <span>ShuttleUp Journey Time: <strong>{prediction} mins </strong>vs {props.step.duration.text}</span>
          ) : ( */}
      {props.step.shuttleup_prediction ? (
        <span>
          ShuttleUp Journey Time:{" "}
          {/* if less than 1.5 mins I want to show 1 min */}
          {props.step.shuttleup_prediction > 1.5 ? (
            <span>
              <strong>
                {Math.round(props.step.shuttleup_prediction)} mins{" "}
              </strong>
            </span>
          ) : (
            <span>
              <strong>{"1 min"}</strong> vs {props.step.duration.text}
            </span>
          )}
        </span>
      ) : (
        <span>
          Google Maps Journey Time: <strong>{props.step.duration.text}</strong>
        </span>
      )}
      {/* )} */}
    </span>
  );
};

export default JourneyPrediction;
