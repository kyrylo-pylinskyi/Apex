import React, { Component } from "react";
import RegisterForm from "../../components/register/RegisterForm";
import CenteredDiv from "../../components/styles/StyledComponents";

export class Auth extends Component {
  render() {
    return (
      <>
        <CenteredDiv>
          <h2>Register</h2>
          <RegisterForm />
        </CenteredDiv>
      </>
    );
  }
}

export default Auth;
