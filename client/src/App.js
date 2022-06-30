import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import Map from "./components/PrimaryContent/Map";
import Navbar from "./components/Navbar/Navbar";
import SideContainer from "./components/FeaturesCard/SideContainer";
import LogIn from "./components/Navbar/LogIn";

function App() {
  const [logInWindow, setLogInWindow] = useState(false);

  const closeLogIn = () => {
    setLogInWindow(false);
  };

  const openLogIn = () => {
    setLogInWindow(true);
  };

  const [stops, setStops] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchStopsData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      // fetch returns a promise
      // is asynchronous
      const response = await fetch("http://127.0.0.1:8000/api/stops/");
      if (!response.ok) {
        // wont continue with next line if error thrown
        throw new Error("Something went wrong loading stops");
      }
      const data = await response.json();
      console.log(data[0]);
      setStops(data[0]);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStopsData();
  }, [fetchStopsData]);

  // handling possible output states
  let content = <p>Sending request...</p>;
  if (Object.keys(stops).length > 0) {
    content = <p>{stops["stop_name"]}</p>;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading data...</p>;
  }
// for testing first
  // const [weather, setWeather] = useState({});
  // const fetchWeatherData = useCallback(async () => {
  //   setError(null);
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/weather/");
  //     if (!response.ok) {
  //       throw new Error("Something went wrong loading weather");
  //     }
  //     const data = await response.json();
  //     console.log(data[0]);
  //     setWeather(data[0]);
  //   } catch (error) {
  //     setError(error.message);
  //   }
  //   setIsLoading(false);
  // }, []);

  // useEffect(() => {
  //   fetchWeatherData();
  // }, [fetchWeatherData]);

  // // handling possible output states
  // let content = <p>Sending request...</p>;
  // if (Object.keys(weather).length > 0) {
  //   content = <p>{weather["temperature"]}</p>;
  // }
  // if (error) {
  //   content = <p>{error}</p>;
  // }
  // if (isLoading) {
  //   content = <p>Loading data...</p>;
  // }


  return (
    <div className="App">
      <Navbar openLogIn={openLogIn}></Navbar>
      <SideContainer />
      <Map />
      {logInWindow && <LogIn closeLogIn={closeLogIn}></LogIn>}
    </div>
  );
}

export default App;
