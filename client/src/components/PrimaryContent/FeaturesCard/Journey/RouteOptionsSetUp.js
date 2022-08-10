import React from "react";
import RouteOptionsSummary from "./RouteOptionsSummary";

const RouteOptionsSetUp = (props) => {
  return (
    <>
      {props.options.map((route, index) => (
        <React.Fragment key={index}>
          <RouteOptionsSummary
            route={route}
            index={index}
            dateTime={props.dateTime}
            selectedRoute={props.selectedRoute}
            removeRoutes={props.removeRoutes}
            chosenRoute={props.chosenRoute}
          ></RouteOptionsSummary>
        </React.Fragment>
      ))}
    </>
  );
};
export default RouteOptionsSetUp;
