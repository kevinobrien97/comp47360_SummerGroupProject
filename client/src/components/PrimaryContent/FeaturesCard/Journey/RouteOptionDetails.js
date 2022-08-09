import { React } from "react";
import { AccordionDetails } from "@mui/material";
import { FaBus, FaWalking } from "react-icons/fa";
import classes from "./RouteOptionDetails.module.css";
import { IconContext } from "react-icons";
import JourneyPrediction from "./JourneyPrediction";
import Warning from "../Warning";

const RouteOptionDetails = (props) => {
  return (
    <AccordionDetails sx={{ backgroundColor: "whitesmoke" }}>
      {/* a trip that is exclusively walking does not return a departure time */}
      {props.route.legs[0].departure_time ? (
        <div>
          <p>
            {"Departure: "}
            <strong>{props.route.legs[0].departure_time.text}</strong>
          </p>
          <p>
            {"Estimated Arrival Time: "}
            <strong>
              <span
                style={{
                  backgroundColor: "red",
                  borderRadius: "10px",
                  padding: "3px",
                }}
              >
                xx mins
              </span>
            </strong>
          </p>
          <div>
            {props.route.legs[0].steps.map((step, idx) => (
              <div key={Math.random()} className={classes.route_details}>
                <div className={classes.route_icon}>
                  {step.travel_mode === "WALKING" ? (
                    <IconContext.Provider
                      value={{
                        size: "1.5rem",
                        color: "#F1B23E",
                      }}
                    >
                      <FaWalking />
                    </IconContext.Provider>
                  ) : (
                    <IconContext.Provider
                      value={{
                        size: "1.5rem",
                        color: "#F1B23E",
                      }}
                    >
                      <FaBus />
                    </IconContext.Provider>
                  )}
                </div>
                <div>
                  <p key={Math.random()}> {step.instructions} </p>

                  <p key={Math.random()}> {step.distance.text} </p>
                  {step.travel_mode === "WALKING" ? (
                    <p key={Math.random()}> {step.duration.text} </p>
                  ) : (
                    <p key={Math.random()}>
                      {" "}
                      <span
                        style={{
                          backgroundColor: "red",
                          borderRadius: "10px",
                          padding: "3px",
                        }}
                      >
                        <JourneyPrediction
                          step={step}
                          dateTime={props.dateTime}
                        ></JourneyPrediction>
                      </span>{" "}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // when it is exclusively walking
        <div>
          <div>
            <Warning
              error={
                "No transport options found for this route at the indicated time."
              }
            ></Warning>
          </div>
          <div key={Math.random()} className={classes.route_details}>
            <div className={classes.route_icon}>
              <IconContext.Provider
                value={{
                  size: "1.5rem",
                  color: "#F1B23E",
                }}
              >
                <FaWalking />
              </IconContext.Provider>
            </div>
            <div>
              <p key={Math.random()}>
                {" "}
                Walk to {props.route.legs[0].end_address}{" "}
              </p>

              <p key={Math.random()}> {props.route.legs[0].distance.text} </p>

              <p key={Math.random()}> {props.route.legs[0].duration.text} </p>
            </div>
          </div>
        </div>
      )}
    </AccordionDetails>
  );
};

export default RouteOptionDetails;
