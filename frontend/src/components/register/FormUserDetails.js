import React, { Component } from "react";
import { TextInputField, FormField, Button } from "evergreen-ui";

export class FormUserDetails extends Component {
  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange, formErrors } = this.props;
    return (
      <FormField>
        <TextInputField
          label="Enter your first name"
          required
          placeholder="John"
          onChange={this.props.handleChange("firstName")}
          defaultValue={this.props.values.firstName}
        />
        <i>{formErrors.firstName}</i>
        <br />
        <TextInputField
          label="Enter your last name"
          required
          placeholder="Doe"
          onChange={handleChange("lastName")}
          defaultValue={values.lastName}
        />
        <i>{formErrors.lastName}</i>
        <br />
        {this.props.renderButton}
      </FormField>
    );
  }
}

export default FormUserDetails;
