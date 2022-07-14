import React from "react";
import classes from "./RouteOptions.module.css";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaBus, FaWalking } from "react-icons/fa";

const RouteOptions = (props) => {
  //   const [chosenRoute, setChosenRoute] = useState();

  console.log("props", props.options);

  const pickRoute = (event) => {
    console.log("triggered", event.target.value);
    props.selectedRoute(event.target.value);
  };

  // conditionally sets bg colour of options
  const bgColor = (id) => {
    if (id === parseInt(props.chosenRoute)) {
      return;
      // return { backgroundColor: "blue" };
    }
  };

  // const hideRoutes = () => {
  //   props.removeRoutes();
  // };
  return (
    // <div style={{ display: "flex", justifyContent: "center"}}>

    //   <div className={classes.route}>
    //   <ul className={classes.route_options}>
    //       {props.options.map((route, index) => (
    //         <React.Fragment key={index}>
    //         <li className="list-elems">
    //           <Button
    //             style={bgColor(index)}
    //             value={index}
    //             onClick={pickRoute}
    //             sx={{

    //               '&:hover': {
    //                 backgroundColor: 'white',
    //                 color: 'black',
    //               }
    //             }}
    //           >
    <div>
      {props.options.map((route, index) => (
        <React.Fragment key={index}>
          {/* <Button
               
                value={index}
                onClick={pickRoute}> */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              // value={index}
              onClick={() => {props.selectedRoute(index);}}
            >
              <Typography>
                {route.legs[0].steps.map((step, idx) =>
                  idx === 0 ? (
                    // {/* if its the first then dont want an arrow (i.e. '>') */}
                    step.travel_mode === "WALKING" ? (
                      <span key={idx} style={{ pointerEvents: "none" }}>
                        <FaWalking />
                      </span>
                    ) : (
                      <span key={idx} style={{ pointerEvents: "none" }}>
                        <FaBus /> <span style={{ backgroundColor: "green", borderRadius: "10px", padding: "3px"}}> {step.transit.line.short_name}</span>
                      </span>
                    )
                  ) : step.travel_mode === "WALKING" ? (
                    <span key={idx} style={{ pointerEvents: "none" }}>
                      {" > "}
                      <FaWalking />
                    </span>
                  ) : (
             
                    <span key={idx} style={{ pointerEvents: "none" }}>
                      {" > "}
                      <FaBus />  <span style={{ backgroundColor: "#F1B23E", borderRadius: "10px", padding: "3px"}}> {step.transit.line.short_name}</span> 
                    </span>
                    
                  )
                )}
               {/* <span style={{ pointerEvents: "none" }}>{route.legs[0].arrival_time.text}</span> */}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>placeholder</Typography>
            </AccordionDetails>
          </Accordion>
        </React.Fragment>
      ))}
    </div>
    //               </Button>
    //             </li>
    //             </React.Fragment>
    //           ))}
    //         </ul>
    //       </div>
    //     </div>
  );
};

export default RouteOptions;
