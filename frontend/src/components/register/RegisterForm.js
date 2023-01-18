import React, { Component } from "react";
import { Button } from "evergreen-ui";
import FormUserDetails from "./FormUserDetails";
import FormPersonalDetails from "./FormPersonalDetails";
import Confirm from "./Confirm";
import VerifyEmail from "./VerifyEmail";
import Success from "./Success";
import { Navigate } from "react-router-dom";
import FormPassword from "./FormPassword";
import axios from "axios";

export class RegisterForm extends Component {
  state = {
    step: 1,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    formErrors: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      verificationCode: "",
    },
    firstNameValid: false,
    lastNameValid: false,
    phoneValid: false,
    emailValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
    verificationCodeVald: false,
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  registerUser = () => {
    axios
      .post(`api/Auth/register`, {
        name: `${this.state.firstName} ${this.state.lastName}`,
        email: this.state.email,
        phone: this.state.phone,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      })
      .then(function (response) {
        alert("We sent email verification code to your email address");
      })
      .catch(function (error) {
        alert(error);
      });

    this.nextStep();
  };

  verify = () => {
    let formData = new FormData();
    formData.append("Email", this.state.email);
    formData.append("Token", this.state.verificationCode)
    axios
      .post(`api/Auth/verify-email`, formData)
      .then(function (response) {
        alert("Email address verified!");
      })
      .catch(function (error) {
        console.log(error);
      });

    this.nextStep();
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value }, () => {
      this.validateField(input, e.target.value);
    });
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let firstNameValid = this.state.firstNameValid;
    let lastNameValid = this.state.lastNameValid;
    let phoneValid = this.state.phoneValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;
    let verificationCodeValid = this.state.verificationCode;

    switch (fieldName) {
      case "firstName":
        firstNameValid = value.length >= 2;
        fieldValidationErrors.firstName = firstNameValid
          ? ""
          : "first name is too short";
        break;
      case "lastName":
        lastNameValid = value.length >= 3;
        fieldValidationErrors.lastName = lastNameValid
          ? ""
          : "last name is too short";
        break;
      case "phone":
        phoneValid = value.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        );
        fieldValidationErrors.phone = phoneValid ? "" : "phone is invalid";
        break;
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
      case "verificationCode":
        verificationCodeValid = value.length === 6;
        fieldValidationErrors.verificationCode = verificationCodeValid
          ? ""
          : "email verification code must contain 6 characters";
      default:
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      firstNameValid: firstNameValid,
      lastNameValid: lastNameValid,
      phoneValid: phoneValid,
      emailValid: emailValid,
      passwordValid: passwordValid,
      confirmPasswordValid: confirmPasswordValid,
      verificationCodeValid: verificationCodeValid,
    });
  };

  renderButton = (value) => {
    if (value) {
      return (
        <Button appearance="primary" onClick={this.nextStep}>
          Continue
        </Button>
      );
    } else {
      return (
        <Button appearance="primary" disabled>
          Continue
        </Button>
      );
    }
  };

  render() {
    const { step, formErrors } = this.state;
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      verificationCode,
    } = this.state;
    const values = {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      verificationCode,
    };
    const {
      firstNameValid,
      lastNameValid,
      emailValid,
      phoneValid,
      passwordValid,
      confirmPasswordValid,
      verificationCodeVald,
    } = this.state;
    const validations = {
      firstNameValid,
      lastNameValid,
      emailValid,
      phoneValid,
      passwordValid,
      confirmPasswordValid,
      verificationCodeVald,
    };

    switch (step) {
      case 1:
        return (
          <FormUserDetails
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
            validations={validations}
            formErrors={formErrors}
            renderButton={this.renderButton(
              validations.firstNameValid && validations.lastNameValid
            )}
          />
        );
      case 2:
        return (
          <FormPersonalDetails
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
            validations={validations}
            formErrors={formErrors}
            renderButton={this.renderButton(
              validations.emailValid && validations.phoneValid
            )}
          />
        );
      case 3:
        return (
          <FormPassword
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
            validations={validations}
            formErrors={formErrors}
            renderButton={this.renderButton(
              validations.passwordValid && validations.confirmPasswordValid
            )}
          />
        );
      case 4:
        return (
          <Confirm
            nextStep={this.registerUser}
            prevStep={this.prevStep}
            values={values}
          />
        );
      case 5:
        return (
          <VerifyEmail
            handleChange={this.handleChange}
            nextStep={this.verify}
            values={values}
            validations={validations}
            formErrors={formErrors}
          />
        );
      case 6:
        return (
          <Success
            handleChange={this.handleChange}
            nextStep={this.nextStep}
            values={values}
            validations={validations}
            formErrors={formErrors}
          />
        );
      case 7:
        return <Navigate to="/login" />;
      default:
        console.log("This is a multi-step form built with React.");
    }
  }
}

export default RegisterForm;
