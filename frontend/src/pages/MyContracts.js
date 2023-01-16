import React, { Component } from "react";
import MyContactsForm from "../components/contracts/MyContractsForm";

export class MyContracts extends Component {
  render() {
    return (
      <>
        <h3>My Contracts</h3>
        <MyContactsForm />
      </>
    );
  }
}

export default MyContracts;
