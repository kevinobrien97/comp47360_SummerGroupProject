import "./Navbar.css";
import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";
import React, { useState, useCallback, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
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
    throw new Error("Something went wrong loading weather");
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

return (
    <div className="nav-items">
      <AppBar
        position="static"
        style={{
          boxShadow: "0px 0px 0px 0px",
          backgroundColor: "darkgrey",
        }}>
      
        <Toolbar>
          <Typography variant="h6"  />
            <Stack direction="row" ></Stack>
            <Button aria-label="center back" size="large" onClick={props.toggleDrawer}>
              {<FaEllipsisV />}
            </Button>
            <Link to={'/'}><Button color="inherit">Home</Button></Link>            <Button onClick={props.openLogIn} color="inherit">SignUp/Login</Button>
            <div className="weather-container">
              <div className="display-weather">
                <p> {weatherContent} </p>
              </div>
            </div>
          </Toolbar>        
      </AppBar>
    </div>
  );
};
export default Navbar;
