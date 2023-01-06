import React, { Component } from "react";
import { FormField, TextInputField, Button } from "evergreen-ui";
import axios from "axios";

export class EditProfileForm extends Component {
  state = {
    name: this.props.user.name,
    phone: this.props.user.phone,
    image: this.props.user.avatar,
    formErrors: {
      name: "",
      phone: "",
    },
    nameValid: true,
    phoneValid: true,
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

    switch (fieldName) {
      case "name":
        nameValid = value.length >= 3 && value.length <= 30;
        fieldValidationErrors.name = nameValid
          ? ""
          : "company name is too short";
        break;
      case "phone":
        phoneValid = value.match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        );
        fieldValidationErrors.phone = phoneValid ? "" : "phone is invalid";
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      nameValid: nameValid,
      phoneValid: phoneValid,
    });
  };

  handleFileSelect = (event) => {
    this.state.image = event.target.files[0];
  };

  editProfile = () => {
    let formData = new FormData();
    formData.append("Name", this.state.name);
    formData.append("Phone", this.state.phone);
    formData.append("FormFile", this.state.image);
    axios
      .put(`${process.env.REACT_APP_SERVER}/Profile/edit`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        this.props.backToProfile();
        alert(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  renderButton = () => {
    if (this.state.nameValid && this.state.phoneValid) {
      return (
        <Button appearance="primary" onClick={this.editProfile}>
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
      <>
        <div class="profile-edit-page">
          <FormField class="profile-data-table">
            <TextInputField
              label="Enter your name"
              required
              placeholder="John Doe"
              onChange={this.handleChange("name")}
              defaultValue={this.state.name}
            />
            <i>{this.state.formErrors.name}</i>
            <br />
            <TextInputField
              label="Enter your phone number"
              required
              placeholder="+01 234 567 890"
              onChange={this.handleChange("phone")}
              defaultValue={this.state.phone}
            />
            <i>{this.state.formErrors.phone}</i>
            <br />
            <input type="file" onChange={this.handleFileSelect} />
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

export default EditProfileForm;
