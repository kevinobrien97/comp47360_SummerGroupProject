import { React, useState } from "react";
import Map from "./components/PrimaryContent/Map";
import Navbar from "./components/Navbar/Navbar";
import LogIn from "./components/Navbar/LogIn";
import SignUp from "./components/Navbar/SignUp";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  const [userLoggedOut, setUserLoggedOut] = useState(false);
  const [logInWindow, setLogInWindow] = useState(false);
  const [registerWindow, setRegisterWindow] = useState(false);

  const toggleLogIn = () => {
    setLogInWindow(!logInWindow);
  };
  const toggleRegister = () => {
    setRegisterWindow(!registerWindow);
  };
  return (
    <div>
      <Router>
        <AuthProvider>
          <Navbar
            toggleLogIn={toggleLogIn}
            toggleRegister={toggleRegister}
          ></Navbar>
          {/* <Routes>
            <Route
              path="/"
              element={<Map setUserLoggedOut={setUserLoggedOut} />}
            /> */}
          <Map
            setUserLoggedOut={setUserLoggedOut}
            toggleLogIn={toggleLogIn}
            toggleRegister={toggleRegister}
          />
          {/* <Route
              path="/login/"
              element={ */}
          {logInWindow && (
            <LogIn
              userLoggedOut={userLoggedOut}
              setUserLoggedOut={setUserLoggedOut}
              toggleLogIn={toggleLogIn}
              toggleRegister={toggleRegister}
            ></LogIn>
          )}
          {/* }
            /> */}
          {/* ) */}
          {/* <Route
              path="/register/"
              element={ */}
          {registerWindow && (
            <SignUp
              userLoggedOut={userLoggedOut}
              setUserLoggedOut={setUserLoggedOut}
              toggleLogIn={toggleLogIn}
              toggleRegister={toggleRegister}
            ></SignUp>
          )}
          {/* }
            />
            )
          </Routes> */}
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
