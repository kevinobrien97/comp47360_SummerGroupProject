import React, { useState } from "react";

import { Card, Button,FormControl,FormGroup,TextField,InputLabel } from "@mui/material";
import { styled as makeStyles,ThemeProvider } from '@mui/material/styles';

import classes from "./LogInSignUp.module.css";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

// const useStyles = makeStyles(theme => ({
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: theme.spacing(2),

//     '& .MuiTextField-root': {
//       margin: theme.spacing(1),
//       width: '300px',
//     },
//     '& .MuiButtonBase-root': {
//       margin: theme.spacing(2),
//     },
//   },
// }));

const LogIn = (props) => {
  // const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(username, password);
    props.closeLogIn();
  }
  return (
    // <ThemeProvider theme={useStyles}>
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
            <Button type="submit" variant="contained" color="primary">Login</Button>
            {/* <Button onClick={props.closeLogIn}>close me</Button> */}
            {/* <Button onClick={() => { console.log(username) }}>output test</Button> */}
            </div>
            
            </form>
          </div>
          <div>
          
          </div>
        </div>
      </div>
    </div>
    // </ThemeProvider>
  );
};

export default LogIn;