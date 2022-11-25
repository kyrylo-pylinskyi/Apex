import React, { Component } from "react";
import { Button } from "evergreen-ui";

export class Success extends Component {
  next = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };
  render() {
    return (
      <>
        <h2>Your account verified successly</h2>
        <br />
        <Button appearance="primary" onClick={this.next}>
          Login
        </Button>
      </>
    );
  }
}

export default Success;
