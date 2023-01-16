import React, { Component } from "react";
import MyCompanyContactsForm from "../components/contracts/MyCompanyContracts";

export class CompanyContracts extends Component {
  render() {
    return (
      <>
        <h3>My Company Contracts</h3>
        <MyCompanyContactsForm />
      </>
    );
  }
}

export default CompanyContracts;
