import React, { Component } from "react";
import { FormField, TextInputField, Button } from "evergreen-ui";
import axios from "axios";

export class EditCompanyForm extends Component {
  state = {
    name: this.props.company.name,
    phone: this.props.company.phone,
    email: this.props.company.email,
    location: this.props.company.location,
    formErrors: {
      name: "",
      phone: "",
      email: "",
      location: "",
    },
    nameValid: true,
    phoneValid: true,
    emailValid: true,
    locationValid: true,
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value }, () => {
      this.validateField(input, e.target.value);
    });
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let phoneValid = this.state.phoneValid;
    let emailValid = this.state.emailValid;
    let locationValid = this.state.locationValid;

    switch (fieldName) {
      case "name":
        nameValid = value.length >= 3 && value.length <= 15;
        fieldValidationErrors.name = nameValid
          ? ""
          : "company name is too short";
        break;
      case "location":
        locationValid = value.length >= 3 && value.length <= 15;
        fieldValidationErrors.location = locationValid
          ? ""
          : "company name is too short";
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
    }

    this.setState({
      formErrors: fieldValidationErrors,
      nameValid: nameValid,
      locationValid: locationValid,
      phoneValid: phoneValid,
      emailValid: emailValid,
    });
  };

  editCompany = () => {
    axios
      .put(
        `${process.env.REACT_APP_SERVER}/Company/edit`,
        {
          name: this.state.name,
          phone: this.state.phone,
          email: this.state.email,
          location: this.state.location,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        this.props.backToProfile();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  renderButton = () => {
    if (
      this.state.nameValid &&
      this.state.locationValid &&
      this.state.phoneValid &&
      this.state.emailValid
    ) {
      return (
        <Button appearance="primary" onClick={this.editCompany}>
          Update
        </Button>
      );
    } else {
      return (
        <Button appearance="primary" disabled>
          Update
        </Button>
      );
    }
  };
  render() {
    return (
      <div class="profile-edit-page">
        <FormField>
          <TextInputField
            label="Enter your company name"
            required
            placeholder="My company"
            onChange={this.handleChange("name")}
            defaultValue={this.state.name}
          />
          <i>{this.state.formErrors.name}</i>
          <br />
          <TextInputField
            label="Enter your company location"
            required
            placeholder="Warsaw"
            onChange={this.handleChange("location")}
            defaultValue={this.state.location}
          />
          <i>{this.state.formErrors.location}</i>
          <br />
          <TextInputField
            label="Enter your company phone number"
            required
            placeholder="+01 234 567 890"
            onChange={this.handleChange("phone")}
            defaultValue={this.state.phone}
          />
          <i>{this.state.formErrors.phone}</i>
          <br />
          <TextInputField
            label="Enter your company email address"
            required
            placeholder="my.company@sample.com"
            onChange={this.handleChange("email")}
            defaultValue={this.state.email}
          />
          <i>{this.state.formErrors.email}</i>
          <br />
          <Button onClick={this.props.backToProfile}>Back</Button>
          {this.renderButton()}
        </FormField>
      </div>
    );
  }
}

export default EditCompanyForm;
