import { React } from "react";
import { IconButton, Accordion, AccordionSummary } from "@mui/material";
import classes from "../Stops_routes.module.css";
import { FaTrash } from "react-icons/fa";
import { MdClear } from "react-icons/md";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StopDetails from "./StopDetails";

const StopList = (props) => {
  // different delete methods depending if viewing favourites or not

  const removeFavStop = (idx) => {
    const stop = props.stops[idx];
    // open dialogue
    props.deleteStop(stop);
    props.setShowDelete(true);
  };

  const removeStop = (idx) => {
    const stop = props.stops[idx];
    props.setStopsList(props.stops.filter((item) => item !== stop));
  };

  return (
    <div>
      {props.viewFavourites ? (
        <h3 className={classes.h3}>Your Favourite Stops</h3>
      ) : (
        <h3 className={classes.h3}>Selected Stops</h3>
      )}

      {props.stops[0] ? (
        <div>
          {props.stops.map((stop, index) => (
            <div
              key={stop.stop_id}
              style={{
                minWidth: "100%",
                // width: "25rem",
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
                    // width: "25rem",
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
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
                    {props.viewFavourites ? (
                      <IconButton
                        onClick={(e) => removeFavStop(index)}
                        size="sm"
                      >
                        <FaTrash />
                      </IconButton>
                    ) : (
                      <IconButton onClick={(e) => removeStop(index)} size="sm">
                        <MdClear />
                      </IconButton>
                    )}
                  </div>
                </AccordionSummary>
                <StopDetails
                  stop={stop}
                  time={props.time}
                  daySelection={props.daySelection}
                  timeClicked={props.timeClicked}
                  setTimeClicked={props.setTimeClicked}
                ></StopDetails>
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.no_selection}>
          {props.viewFavourites ? (
            <div>
              <p>You haven't selected any favourite stops yet.</p>
              <p>Add stops with the search bar to stay updated!</p>
            </div>
          ) : (
            <p>Add stops with the search bar to view schedule information.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StopList;
