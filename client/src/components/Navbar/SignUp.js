import React from "react";
import { Card, Button } from "@mui/material";
import classes from "./LogInSignUp.module.css";


// const SignUp = (props) =>{
//     return (
//         <div>
//           <h1>Signup</h1>
//         </div>
//       );
// }
// export default SignUp;



const SignUp = (props) => {
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
          <form action="login" method="POST">
          <p>Username: </p>
          <input type="text" name="username"/>
          <p>Password:</p>
          <input type="password" name="password"/>
          <br/>
          <input type="submit"/>
          </form>
          </div>

{/* <Container>
        <Row>
          <Col md="4">
            <h1>Login</h1>
            <Form>
              <Form.Group controlId="usernameId">
                <Form.Label>User name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter user name"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </Form.Group>

              <Form.Group controlId="passwordId">
                <Form.Label>Your password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </Form.Group>
            </Form>
            <Button color="primary" onClick={this.onLoginClick}>
              Login
            </Button>
            <p className="mt-2">
              Don't have account? <Link to="/signup">Signup</Link>
            </p>
          </Col>
        </Row>
      </Container> */}

          <div>
          <Button onClick={props.closeSignUp}>close me</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
