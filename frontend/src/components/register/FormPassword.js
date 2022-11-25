import React, { Component } from 'react'
import { TextInputField, FormField, Button } from "evergreen-ui";

export class FormPassword extends Component {
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
          label="Create your password"
          required
          placeholder="password"
          onChange={handleChange("password")}
          defaultValue={values.password}
        />
        <i>{formErrors.password}</i>
        <br />
        <TextInputField
          label="Confirm your password"
          required
          placeholder="confirm password"
          onChange={handleChange("confirmPassword")}
          defaultValue={values.confirmPassword}
        />
        <i>{formErrors.confirmPassword}</i>
        <br />
        <Button marginRight={5} onClick={this.back}>
          Back
        </Button>
        {renderButton}
      </FormField>
    );
  }
}

export default FormPassword