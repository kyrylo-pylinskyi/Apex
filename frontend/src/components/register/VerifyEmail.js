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
          <h3>We sent email verification code to your email address</h3>
          <TextInputField
            label="Confirm Email Verification Code"
            required
            onChange={handleChange("verificationCode")}
            defaultValue={values.verificationCode}
          />
        </FormField>
        <Button appearance="primary" onClick={this.next}>
          Continue
        </Button>
      </>
    );
  }
}

export default VerifyEmail;
