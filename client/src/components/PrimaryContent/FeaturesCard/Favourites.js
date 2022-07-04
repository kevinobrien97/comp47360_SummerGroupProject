import React from "react";
import ConstructionIcon from '@mui/icons-material/Construction';
import "./Construction.css";

const Favourites = () => {
  return (
    <div>
      <div className="construction-icon">
      <ConstructionIcon style={{
        width: "6rem",
        height: "10rem",
      }}/>
      </div>
    </div>
  );
};

export default Favourites;