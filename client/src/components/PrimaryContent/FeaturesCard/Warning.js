import { React } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { IconContext } from "react-icons";

const Warning = (props) => {
  return (
    <div
      style={{
        display: "flex",
        margin: "0.5rem",
        color: "#F1B23E",
        fontWeight: "bold",
      }}
    >
      <IconContext.Provider
        value={{ size: "1.4rem", color: "#F1B23E", paddingTop: "5rem" }}
      >
        <div>
          <RiErrorWarningLine />
        </div>
      </IconContext.Provider>
      <div>&nbsp;{props.error}</div>
    </div>
  );
};

export default Warning;
