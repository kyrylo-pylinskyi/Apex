import { Button, FormField, TextInputField } from "evergreen-ui";
import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export class VerifyEmail extends Component {
  state = { emailCode: "" };
  errors = { emailError: "" };

  handleChange = () => (e) => {
    this.setState({ emailCode: e.target.value }, () => {
      this.validateField(e.target.value);
    });
  };

  validateField = (value) => {
    if (value.length !== 5) {
      this.errors.emailError = "Validation Code must contain 6 characters";
      return false;
    } else {
      this.errors.emailError = "";
      return true;
    }
  };

  verify = () => {
    axios
      .post(
        `https://localhost:4000/api/Auth/verify-email/${this.state.emailCode}`
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <>
        <FormField>
          <TextInputField
            label="Confirm Email Verification Code"
            required
            placeholder="123456"
            onChange={this.handleChange()}
            defaultValue={this.state.emailCode}
          />
          <i>{this.errors.emailError}</i>
        </FormField>
        <Button appearance="primary" onClick={this.verify}>
          Confirm
        </Button>
      </>
    );
  }
}

export default VerifyEmail;
