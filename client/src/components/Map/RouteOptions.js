import "./RouteOptions.css";
import { Button } from "@mui/material";
import { useState } from "react";

const RouteOptions = (props) => {
//   const [chosenRoute, setChosenRoute] = useState();

  console.log("props", props.options);

  const pickRoute = (event) => {
    console.log("event", event.target.value);
    
    props.selectedRoute(event.target.value);
    console.log('test')
  };

  // conditionally sets bg colour of options
  const bgColor = (id) => {
    if (id===parseInt(props.chosenRoute)){
       return {backgroundColor:"blue"}
    }
    return {backgroundColor:"white"}
  }

  return (
    <ul className="route-options">
      {props.options.map((option) => (
        <li key={option.id}>
            {console.log('chosen', typeof(props.chosenRoute))}
          <Button style={bgColor(option.id)} value={option.id} onClick={pickRoute}>
            Arrival Time: {option.time}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default RouteOptions;
