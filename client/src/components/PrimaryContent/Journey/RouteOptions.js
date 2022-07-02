import React from "react";
import classes from "./RouteOptions.module.css";
import { Button } from "@mui/material";
import { FaBus, FaWalking } from "react-icons/fa";


const RouteOptions = (props) => {
  //   const [chosenRoute, setChosenRoute] = useState();

  console.log("props", props.options);

  const pickRoute = (event) => {
    console.log('triggered', event.target)
    props.selectedRoute(event.target.value);
  };

  // conditionally sets bg colour of options
  const bgColor = (id) => {
    if (id === parseInt(props.chosenRoute)) {
      return { backgroundColor: "blue" };
    }
    return { backgroundColor: "white" };
  };

  const hideRoutes = () => {
    props.removeRoutes();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className={classes.back_ground} onClick={hideRoutes}></div>
      <div className={classes.route}>
        <ul className={classes.route_options}>
          {props.options.map((route, index) => (
            <React.Fragment key={index}>
            <li>
              <Button
                style={bgColor(index)}
                value={index}
                onClick={pickRoute}
               
              >

                {route.legs[0].steps.map((step,idx) => (
              
                  (step.travel_mode === "WALKING" ? 
                  <span key={idx} style={{ pointerEvents: "none" }}><FaWalking /></span>:
                  <span key={idx} style={{ pointerEvents: "none" }}><FaBus /> {step.transit.line.short_name}</span>)

                ))}
                Time: {route.legs[0].arrival_time.text}
       
              </Button>
            </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteOptions;
