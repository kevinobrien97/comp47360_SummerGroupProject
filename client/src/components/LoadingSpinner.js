import { React } from "react";
import { ThreeDots } from "react-loader-spinner";

const LoadingSpinner = (props) => {
  return (
    <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
      <ThreeDots color="#F1B23E" height={80} width={80} />
      {props.text ? <p>{props.text}</p> : null}
      
    </div>
  );
};

export default LoadingSpinner;
