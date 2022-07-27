import { React, useState } from "react";
import Map from "./components/PrimaryContent/Map";
import Navbar from "./components/Navbar/Navbar";
import LogIn from "./components/Navbar/LogIn";
import SignUp from "./components/Navbar/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  const [userLoggedOut, setUserLoggedOut] = useState(true);

  return (
    <div>
      <Router>
        <AuthProvider>
          <Navbar
            userLoggedOut={userLoggedOut}
            setUserLoggedOut={setUserLoggedOut}
          ></Navbar>
          <Routes>
            <Route
              path="/"
              element={<Map setUserLoggedOut={setUserLoggedOut} />}
            />
            <Route
              path="/login/"
              element={
                <LogIn
                  userLoggedOut={userLoggedOut}
                  setUserLoggedOut={setUserLoggedOut}
                ></LogIn>
              }
            />
            )
            <Route
              path="/register/"
              element={
                <SignUp
                  userLoggedOut={userLoggedOut}
                  setUserLoggedOut={setUserLoggedOut}
                ></SignUp>
              }
            />
            )
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
