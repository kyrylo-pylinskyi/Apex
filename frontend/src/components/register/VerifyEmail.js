import { Button, FormField, TextInputField } from "evergreen-ui";
import React, { Component } from "react";

export class VerifyEmail extends Component {
  next = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };
  render() {
    const { values, handleChange, formErrors } = this.props;
    return (
      <>
        <FormField>
          <TextInputField
            label="Confirm Email Verification Code"
            required
            placeholder="123456"
            onChange={handleChange("verificationCode")}
            defaultValue={values.verificationCode}
          />
        </FormField>
        <i>{formErrors.verificationCode}</i>
        <Button appearance="primary" onClick={this.next}>
          Continue
        </Button>
      </>
    );
  }
}

export default VerifyEmail;
