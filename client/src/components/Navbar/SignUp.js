import { React, useState, useContext } from "react";
import classes from "./LogInSignUp.module.css";
import { Button, TextField } from "@mui/material";
import AuthContext from "../../context/AuthContext";
import Warning from "../PrimaryContent/FeaturesCard/Warning";

const SignUp = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [signupError, setSignupError] = useState(null);
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(username, password, password2, setSignupError, props.toggleRegister, props.toggleLogIn);
  };

  return (
    <div>
      <div className={classes.back_drop} onClick={props.toggleRegister}></div>
      <div className={classes.log_in_modal}>
        <div className={classes.log_in_modal_content}>
          <header>
            <h3>Sign Up</h3>
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
                <TextField
                  sx={{
                    width: "98%",
                  }}
                  label="please re-enter your password"
                  type="password"
                  variant="filled"
                  required
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              <div>
                <Button type="submit" variant="contained" color="primary">
                  Register
                </Button>
              </div>
              {signupError && <Warning error={signupError}></Warning>}
              </form>
              Already have an account?{"  "}
              {/* <Link to={"/login/"} style={{ textDecoration: "none" }}>  */}
              <Button type="submit" variant="contained" style={{ color: "#2196f3", backgroundColor: "white" }} onClick={()=> {props.toggleRegister(); props.toggleLogIn()}}>
                Login
              </Button>
              {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
