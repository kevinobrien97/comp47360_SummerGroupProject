import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

// export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);
  // console.log("userauth", user);
  // const navigate = useNavigate();

  const loginUser = async (username, password, setError, toggleLogIn) => {
    // iniitally want error deleted if one was there previously
    setError(null);
    try {
      const res = await axios.post(
        // "http://127.0.0.1:8000/api/token/",
        "http://44.208.26.245/api/token/",
        {
          username: username,
          password: password,
        },
        null
      );
      console.log("res", res);
      const data = res.data;
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      toggleLogIn()
      // navigate("/");
    } catch (e) {
      setError("Username or password were entered incorrectly.");
    }
  };

  const registerUser = async (
    username,
    password,
    password2,
    setSignupError,
    toggleLogIn,
    toggleRegister
  ) => {
    // iniitally want error deleted if one was there previously
    setSignupError(null);
    try {
      const res = await axios.post(
        // "http://127.0.0.1:8000/api/register/",
        "http://44.208.26.245/api/register/",
        {
          username: username,
          password: password,
          password2: password2,
        },
        null
      );
      console.log(res);
      // );
      // const response = await fetch("http://127.0.0.1:8000/api/register/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username,
      //     password,
      //     password2,
      //   }),
      // });
      // if (response.status === 201) {
      //   console.log(response);
      // history.push("/login");
      // navigate("/login/");
      toggleRegister()
      toggleLogIn()
    } catch (e) {
      if (e.response.data.username) {
        setSignupError(e.response.data.username[0])
      }
      else if (e.response.data.password) {
        setSignupError(e.response.data.password[0])
      }
      // catch all
      else {
        setSignupError("Error creating account.")
      }
      console.log(e.response.data);
    }
  };

  const logoutUser = () => {
    // console.log("logging out");
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    // navigate("/");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
