import { React, useState, useCallback, useEffect } from "react";
import classes from "./WeatherStatus.module.css";

const WeatherStatus = (props) => {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchWeatherData = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/weather/");
      if (!response.ok) {
        throw new Error("404");
      }
      const data = await response.json();
      console.log(data[0]);
      setWeather(data[0]);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // handling possible output states
  let weatherContent = <p>Sending request...</p>;
  if (Object.keys(weather).length >= 0) {
    weatherContent = <p>{weather["temperature"]}ºC</p>;
  }
  if (error) {
    weatherContent = <p>{error}</p>;
  }
  if (isLoading) {
    weatherContent = <p>...</p>;
  }

  return (
    <div className={classes.weather_container}>
      <div className={classes.display_weather}>{weatherContent}</div>
    </div>
  );
};

export default WeatherStatus;
