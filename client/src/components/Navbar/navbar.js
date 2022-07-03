import "./Navbar.css";
import { AppBar, Toolbar, Typography, Stack, Button, Grid, useMediaQuery, useTheme} from "@mui/material";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import NavDrawer from "./NavDrawer"
import React, { useState, useCallback, useEffect } from "react";
import {Link } from "react-router-dom"
// npm install @mui/material @emotion/react @emotion/styled
const Navbar = (props) => {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
const [value, setValue] = useState(); 
return (
    <div className="nav-items">
      <AppBar
        position="static"
        style={{
          boxShadow: "0px 0px 0px 0px",
          backgroundColor: "darkgrey",
        }}>
      
          {isMatch ? (
            <div className="mobile-view">
              <Toolbar>
                <div className="weather-container">
                    <div className="display-weather">
                      {weatherContent}
                    </div>
                </div>
                  <NavDrawer></NavDrawer> 
              </Toolbar>               
            </div>
          ) : (
            <div className="desktop-view">
              <Toolbar>
                <Grid container spacing="12" sx={{placeItems: "left"}}>
                  <Typography variant="h6"  />
                    <Grid item xs={9}>
                      <Stack direction="row" ></Stack>
                      <Link to={'/'}><Button color="inherit">Home</Button></Link>            
                      <Button onClick={props.openLogIn} color="inherit">SignUp/Login</Button>
                    </Grid>
                </Grid>
                <div className="weather-container">
                  <div className="display-weather">
                    {weatherContent}
                  </div>
                </div>
              </Toolbar>
            </div>
          
          )
          }
               
      </AppBar>
    </div>
  );
};
export default Navbar;
