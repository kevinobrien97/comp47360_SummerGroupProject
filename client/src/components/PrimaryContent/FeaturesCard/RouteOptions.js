import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaBus, FaWalking } from "react-icons/fa";
import RouteOptionDetails from "./RouteOptionDetails";

const RouteOptions = (props) => {
  //   const [chosenRoute, setChosenRoute] = useState();

  console.log("props", props.options);

  // const pickRoute = (event) => {
  //   console.log("triggered", event.target.value);
  //   props.selectedRoute(event.target.value);
  // };

  // conditionally sets bg colour of options
  // const bgColor = (id) => {
  //   if (id === parseInt(props.chosenRoute)) {
  //     return;
  //     // return { backgroundColor: "blue" };
  //   }
  // };

  return (
    <>
      {props.options.map((route, index) => (
        <React.Fragment key={index}>
          {console.log(index)}
          <Accordion disableGutters={true}>
            <AccordionSummary
              sx={{ display: "flex", justifyContent: "flex-start" }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              // value={index}
              onClick={() => {
                props.selectedRoute(index);
              }}
            >
              <span style={{ marginRight: "auto" }}>
                {route.legs[0].steps.map((step, idx) =>
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
                  backgroundColor: "red",
                  borderRadius: "10px",
                  padding: "3px",
                  marginLeft: "auto",
                }}
              >
                xx:xx
              </span>
            </AccordionSummary>
            <RouteOptionDetails route={route}></RouteOptionDetails>
          </Accordion>
        </React.Fragment>
      ))}
    </>
  );
};
export default RouteOptions;
