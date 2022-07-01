import React, { useState, useCallback, useEffect } from "react";
// import "./App.css";
import Map from "./components/PrimaryContent/Map";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./components/Navbar/LogIn";

function App() {
  const [logInWindow, setLogInWindow] = useState(false);
  const [drawer, setDrawer] = useState(true);

  const toggleLogIn = () => {
    // set the opposite of what it is
    setLogInWindow(!logInWindow);
    console.log("Hello");
  };

  const toggleDrawer = () => {
    // set the opposite of what it is
    setDrawer(!drawer);
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

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    <BrowserRouter>
      {isDesktop ? (
      <div> 
        <Navbar openLogIn={toggleLogIn} toggleDrawer={toggleDrawer}></Navbar>
        <Routes>
          <Route path="/" element={<Map drawer={drawer} />}/>
        </Routes>
        {logInWindow && <LogIn closeLogIn={toggleLogIn}></LogIn>}
      </div>
      ) : (
      <div>
        <Navbar openLogIn={toggleLogIn} toggleDrawer={toggleDrawer}></Navbar>
        {logInWindow && <LogIn closeLogIn={toggleLogIn}></LogIn>}

      </div>
      )}

    </BrowserRouter>
  );
}

export default App;
