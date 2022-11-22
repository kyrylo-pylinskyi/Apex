import React, { Component } from "react";
import { TextInputField, Button } from "evergreen-ui";
import FormUserDetails from "./FormUserDetails";
import FormPersonalDetails from "./FormPersonalDetails";
import Confirm from "./Confirm";
import Success from "./Success";
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
    formErrors: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    firstNameValid: false,
    lastNameValid: false,
    phoneValid: false,
    emailValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
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
    axios.post('https://localhost:4000/api/Auth/register', {
      name: `${this.state.firstName} ${this.state.lastName}` ,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value }, () => {
      this.validateField(input, e.target.value);
      console.log("input, e:");
      console.log(input);
      console.log(e.target.value);
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
        confirmPasswordValid = value == this.state.password;
        fieldValidationErrors.confirmPassword = confirmPasswordValid
          ? ""
          : "password doesn't match";
        break;
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
    const { firstName, lastName, email, phone, password, confirmPassword } =
      this.state;
    const values = {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    };
    const {
      firstNameValid,
      lastNameValid,
      emailValid,
      phoneValid,
      passwordValid,
      confirmPasswordValid,
    } = this.state;
    const validations = {
      firstNameValid,
      lastNameValid,
      emailValid,
      phoneValid,
      passwordValid,
      confirmPasswordValid,
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
        return <Success />;
      default:
        console.log("This is a multi-step form built with React.");
    }
  }
}

export default RegisterForm;
