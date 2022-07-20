import { React } from "react";
import { AccordionDetails, Typography } from "@mui/material";

const RouteOptionDetails = (props) => {
  return (
    <AccordionDetails>
      <Typography>
        {props.route.legs[0].steps.map((step, idx) => (
          <>
            <span key={Math.random()}> {step.instructions} </span>
            <br></br>
            <span key={Math.random()}> {step.distance.text} </span>
            <br></br>
            <span key={Math.random()}> {step.duration.text} </span>
            <br></br>
          </>
        ))}
      </Typography>
    </AccordionDetails>
  );
};

export default RouteOptionDetails;
