// below component inspired by https://blog.devgenius.io/django-rest-framework-react-authentication-workflow-2022-part-2-d299b7fef875

import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
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
  const loginUser = async (username, password, setError, toggleLogIn) => {
    // iniitally want error deleted if one was there previously
    setError(null);
    try {
      const res = await axios.post(
        // "http://127.0.0.1:8000/api/token/",
        "http://54.157.240.210/api/token/",
        {
          username: username,
          password: password,
        },
        null
      );
      const data = res.data;
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      toggleLogIn();
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
      await axios.post(
        // "http://127.0.0.1:8000/api/register/",
        "http://54.157.240.210/api/register/",
        {
          username: username,
          password: password,
          password2: password2,
        },
        null
      );
      toggleRegister();
      toggleLogIn();
    } catch (e) {
      if (e.response.data.username) {
        setSignupError(e.response.data.username[0]);
      } else if (e.response.data.password) {
        setSignupError(e.response.data.password[0]);
      }
      // catch all
      else {
        setSignupError("Error creating account.");
      }
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
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
