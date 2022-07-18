import Map from "./components/PrimaryContent/Map";
import Navbar from "./components/Navbar/Navbar";
import LogIn from "./components/Navbar/LogIn";
import SignUp from "./components/Navbar/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {

  return (
    <div>
      <Router>
        <AuthProvider>
          <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<Map />} />
              <Route
                path="/login/"
                element={<LogIn></LogIn>}
              />
            )
              <Route
                path="/register/"
                element={<SignUp></SignUp>}
              />
            )
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
