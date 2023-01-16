import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { FormField, TextInputField, Button } from "evergreen-ui";
import axios from "axios";

export class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    logedIn: false,
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  tryLogin = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER}/Auth/login`, {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        localStorage.setItem("access_token", response.data);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("access_token")}`;
        this.setState({ logedIn: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  resetPassword = () => {
    this.setState({ page: 1 });
  };

  back = () => {
    this.setState({ page: 0 });
  };

  render() {
    switch (this.state.logedIn) {
      case false:
        return (
          <FormField>
            <TextInputField
              label="Enter your email address"
              required
              placeholder="john@doe.com"
              onChange={this.handleChange("email")}
              defaultValue={this.state.email}
            />
            <TextInputField
              label="Enter your password"
              required
              onChange={this.handleChange("password")}
              defaultValue={this.state.password}
            />
            <Button appearance="primary" onClick={this.tryLogin}>
              Continue
            </Button>
          </FormField>
        );
      case true:
        window.location.reload(true);
        return <h2>Welcome!</h2>;
    }
  }
}

export default LoginForm;
