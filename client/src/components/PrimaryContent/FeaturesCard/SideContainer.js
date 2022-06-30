import "./SideContainer.css";
import MiniNav from "./MiniNav.js";


const SideContainer = (props) => {
  return (
    <div className="side-container">
      <MiniNav />
      <div className="display"></div>
    </div>
  );
};
export default SideContainer;
