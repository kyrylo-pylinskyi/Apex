import React, { Component } from "react";
import LoginForm from "../components/login/LoginForm";

export class Login extends Component {
  render() {
    return (
      <div className="login-form">
        <LoginForm />
      </div>
    );
  }
}

export default Login;
