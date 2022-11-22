import React, { Component } from "react";
import { FormField, Table, Button} from "evergreen-ui";

export class Confirm extends Component {
  next = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };
  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values } = this.props;
    return (
      <FormField>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>Property</Table.TextHeaderCell>
            <Table.TextHeaderCell>Value</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.TextCell>First name</Table.TextCell>
              <Table.TextCell>{values.firstName}</Table.TextCell>
            </Table.Row>
            <Table.Row>
              <Table.TextCell>Last name</Table.TextCell>
              <Table.TextCell>{values.lastName}</Table.TextCell>
            </Table.Row>
            <Table.Row>
              <Table.TextCell>Email address</Table.TextCell>
              <Table.TextCell>{values.email}</Table.TextCell>
            </Table.Row>
            <Table.Row>
              <Table.TextCell>Phone number</Table.TextCell>
              <Table.TextCell>{values.phone}</Table.TextCell>
            </Table.Row>
          </Table.Body>
        </Table>
        <br />
        <Button marginRight={5} onClick={this.back}>
          Back
        </Button>
        <Button marginRight={5} appearance="primary" onClick={this.next}>
          Register
        </Button>
      </FormField>
    );
  }
}

export default Confirm;
