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

  return (
    <div className="side-container">
      <MiniNav setSidebarOption={setSidebarOption}/>
      
      <div className="display">
      {sidebarOption.nearest && <Nearest></Nearest>} 
      {sidebarOption.route && <Route></Route>} 
      {sidebarOption.stop && <Stop></Stop>} 
      {sidebarOption.favourites && <Favourites></Favourites>} 
      </div>
    </div>
  );
};
export default SideContainer;
