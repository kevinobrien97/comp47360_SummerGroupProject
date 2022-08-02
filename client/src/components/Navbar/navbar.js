import { React, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavDrawer from "./NavDrawer";
// import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AccountOptions from "./AccountOptions";
import WeatherStatus from "./WeatherStatus";

const Navbar = (props) => {
  const { user, logoutUser } = useContext(AuthContext);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#323336",
      }}
    >
      {isMatch ? (
        // mobile
        <Toolbar>
          <WeatherStatus></WeatherStatus>
          <NavDrawer
            toggleLogIn={props.toggleLogIn}
            toggleRegister={props.toggleRegister}
          ></NavDrawer>
        </Toolbar>
      ) : (
        // desktop
        <Toolbar>
          <Grid>
            {/* <Link to={"/"} style={{ textDecoration: "none" }}> */}
            <Button
              sx={{
                backgroundColor: "#F1B23E",
                height: "4rem",
                minWidth: "6rem",
                marginLeft: -3,
                color: "black",
                borderRadius: "0",
                fontSize: "90%",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "black",
                },
              }}
              // reload on click
              onClick={() => window.location.reload(false)}
            >
              ShuttleUp&nbsp;
              <img
                src={require("./images/bus.png")}
                height={"100%"}
                width={"100%"}
                alt={"bus logo"}
              />
            </Button>
            {/* </Link> */}

            {!user ? (
              // span is parent element of ternary - using so it keeps to the same line
              <span>
                {/* <Link to={"/login/"} style={{ textDecoration: "none" }}> */}
                <Button
                  sx={{
                    backgroundColor: "black",
                    height: "4rem",
                    minWidth: "6rem",
                    borderColor: "#323336",
                    color: "white",
                    borderRadius: "0",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "black",
                    },
                  }}
                  onClick={props.toggleLogIn}
                >
                  Login
                </Button>
                {/* </Link>
                <Link to={"/register/"} style={{ textDecoration: "none" }}> */}
                <Button
                  sx={{
                    backgroundColor: "black",
                    height: "4rem",
                    minWidth: "6rem",
                    borderColor: "#323336",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "black",
                    },
                  }}
                  onClick={props.toggleRegister}
                  color="inherit"
                >
                  Register
                </Button>
                {/* </Link> */}
              </span>
            ) : (
              <AccountOptions
                user={user}
                logoutUser={logoutUser}
              ></AccountOptions>
            )}
          </Grid>
          <WeatherStatus></WeatherStatus>
        </Toolbar>
      )}
    </AppBar>
  );
};
export default Navbar;
