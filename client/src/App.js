import React, { useState, useCallback, useEffect } from "react";
// import "./App.css";
import Map from "./components/PrimaryContent/Map";
import Navbar from "./components/Navbar/Navbar";
import SideContainer from "./components/PrimaryContent/FeaturesCard/SideContainer.js"
import { BrowserRouter, Routes} from "react-router-dom";
import LogIn from "./components/Navbar/LogIn";
import SignUp from "./components/Navbar/SignUp";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import  { AuthProvider }  from "./context/AuthContext";
function App() {
  const [logInWindow, setLogInWindow] = useState(false);

  const closeLogIn = () => {
    setLogInWindow(false);
  };

  const openLogIn = () => {
    setLogInWindow(true);
  };

  const [SignUpWindow, setSignUpWindow] = useState(false);

  const closeSignUp = () => {
    setSignUpWindow(false);
  };

  const openSignUp = () => {
    setSignUpWindow(true);
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

  const [isDesktop, setDesktop] = useState(window.innerWidth > 480);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 480);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    // initially divided as I intended to incorporate mobile optimisations by using 2 different renders in app js (one for desktop and one for mobile)
    //don't think it is needed anymore - flagged for future change 
    <div className="App">
      <Router>
        <AuthProvider>
        <Navbar openLogIn={openLogIn} openSignUp={openSignUp}></Navbar>
        <Routes>
          <Route path="/" element={<Map/>}/>
        </Routes>
        {logInWindow && <LogIn closeLogIn={closeLogIn}></LogIn>}
        {SignUpWindow && <SignUp closeSignUp={closeSignUp}></SignUp>}        </AuthProvider>
      </Router>
    </div>
  )
}

export default App;
