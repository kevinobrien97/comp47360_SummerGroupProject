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
