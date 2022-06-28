import React from "react";
import { Card, Button } from "@mui/material";
import classes from "./LogIn.module.css";

const LogIn = (props) => {
  return (
    <div>
    <div className={classes.back_drop} onClick={props.closeLogIn}></div>
      <div className={classes.log_in_modal}>
        <div className={classes.log_in_modal_content}>
          <header>
            <h3>Sign In</h3>
          </header>
          <div>
          <p>I'm A Pop Up!!!</p>
          </div>
          <div>
          <Button onClick={props.closeLogIn}>close me</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
