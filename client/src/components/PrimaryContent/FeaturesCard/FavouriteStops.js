import { React } from "react";
import { Button, IconButton, Accordion, AccordionSummary } from "@mui/material";
import classes from "./Favourites.module.css";
import { FaTrash } from "react-icons/fa";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StopDetails from "./StopDetails";

const FavouriteStops = (props) => {
  const day = new Date();
 
  console.log(day.toTimeString().split(' ')[0])
  const removeStop = (idx) => {
    const stop = props.stops[idx];
    console.log(stop);
    // update stopIDList
    props.setStopsList(props.stops.filter((item) => item !== stop));
    // call method to delete from database
    props.deleteStop(stop.stop_id);
  };

  return (
    <div className={classes.favouriteStops}>
      <h3
        style={{
          marginTop: "0.75rem",
          marginBottom: "0.75rem",
          textAlign: "center",
        }}
      >
        Your Favourite Stops
      </h3>
      {props.stops[0] ? (
        <div>
          {props.stops.map((stop, index) => (
            <div
              key={stop.stop_id}
              style={{
                minWidth: "100%",
                width: "25rem",
                borderTop: "0.05rem solid lightgrey",
              }}
            >
              <Accordion
                disableGutters={true}
                onClick={() => props.setMarker(stop.stop_lat, stop.stop_long)}
              >
                <AccordionSummary
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "25rem",
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  // value={index}
                  // onClick={() => {
                  //   props.selectedRoute(index);
                  // }}
                >
                  <div
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      paddingLeft: "0.30rem",
                    }}
                  >
                    {stop.stop_name}
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                    }}
                  >
                    <IconButton onClick={(e) => removeStop(index)} size="sm">
                      <FaTrash />
                    </IconButton>
                  </div>
                </AccordionSummary>
                <StopDetails stop={stop} day={day}></StopDetails>
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>You haven't selected any favourite stops yet.</p>
          <p>Add stops with the search bar to stay updated!</p>
        </div>
      )}
    </div>
    //   {console.log("bug", props.stops)}
    //   {props.stops[0] ? (
    //     <ul className={classes.stop_options}>
    //       {props.stops.map((stop, index) => (
    //         <li key={stop.stop_id}>
    //           <Button
    //             sx={{
    //               backgroundColor: "black",
    //               width: 330,
    //               color: "white",
    //               border: 3,
    //               borderRadius: 5,
    //               padding: 1,
    //               "&:hover": {
    //                 backgroundColor: "#fff",
    //                 color: "black",
    //               },
    //             }}
    //             // style={bgColor(stop.stop_id)}
    //             value={index}
    //             onClick={pickStops}
    //           >
    //             {stop.stop_name}
    //           </Button>
    //           <IconButton onClick={(e) => removeStop(index)} size="sm">
    //             <FaTrash />
    //           </IconButton>
    //         </li>
    //       ))}
    //     </ul>
    //   )
    // </div>
  );
};

export default FavouriteStops;
