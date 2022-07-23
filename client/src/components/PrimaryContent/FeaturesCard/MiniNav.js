import { React } from "react";
import classes from "./MiniNav.module.css";
// import classes from "./SideContainer.module.css";
import { AppBar, Toolbar, Button } from "@mui/material";

const MiniNav = (props) => {
  return (
    <div className={classes.mininav_items}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#F1B23E",
          borderRadius: "10px",
        }}
      >
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: true,
                route: false,
                stop: false,
                favourites: false,
              })
            }
          >
            Journey
          </Button>
          <Button
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: false,
                route: true,
                stop: false,
                favourites: false,
              })
            }
          >
            Routes
          </Button>
          <Button
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: false,
                route: false,
                stop: true,
                favourites: false,
              })
            }
          >
            Stops
          </Button>
          <Button
            color="inherit"
            type="button"
            onClick={() =>
              props.setSidebarOption({
                journey: false,
                route: false,
                stop: false,
                favourites: true,
              })
            }
          >
            Favourites
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default MiniNav;
