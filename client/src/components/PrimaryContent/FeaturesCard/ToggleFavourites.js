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
              props.setError(null);
              // setSelectedStopList(null);
            }}
          >
            <span style={{ color: "#F1B23E" }}>
              View Favourites &nbsp;
              <HiOutlineArrowNarrowRight />
            </span>
          </Button>
        </div>
      ) : (
        <div className={classes.regularView}>
          <Button
            onClick={() => {
              props.setViewFavourites(false);
              props.setError(null);
              // setSelectedStopList(null);
            }}
          >
            <span style={{ color: "#F1B23E" }}>
              <HiOutlineArrowNarrowLeft />
              &nbsp;Back to Search
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ToggleFavourites;
