import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import Map from "./components/Map/Map";
import RouteOptions from "./components/Map/RouteOptions";
import Navbar from "./components/Navbar/navbar";

function App() {
  const [allRoutes, setAllRoutes] = useState();
  const getRoutesHandler = (r) => {
    console.log("app", r);
    // setAllRoutes([{ number: r, route: "hello" }]);
    const transformedRoutes = r.map((route) => {
      return {
        id: Math.random().toString(),
        time: route.legs[0].arrival_time.text,
      };
    });
    setAllRoutes(transformedRoutes);
  };

  const cancelRoutesHandler = () => {
    setAllRoutes();
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
      <Navbar />
      {/* {content} */}
      {/* display component only if route options available */}
      {allRoutes && <RouteOptions options={allRoutes}></RouteOptions>}
      <Map
        onJourney={getRoutesHandler}
        onCancelJourney={cancelRoutesHandler}
      ></Map>
    </div>
  );
}

export default App;
