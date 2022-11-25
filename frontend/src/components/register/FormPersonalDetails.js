import React, { Component } from "react";
import { TextInputField, FormField, Button } from "evergreen-ui";

export class FormPersonalDetails extends Component {
  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };
  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };
  render() {
    const { values, handleChange, formErrors, renderButton } = this.props;
    return (
      <FormField>
        <TextInputField
          label="Enter your email address"
          required
          placeholder="john.doe@sample.mail"
          onChange={handleChange("email")}
          defaultValue={values.email}
        />
        <i>{formErrors.email}</i>
        <br />
        <TextInputField
          label="Enter your phone number"
          required
          placeholder="+01 234 567 890"
          onChange={handleChange("phone")}
          defaultValue={values.phone}
        />
        <i>{formErrors.phone}</i>
        <br />
        <Button marginRight={5} onClick={this.back}>
          Back
        </Button>
        {renderButton}
      </FormField>
    );
  }
}

export default FormPersonalDetails;
