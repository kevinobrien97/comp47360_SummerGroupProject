import classes from "./LogInSignUp.module.css";
// import React from "react";
import { Card, Button,TextField } from "@mui/material";
import React, { useState, useContext  } from "react";
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
    props.closeSignUp();
  };

const switchLogIn = async e =>{
  e.preventDefault();
  props.closeSignUp();
  props.openLogIn();
}


  return (
    <div>
    <div className={classes.back_drop} onClick={props.closeSignUp}></div>
      <div className={classes.log_in_modal}>
        <div className={classes.log_in_modal_content}>
          <header>
            <h3>Sign Up</h3>
          </header>
          <div>
          <form className={classes.root} onSubmit={handleSubmit}>
          <div>
            <TextField
            sx = {{
                width: "98%",
            }}
            label="username"
            variant="filled"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            />
            </div>

            <div>
            <TextField
            sx = {{
                width: "98%",
            }}           
            label="password"
            type="password"
            variant="filled"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
            </div>

            <div>
            <TextField
            sx = {{
                width: "98%",
            }}
            label="please re-enter your password"
            type="password"
            variant="filled"
            required
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            />
            </div>

            <div>
            <Button  type="submit" variant="contained" color="primary">Register</Button>
            </div>
            
             {/* <Link to="/login">Login</Link> */}
          </form>
          Already have an account? <Button onClick={switchLogIn}>Login</Button>
          </div>
          {/* <div>
          <Button onClick={props.closeSignUp}>close me</Button>
          </div> */}
        </div>
      </div>
    </div>
  );

};
export default SignUp;