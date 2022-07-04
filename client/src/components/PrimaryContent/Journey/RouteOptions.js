import classes from "./RouteOptions.module.css";
import { Button } from "@mui/material";
import React from 'react'
import ReactDOM from 'react-dom'
const RouteOptions = (props) => {
  //   const [chosenRoute, setChosenRoute] = useState();

  console.log("props", props.options);

  const pickRoute = (event) => {
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
          {props.options.map((option) => (
            <li key={option.id}>
              <Button
                style={bgColor(option.id)}
                value={option.id}
                onClick={pickRoute}
              >
                Arrival Time: {option.time}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteOptions;
