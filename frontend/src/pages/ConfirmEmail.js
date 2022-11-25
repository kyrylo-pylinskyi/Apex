import React, { Component } from "react";
import { VerifyEmail } from "../components/register/VerifyEmail";

export class ConfirmEmail extends Component {
  render() {
    return (
      <>
        <div className="register-form">
          <h2>We sent you email verification code</h2>
          <VerifyEmail />
        </div>
      </>
    );
  }
}

export default ConfirmEmail;
