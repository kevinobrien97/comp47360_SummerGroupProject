import React from "react";
import { Card, Button } from "@mui/material";
import classes from "./LogIn.module.css";
import { Form, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

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
          <form action="login" method="POST">
          <p>Username: </p>
          <input type="text" name="username"/>
          <p>Password:</p>
          <input type="password" name="password"/>
          <br/>
          <input type="submit"/>
          </form>
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
