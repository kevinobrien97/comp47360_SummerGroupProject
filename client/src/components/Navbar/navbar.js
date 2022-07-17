import { React, useState, useContext, useCallback, useEffect } from "react";
import "./Navbar.css";
import { AppBar, Toolbar, Typography, Stack, Button, Grid, useMediaQuery, useTheme} from "@mui/material";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import NavDrawer from "./NavDrawer"
import {Link } from "react-router-dom"
import AuthContext from "../../context/AuthContext";

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
    <div className="nav-items">
      <AppBar
        position="static"
        style={{
          backgroundColor: "#323336",
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
                      <Link to={'/'}>
                        <Button 
                        sx={{
                        backgroundColor: "#F1B23E",
                        height: "4rem",
                        marginLeft: -3,
                        borderRadius: 0,
                        padding: 3,
                        color: "white",
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: 'black',
                        }
                      }}>Home</Button>
                      </Link>  

                      {!user ? (
                      <Link to={'/login/'}>          
                      <Button
                      sx={{
                        backgroundColor: "black",
                        height: "4rem",
                        borderLeft: 1,
                        padding: 2.5,
                        borderColor: "#323336",
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: 'black',
                        }

  
                      }} 
                      onClick={props.openLogIn} color="inherit">Login</Button>
                       </Link> 
                       ):(

                          
                      <Button
                      sx={{
                        backgroundColor: "black",
                        height: "4rem",
                        borderLeft: 1,
                        padding: 2.5,
                        borderColor: "#323336",
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: 'black',
                        }

  
                      }} 
                      onClick={logoutUser} color="inherit">{user.username}</Button>
           
                       )}
                      {console.log('user',user)}
                      <Button
                      sx={{
                        backgroundColor: "black",
                        height: "4rem",
                        borderLeft: 1,
                        padding: 2,
                        borderColor: "#323336",
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: 'black',
                        }

  
                      }} 
                      onClick={props.openSignUp} color="inherit">Sign-Up</Button>                      
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
