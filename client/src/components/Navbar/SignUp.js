import classes from "./LogInSignUp.module.css";
// import React from "react";
import { Card, Button } from "@mui/material";
import React, { useState, useContext  } from "react";
import Form from "react-bootstrap/Form";
// import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const SignUp = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(username, password, password2);
  };


  return (
    <div>
    <div className={classes.back_drop} onClick={props.closeSignUp}></div>
      <div className={classes.log_in_modal}>
        <div className={classes.log_in_modal_content}>
          <header>
            <h3>Sign Up</h3>
          </header>
          <div>
          <p>I'm A Pop Up!!!</p>
          </div>
          <div>
          <Form onSubmit={handleSubmit}>
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

            <Form.Group size="lg" controlId="password2">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              value={password2}
              placeholder="Confirm password"
              onChange={(e) => setPassword2(e.target.value)}
            />
            </Form.Group>
            <Button  type="submit">Register</Button>
            </Form>
            <p className="mt-2">
              Already have account? </p><Button>Login</Button>
            
              {/* <Link to="/login">Login</Link> */}
            
          </div>
          <div>
          <Button onClick={props.closeSignUp}>close me</Button>
          </div>
        </div>
      </div>
    </div>
  );

};
export default SignUp;
