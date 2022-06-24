import React, {useState, useCallback, useEffect} from "react";
import './App.css';
import Navbar from "./components/Navbar/navbar.js"

function App() {
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
      console.log(data[0])
      setStops(data[0])
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
    content = <p>{stops['stop_name']}</p>;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if(isLoading) {
    content = <p>Loading data...</p>;
  }

  return (
    <div className="App">
      <Navbar />
      {content}
    </div>
  );
}

export default App;
