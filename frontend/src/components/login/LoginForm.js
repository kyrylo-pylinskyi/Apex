import React, { Component, useEffect } from "react";
import { FormField, TextInputField, Button } from "evergreen-ui";
import axios from "axios";

export class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    token: "",
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  tryLogin = () => {
    axios
      .post(`https://localhost:4000/api/Auth/login`, {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        this.setState({ token: response.data });
        console.log(JSON.stringify(this.state.token));
        localStorage.setItem("access_token", JSON.stringify(this.state.token));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("access_token")}`;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getMe = () => {
    console.log(this.state.token);
    // axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Bearer ${localStorage.getItem("access_token")}`;
    axios
      .post(`https://localhost:4000/api/Auth/get-me`, { }, {
        headers: {
          'Authorization': `Bearer ${this.state.token}`,
          // 'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("token", this.state.token);
        console.log(error);
      });
  };

  render() {
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
        <Button appearance="primary" onClick={this.getMe}>
          Get Me
        </Button>
      </FormField>
    );
  }
}

export default LoginForm;
