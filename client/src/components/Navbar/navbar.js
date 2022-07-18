import { React, useState, useContext, useCallback, useEffect } from "react";
import "./Navbar.css";
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavDrawer from "./NavDrawer";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AccountOptions from "./AccountOptions";

// npm install @mui/material @emotion/react @emotion/styled
const Navbar = (props) => {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, logoutUser } = useContext(AuthContext);

  const fetchWeatherData = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/weather/");
      if (!response.ok) {
        throw new Error("404");
      }
      const data = await response.json();
      console.log(data[0]);
      setWeather(data[0]);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // handling possible output states
  let weatherContent = <p>Sending request...</p>;
  if (Object.keys(weather).length >= 0) {
    weatherContent = <p>{weather["temperature"]}ºC</p>;
  }
  if (error) {
    weatherContent = <p>{error}</p>;
  }
  if (isLoading) {
    weatherContent = <p>...</p>;
  }

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  console.log(isMatch);
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
          <div className="weather-container">
            <div className="display-weather">{weatherContent}</div>
          </div>
          <NavDrawer />
        </Toolbar>
      ) : (
        // desktop
        <Toolbar>
          <Grid>
            <Link to={"/"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  backgroundColor: "#F1B23E",
                  height: "4rem",
                  minWidth: "6rem",
                  marginLeft: -3,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "black",
                  },
                }}
              >
                Home
              </Button>
            </Link>

            {!user ? (
              // span is parent element of ternary - using so it keeps to the same line
              <span>
                <Link to={"/login/"} style={{ textDecoration: "none" }}>
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
                    onClick={props.openLogIn}
                  >
                    Login
                  </Button>
                </Link>
                <Link to={"/register/"} style={{ textDecoration: "none" }}>
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
                  onClick={props.openSignUp}
                  color="inherit"
                >
                  Register
                </Button>
                </Link>
              </span>
            ) : (
              <AccountOptions user={user} logoutUser={logoutUser}></AccountOptions>
            )}
          </Grid>
          <div className="weather-container">
            <div className="display-weather">{weatherContent}</div>
          </div>
        </Toolbar>
      )}
    </AppBar>
  );
};
export default Navbar;
