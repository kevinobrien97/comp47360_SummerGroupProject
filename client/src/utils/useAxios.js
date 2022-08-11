// below component inspired by https://blog.devgenius.io/django-rest-framework-react-authentication-workflow-2022-part-2-d299b7fef875

import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// const baseURL = "http://127.0.0.1:8000/api";
const baseURL = "http://54.157.240.210/api";

const useAxios = (setUserLoggedOut, toggleLogIn) => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access);
    const expTime = new Date(user.exp * 1000);
    const currentTime = new Date().getTime();
    // allowing for 10 ms in case of a lag
    const isExpired = expTime - currentTime < 10;
    if (!isExpired) return req;

    // if the refresh tokens have expired then will be caught
    const refresh = jwt_decode(authTokens.refresh);
    const refreshExpTime = new Date(refresh.exp * 1000);
    const refreshIsExpired = refreshExpTime - currentTime < 10;

    if (!refreshIsExpired) {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      });
      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwt_decode(response.data.access));
      req.headers.Authorization = `Bearer ${response.data.access}`;
      return req;
    } else {
      setUser(null);
      setAuthTokens(null);
      localStorage.removeItem("authTokens");
      if (setUserLoggedOut && toggleLogIn) {
        // set error message on login screen and open login screen
        setUserLoggedOut(true);
        toggleLogIn();
      }
      // navigate('/login/');
    }
  });

  return axiosInstance;
};

export default useAxios;
