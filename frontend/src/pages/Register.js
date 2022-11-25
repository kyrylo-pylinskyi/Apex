import React, { Component } from "react";
import RegisterForm from "../components/register/RegisterForm";

export class Register extends Component {
  render() {
    return (
      <>
        <div className="register-form">
          <h2>Register</h2>
          <RegisterForm />
        </div>
      </>
    );
  }
}

export default Register;
