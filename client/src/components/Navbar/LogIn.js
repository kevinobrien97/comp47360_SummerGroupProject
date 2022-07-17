import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classes from "./LogInSignUp.module.css";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const LogIn = (props) => {
  // const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    // prevent reload
    event.preventDefault();
    loginUser(username, password, navigate);
    props.closeLogIn();
  };
  return (
    <div>
      <div className={classes.back_drop} onClick={props.closeLogIn}></div>
      <div className={classes.log_in_modal}>
        <div className={classes.log_in_modal_content}>
          <header>
            <h3>Sign In</h3>
          </header>

          <div>
            <form className={classes.root} onSubmit={handleSubmit}>
              <div>
                <TextField
                  sx={{
                    width: "98%",
                  }}
                  label="username"
                  variant="filled"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  sx={{
                    width: "98%",
                  }}
                  label="password"
                  type="password"
                  variant="filled"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </div>
            </form>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
