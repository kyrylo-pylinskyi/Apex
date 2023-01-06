import React, { Component } from "react";
import { FormField, TextInputField, Button } from "evergreen-ui";
import axios from "axios";

export class ResetPasswordForm extends Component {
  state = {
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
    formErrors: {
      email: "",
      token: "",
      password: "",
      confirmPassword: "",
    },
    emailValid: false,
    tokenValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
  };

  resetPassword = () => {
    axios
      .put(`${process.env.REACT_APP_SERVER}/Auth/reset-password`, {
        email: this.state.email,
        token: this.state.token,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      })
      .then(function (response) {
        alert(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value }, () => {
      this.validateField(input, e.target.value);
    });
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;
    let tokenValid = this.state.tokenValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : "email is invalid";
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : "password is too short";
        break;
      case "confirmPassword":
        confirmPasswordValid = value === this.state.password;
        fieldValidationErrors.confirmPassword = confirmPasswordValid
          ? ""
          : "password doesn't match";
        break;
      case "token":
        tokenValid = value.length > 4;
        fieldValidationErrors.token = tokenValid
          ? ""
          : "email verification code is too short";
      default:
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      emailValid: emailValid,
      passwordValid: passwordValid,
      confirmPasswordValid: confirmPasswordValid,
      tokenValid: tokenValid,
    });
  };

  renderButton = () => {
    if (
      this.state.emailValid &&
      this.state.tokenValid &&
      this.state.passwordValid &&
      this.state.confirmPasswordValid
    ) {
      return (
        <Button
          appearance="primary"
          onClick={() => {
            this.resetPassword();
            this.props.backToProfile();
          }}
        >
          Reset Password
        </Button>
      );
    } else {
      return (
        <Button appearance="primary" disabled>
          Reset Password
        </Button>
      );
    }
  };
  render() {
    return (
      <>
        <div class="profile-edit-page">
          <FormField class="profile-data-table">
            <TextInputField
              label="Enter your email address"
              required
              placeholder="j.doe@sample.com"
              onChange={this.handleChange("email")}
              defaultValue={this.state.email}
            />
            <i>{this.state.formErrors.email}</i>
            <br />
            <TextInputField
              label="Enter verification token"
              required
              onChange={this.handleChange("token")}
              defaultValue={this.state.token}
            />
            <i>{this.state.formErrors.token}</i>
            <br />
            <TextInputField
              label="Enter new password"
              required
              onChange={this.handleChange("password")}
              defaultValue={this.state.password}
            />
            <i>{this.state.formErrors.password}</i>
            <br />
            <TextInputField
              label="Confirm new password"
              required
              onChange={this.handleChange("confirmPassword")}
              defaultValue={this.state.confirmPassword}
            />
            <i>{this.state.formErrors.confirmPassword}</i>
            <br />
            <Button onClick={this.props.backToProfile}>Back</Button>
            {this.renderButton()}
          </FormField>
          <br />
          <Button onClick={this.props.sendResetPasswordToken}>
            Change password
          </Button>
        </div>
      </>
    );
  }
}

export default ResetPasswordForm;
