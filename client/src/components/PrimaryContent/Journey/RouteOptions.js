import classes from "./RouteOptions.module.css";
import { Button } from "@mui/material";

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
    <div style={{ display: "flex", justifyContent: "left" }}>
      <div className={classes.back_ground} onClick={hideRoutes}></div>
      <div className={classes.route}style={{marginTop:"10rem", marginLeft:"3.5%"}}>
        <ul className={classes.route_options}>
          <div className="test">
          {props.options.map((option) => (
            <li key={option.id}>
              <Button
                value={option.id}
                onClick={pickRoute}
                sx={{
                  marginTop: ".5rem",
                  backgroundColor: "black",
                  width: 370,
                  color: "white",
                  border: 2,
                  padding: 1.5,
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: 'black',
                  }
                }}    
              >
                Arrival Time: {option.time}
              </Button>
            </li>
          ))}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default RouteOptions;
