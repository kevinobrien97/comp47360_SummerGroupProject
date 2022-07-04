import React, { useState } from "react";
import { Card, Button,FormControl } from "@mui/material";
import Form from "react-bootstrap/Form";
import classes from "./LogInSignUp.module.css";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
// import 'bootstrap/dist/css/bootstrap.min.css';
const LogIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  // function validateForm() {
  //   return username.length > 0 && password.length > 0;
    
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(username, password);
  }
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
            <form onSubmit={handleSubmit}>
            <Form.Group size="lg" controlId="username">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={username}
              placeholder="Enter user name"
              onChange={(e) => setUsername(e.target.value)}
            />
            </Form.Group>

            <Form.Group size="lg" controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
            </Form.Group>
          
            {/* <Button block="true" size="lg" type="submit" disabled={!validateForm()}>
            Login
            </Button> */}
            <Button type="submit">Login</Button>
            {/* <Button onClick={() => { console.log(password) }}>output test</Button> */}
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
