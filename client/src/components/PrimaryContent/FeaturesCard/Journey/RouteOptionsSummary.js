import { React } from "react";
import { Accordion, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaBus, FaWalking } from "react-icons/fa";
import RouteOptionDetails from "./RouteOptionDetails";
import classes from "./RouteOptions.module.css";

const RouteOptionsSummary = (props) => {
  return (
    <Accordion disableGutters={true}>
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          borderTop: "0.05rem solid lightgrey",
        }}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        // value={index}
        onClick={() => {
          props.selectedRoute(props.index);
        }}
      >
        <span className={classes.tripSummary}>
          {props.route.legs[0].steps.map((step, idx) =>
            idx === 0 ? (
              // {/* if its the first then dont want an arrow (i.e. '>') */}
              step.travel_mode === "WALKING" ? (
                <span key={Math.random()} style={{ pointerEvents: "none" }}>
                  <FaWalking />
                </span>
              ) : // the below query checks if the bus used is outside main network (this will have line.name instead of line.short_name) and gives different bg colour
              // could use similar logic later for whether we have our own prediction or not
              // <span key={idx} style={{ pointerEvents: "none" }}>
              //     <FaBus /> <span style={{ backgroundColor: "yellow", borderRadius: "10px", padding: "3px"}}> {step.transit.line.short_name || step.transit.line.short_name}</span>
              // </span>
              step.transit.line.short_name ? (
                <span key={Math.random()} style={{ pointerEvents: "none" }}>
                  <FaBus />{" "}
                  <span
                    style={{
                      backgroundColor: "green",
                      borderRadius: "10px",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    {step.transit.line.short_name}
                  </span>
                </span>
              ) : (
                <span key={Math.random()} style={{ pointerEvents: "none" }}>
                  <FaBus />{" "}
                  <span
                    style={{
                      backgroundColor: "yellow",
                      borderRadius: "10px",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    {step.transit.line.name}
                  </span>
                </span>
              )
            ) : step.travel_mode === "WALKING" ? (
              <span key={Math.random()} style={{ pointerEvents: "none" }}>
                {" > "}
                <FaWalking />
              </span>
            ) : // the below query checks if the bus used is outside main network (this will have line.name instead of line.short_name) and gives different bg colour
            // could use similar logic later for whether we have our own prediction or not
            step.transit.line.short_name ? (
              <span key={Math.random()} style={{ pointerEvents: "none" }}>
                {" > "}
                <FaBus />{" "}
                <span
                  style={{
                    backgroundColor: "#F1B23E",
                    borderRadius: "10px",
                    padding: "3px",
                  }}
                >
                  {" "}
                  {step.transit.line.short_name}
                </span>
              </span>
            ) : (
              <span key={Math.random()} style={{ pointerEvents: "none" }}>
                {" > "}
                <FaBus />{" "}
                <span
                  style={{
                    backgroundColor: "yellow",
                    borderRadius: "10px",
                    padding: "3px",
                  }}
                >
                  {" "}
                  {step.transit.line.name}
                </span>
              </span>
            )
          )}
        </span>
        <span
          style={{
            backgroundColor: "#F1B23E",
            borderRadius: "10px",
            padding: "3px",
            margin: "0.25rem",
            marginLeft: "auto",
          }}
        >
          {props.route.legs[0].total_journey_time} mins
        </span>
      </AccordionSummary>
      <RouteOptionDetails
        route={props.route}
        dateTime={props.dateTime}
      ></RouteOptionDetails>
    </Accordion>
  );
};
export default RouteOptionsSummary;
