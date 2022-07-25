import { React } from "react";
import { Button } from "@mui/material";
import classes from "./Stops_routes.module.css";
import {
    HiOutlineArrowNarrowLeft,
    HiOutlineArrowNarrowRight,
  } from "react-icons/hi";

const ToggleFavourites = (props) => {
  return (
    <div>
      {!props.viewFavourites ? (
        <div className={classes.viewingFavs}>
          <Button
            onClick={() => {
              props.setViewFavourites(true);
              // setSelectedStopList(null);
            }}
          >
            <span style={{ color: "#F1B23E" }}>
              View Favourite Stops &nbsp;
              <HiOutlineArrowNarrowRight />
            </span>
          </Button>
        </div>
      ) : (
        <div className={classes.regularView}>
          <Button
            onClick={() => {
              props.setViewFavourites(false);
              // setSelectedStopList(null);
            }}
          >
            <span style={{ color: "#F1B23E" }}>
              <HiOutlineArrowNarrowLeft />
              &nbsp;Back to Stop Search
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ToggleFavourites;
