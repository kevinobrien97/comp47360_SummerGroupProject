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
  };

  // const hideRoutes = () => {
  //   props.removeRoutes();
  // };
  return (
    <div style={{ display: "flex", justifyContent: "center"}}>
      {/* <div className={classes.back_ground} onClick={hideRoutes}></div> */}

      <div className={classes.route}style={{marginLeft:"0%"}}>
      <ul className={classes.route_options}>
          {props.options.map((route, index) => (
            <React.Fragment key={index}>
            <li>
              <Button
                style={bgColor(index)}
                value={index}
                onClick={pickRoute}
                sx={{      
                  width: 260,
                  color: "white",
                  backgroundColor: 'black',
                  border: 2,
                  padding: 0.5,
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'black',
                  }
                }}    
              >

                {route.legs[0].steps.map((step,idx) => (

                  (idx === 0 ?
                // if its the first then dont want an arrow (i.e. '>')
                    (step.travel_mode === "WALKING" ? 
                  <span key={idx} style={{ pointerEvents: "none" }}><FaWalking /></span>:
                  <span key={idx} style={{ pointerEvents: "none" }}><FaBus /> {step.transit.line.short_name}</span>)
                    :
              
                  (step.travel_mode === "WALKING" ? 
                  <span key={idx} style={{ pointerEvents: "none" }}>{'>'}<FaWalking /> </span>:
                  <span key={idx} style={{ pointerEvents: "none" }}>{'>'}<FaBus /> {step.transit.line.short_name}</span>))

                ))}
                  ETA: {route.legs[0].arrival_time.text}
       
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