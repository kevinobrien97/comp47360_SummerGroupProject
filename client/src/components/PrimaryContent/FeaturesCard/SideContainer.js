import "./SideContainer.css";
import MiniNav from "./MiniNav.js";
import Nearest from "./Nearest"
import Route from "./Route";
import Stop from "./Stop";
import Favourites from "./Favourites";
import { useState } from "react";

const SideContainer = (props) => {
  const [sidebarOption, setSidebarOption] = useState({
    nearest: true,
    route: false,
    stop: false,
    favourites: false,
  });
  // will need to update these with actual data obviously
  const stops = [
    {stop_id: "8220DB000002", stop_name: "Parnell Square West, stop 2", stop_number: "2", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000011", stop_name: "St Joseph's Parade, stop 11", stop_number: "11", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000012", stop_name: "Upper Dorset Street, stop 12", stop_number: "12", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000014", stop_name: "Dorset Street Lower, stop 14", stop_number: "14", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000015", stop_name: "Innisfallen Parade, stop 15", stop_number: "15", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000016", stop_name: "Nephin Road Park, stop 16", stop_number: "16", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000017", stop_name: "Drumcondra Rail Stn, stop 17", stop_number: "17", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000018", stop_name: "Dargle Road, stop 18", stop_number: "18", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000019", stop_name: "Botanic Avenue, stop 19", stop_number: "19", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000021", stop_name: "DCU St Patrick's, stop 21", stop_number: "21", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000022", stop_name: "Home Farm Road, stop 22", stop_number: "22", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000023", stop_name: "Ferguson Road, stop 23", stop_number: "23", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000024", stop_name: "Walsh Road, stop 24", stop_number: "24", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
    {stop_id: "8220DB000025", stop_name: "Rathlin Road, stop 25", stop_number: "25", stop_lat: "53.3522443611407", stop_long: "-6.26372321891882"},
  ]

  return (
    <div className="side-container">
      <MiniNav setSidebarOption={setSidebarOption}/>
      
      <div className="display">
      {sidebarOption.nearest && <Nearest></Nearest>} 
      {sidebarOption.route && <Route></Route>} 
      {sidebarOption.stop && <Stop stops={stops}></Stop>} 
      {sidebarOption.favourites && <Favourites></Favourites>} 
      </div>
    </div>
  );
};
export default SideContainer;
