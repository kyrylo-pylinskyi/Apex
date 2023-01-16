import axios from "axios";
import { FormField, TextInputField, Button } from "evergreen-ui";

import React, { Component, useRef } from "react";

export default class CreateEmployeeForm extends Component {
  state = {
    selectedJob: -1,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    image: "",
    salary: 0,
    birthdate: undefined,
    employmentDate: undefined,
    formErrors: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      selectedJob: "",
    },
    firstNameValid: false,
    lastNameValid: false,
    phoneValid: false,
    emailValid: false,
    selectedJobValid: false,
  };
  jobs = [
    { value: -1, label: "Not chosen" },
    {
      value: 0,
      label: "Health and safety",
    },
    { value: 1, label: "Foreman" },
    { value: 2, label: "Engineer" },
    { value: 3, label: "Manager" },
    { value: 4, label: "Designer" },
  ];

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value }, () => {
      this.validateField(input, e.target.value);
    });
  };

  handleSalaryChange = (e) => {
    this.setState({ salary: e.target.value });
  };

  handleSelectorChange = (event) => {
    this.setState({ selectedJob: event.target.value });
  };

  handleFileSelect = (event) => {
    this.state.image = event.target.files[0];
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let firstNameValid = this.state.firstNameValid;
    let lastNameValid = this.state.lastNameValid;
    let phoneValid = this.state.phoneValid;
    let emailValid = this.state.emailValid;

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
      default:
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      firstNameValid: firstNameValid,
      lastNameValid: lastNameValid,
      phoneValid: phoneValid,
      emailValid: emailValid,
    });
  };

  createEmployee = () => {
    let formData = new FormData();
    formData.append("FirstName", this.state.firstName);
    formData.append("LastName", this.state.lastName);
    formData.append("Email", this.state.email);
    formData.append("Phone", this.state.phone);
    formData.append("Avatar", this.state.image);
    formData.append("BirthDate", this.state.birthdate);
    formData.append("Job", this.state.selectedJob);
    formData.append("Salary", this.state.salary);
    formData.append("EmployedAt", this.state.employmentDate);
    axios
      .post(`${process.env.REACT_APP_SERVER}/Employee/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        console.log(response.data);
        this.props.back();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  renderButton = () => {
    if (
      this.state.emailValid &&
      this.state.firstNameValid &&
      this.state.lastNameValid &&
      this.state.selectedJob > -1 &&
      this.state.birthdate &&
      this.state.employmentDate
    )
      return <Button onClick={this.createEmployee}>Create</Button>;
    return <Button disabled>Create</Button>;
  };

  render() {
    return (
      <>
        <div class="form">
          <FormField>
            <TextInputField
              label="Enter employee first name"
              required
              placeholder="John"
              onChange={this.handleChange("firstName")}
              defaultValue={this.state.email}
            />
            <i>{this.state.formErrors.firstName}</i>
            <TextInputField
              label="Enter last name"
              required
              placeholder="Doe"
              onChange={this.handleChange("lastName")}
              defaultValue={this.state.email}
            />
            <i>{this.state.formErrors.lastName}</i>
            <TextInputField
              label="Enter employee email address"
              required
              placeholder="john.doe@sample.mail"
              onChange={this.handleChange("email")}
              defaultValue={this.state.email}
            />
            <i>{this.state.formErrors.email}</i>
            <TextInputField
              label="Enter employee phone number"
              required
              placeholder="+01 234 567 890"
              onChange={this.handleChange("phone")}
              defaultValue={this.state.phone}
            />
            <i>{this.state.formErrors.phone}</i>
            <TextInputField
              label="Enter employee salary"
              required
              type="number"
              onChange={this.handleSalaryChange}
              defaultValue={this.state.salary}
            />
            <TextInputField
              label="Enter employee birthdate"
              required
              type="date"
              onChange={this.handleChange("birthdate")}
              defaultValue={this.state.birthdate}
            />
            <TextInputField
              label="Enter employment date"
              required
              type="date"
              onChange={this.handleChange("employmentDate")}
              defaultValue={this.state.employmentDate}
            />
            <br />
            <div>
              <select
                label="Select enployee job title"
                value={this.state.selectedJob}
                onChange={this.handleSelectorChange}
              >
                {this.jobs.map((job) => (
                  <option key={job.value} value={job.value}>
                    {job.label}
                  </option>
                ))}
              </select>
            </div>
            <i>{this.state.formErrors.selectedJob}</i>
            <br />
            <input type="file" onChange={this.handleFileSelect} />
            <Button onClick={this.props.back}>Back</Button>
            {this.renderButton()}
          </FormField>
        </div>
      </>
    );
  }
}
