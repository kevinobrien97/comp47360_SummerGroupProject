import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import Map from "./components/Map/Map";
import RouteOptions from "./components/Map/RouteOptions";
import Navbar from "./components/Navbar/navbar";
import SideContainer from "./components/FeaturesCard/SideContainer";
import LogIn from "./components/Navbar/LogIn";

function App() {
  const [allRoutes, setAllRoutes] = useState();
  const [chosenRoute, setChosenRoute] = useState();
  const [logInWindow, setLogInWindow] = useState(false);

  const closeLogIn = () => {
    setLogInWindow(false)
  }
  
  const openLogIn = () => {
    setLogInWindow(true)
  }


  const getRoutesHandler = (r) => {
    console.log("app", r);

    const transformedRoutes = r.map((route, index) => {
      return {
        id: index,
        time: route.legs[0].arrival_time.text,
      };
    });
    setAllRoutes(transformedRoutes);
  };

  const cancelRoutesHandler = () => {
    setChosenRoute();
    setAllRoutes();
  };

  const selectedRouteHandler = (selection) => {
    setChosenRoute(selection);
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
        throw new Error("Something went wrong");
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

  return (
    <div className="App">
      <Navbar openLogIn={openLogIn}></Navbar>
      <SideContainer />
      {/* {content} */}
      {/* display component only if route options available */}
      {allRoutes && (
        <RouteOptions
          chosenRoute={chosenRoute}
          options={allRoutes}
          selectedRoute={selectedRouteHandler}
        ></RouteOptions>
      )}
      <Map
        onJourney={getRoutesHandler}
        onCancelJourney={cancelRoutesHandler}
        chosenRoute={chosenRoute}
        // passing the setter to update the bg colour on first load
        chosenRouteSetter={setChosenRoute}
      ></Map>
      {logInWindow && <LogIn closeLogIn={closeLogIn}></LogIn>}
    </div>
  );
}

export default App;
