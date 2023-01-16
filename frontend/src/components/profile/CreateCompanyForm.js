import React, { Component } from "react";
import { FormField, TextInputField, Button } from "evergreen-ui";
import axios from "axios";

export class CreateCompanyForm extends Component {
  state = {
    name: "",
    phone: "",
    email: "",
    location: "",
    photo: "",
    about: "",
    website: "",
    formErrors: {
      name: "",
      phone: "",
      email: "",
      location: "",
      website: "",
    },
    nameValid: false,
    phoneValid: false,
    emailValid: false,
    locationValid: false,
    websiteValid: false,
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value }, () => {
      this.validateField(input, e.target.value);
    });
  };

  handleFileSelect = (event) => {
    this.state.photo = event.target.files[0];
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let phoneValid = this.state.phoneValid;
    let emailValid = this.state.emailValid;
    let locationValid = this.state.locationValid;
    let websiteValid = this.state.websiteValid;

    switch (fieldName) {
      case "name":
        nameValid = value.length >= 3 && value.length <= 55;
        fieldValidationErrors.name = nameValid
          ? ""
          : "company name is too short or too large";
        break;
      case "location":
        locationValid = value.length >= 3 && value.length <= 55;
        fieldValidationErrors.location = locationValid
          ? ""
          : "location is too short or too large";
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
      case "website":
        websiteValid = value.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
        fieldValidationErrors.website = websiteValid ? "" : "website is invalid";
    }

    this.setState({
      formErrors: fieldValidationErrors,
      nameValid: nameValid,
      locationValid: locationValid,
      phoneValid: phoneValid,
      emailValid: emailValid,
      websiteValid: websiteValid,
    });
  };

  createCompany = () => {
    let formData = new FormData();
    formData.append("Name", this.state.name);
    formData.append("Phone", this.state.phone);
    formData.append("Email", this.state.email);
    formData.append("Location", this.state.location);
    formData.append("Photo", this.state.photo);
    formData.append("About", this.state.about);
    formData.append("Website", this.state.website);
    axios
      .post(`${process.env.REACT_APP_SERVER}/Company/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
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
      this.state.emailValid &&
      this.state.websiteValid
    ) {
      return (
        <Button appearance="primary" onClick={this.createCompany}>
          Create
        </Button>
      );
    } else {
      return (
        <Button appearance="primary" disabled>
          Create
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
          <TextInputField
            label="Enter your company website address"
            required
            placeholder="www.sample.com"
            onChange={this.handleChange("website")}
            defaultValue={this.state.website}
          />
          <i>{this.state.formErrors.website}</i>
          <TextInputField
            label="Enter some info about your company"
            required
            placeholder="About my company"
            onChange={this.handleChange("about")}
            defaultValue={this.state.about}
          />
          <br />
          <input type="file" onChange={this.handleFileSelect} />
          <Button onClick={this.props.backToProfile}>Back</Button>
          {this.renderButton()}
        </FormField>
      </div>
    );
  }
}

export default CreateCompanyForm;
