import { React, useState, useCallback, useEffect } from "react";
import "./SideContainer.css";
import MiniNav from "./MiniNav.js";
import Nearest from "./Nearest";
import Route from "./Route";
import Stop from "./Stop";
import Favourites from "./Favourites";

const SideContainer = (props) => {
  const [sidebarOption, setSidebarOption] = useState({
    nearest: true,
    route: false,
    stop: false,
    favourites: false,
  });

  function setMarker (lat, long) {
    const pos = { lat: lat, lng: long };
    props.setStopMarker(pos);
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
      setStops(data);
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

  // will need to update these with actual data obviously
  // const stops1 = [
  //   {stop_id: "8220DB000002", stop_name: "Parnell Square West, stop 2", stop_number: "2", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000011", stop_name: "St Joseph's Parade, stop 11", stop_number: "11", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000012", stop_name: "Upper Dorset Street, stop 12", stop_number: "12", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000014", stop_name: "Dorset Street Lower, stop 14", stop_number: "14", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000015", stop_name: "Innisfallen Parade, stop 15", stop_number: "15", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000016", stop_name: "Nephin Road Park, stop 16", stop_number: "16", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000017", stop_name: "Drumcondra Rail Stn, stop 17", stop_number: "17", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000018", stop_name: "Dargle Road, stop 18", stop_number: "18", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000019", stop_name: "Botanic Avenue, stop 19", stop_number: "19", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000021", stop_name: "DCU St Patrick's, stop 21", stop_number: "21", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000022", stop_name: "Home Farm Road, stop 22", stop_number: "22", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000023", stop_name: "Ferguson Road, stop 23", stop_number: "23", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000024", stop_name: "Walsh Road, stop 24", stop_number: "24", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  //   {stop_id: "8220DB000025", stop_name: "Rathlin Road, stop 25", stop_number: "25", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  // ]

  return (
    <div className="side-container">
      <MiniNav setSidebarOption={setSidebarOption} />

      <div className="display">
        {sidebarOption.nearest && <Nearest></Nearest>}
        {sidebarOption.route && <Route></Route>}
        {sidebarOption.stop && !isLoading && (
          <Stop stops={stops} setMarker={setMarker}></Stop>
        )}
        {sidebarOption.favourites && <Favourites></Favourites>}
      </div>
    </div>
  );
};
export default SideContainer;
