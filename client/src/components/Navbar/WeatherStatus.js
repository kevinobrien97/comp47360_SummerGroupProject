import { React, useState, useEffect } from "react";
import classes from "./WeatherStatus.module.css";
import LoadingSpinner from "../LoadingSpinner";

const WeatherStatus = (props) => {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //   const [weatherImage, setWeatherImage] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const response = await fetch("http://127.0.0.1:8000/api/weather/");
        if (!response.ok) {
          throw new Error("404");
        }
        const data = await response.json();
        setWeather(data[0]);
        // const iconCode = weather.weather_icon;
        // console.log(iconCode);
        // setWeatherImage(`http://openweathermap.org/img/wn/${weather.weather_icon}@2x.png`);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    fetchWeatherData();
  }, []);

  // handling possible output states
  let weatherContent = <p>Sending request...</p>;
  if (Object.keys(weather).length >= 0) {
    weatherContent = <p>{weather["temperature"]}ºC</p>;
  }
  if (error) {
    weatherContent = <p>{error}</p>;
  }
  //   if (isLoading) {
  //     weatherContent = <p>...</p>;
  //   }

  return (
    <>
    {/* only load if weather icon has loaded (will mean weather description has also loaded) */}
      {weather.weather_icon ? (
        <div className={classes.widget_container}>
          <div className={classes.weather_container}>
            <div>{weatherContent}</div>
          </div>
          <div>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather_icon}@2x.png`}
              alt="Weather Icon"
              style={{ width: "80px", height: "80px" }}
            ></img>
          </div>
        </div>
      ) : (
        <div className={classes.widget_container}>
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
    </>
  );
};

export default WeatherStatus;