import React, { Component } from "react";
import { FormField, TextInputField, Button } from "evergreen-ui";
import axios from "axios";

export class CreatePostForm extends Component {
  state = {
    title: "",
    content: "",
    ValidationMessage: {
      title: "",
      content: "",
    },
    titleValid: false,
    contentValid: false,
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value }, () => {
      this.validateField(input, e.target.value);
    });
  };

  validateField = (fieldName, value) => {
    let ErrorMessages = this.state.ValidationMessage;
    let titleValid = this.state.titleValid;
    let contentValid = this.state.contentValid;
    switch (fieldName) {
      case "title":
        titleValid = value.length >= 5 && value.length <= 25 && value !== null;
        ErrorMessages.title = titleValid ? "" : "post title is too short";
        break;
      case "content":
        contentValid =
          value.length >= 10 && value.length <= 300 && value !== null;
          ErrorMessages.content = contentValid
          ? ""
          : "content must be more than 10 characters and less than 300";
        break;
    }
    this.setState({
      ValidationMessage: ErrorMessages,
      titleValid: titleValid,
      contentValid: contentValid,
    });
  };

  renderButton = () => {
    if (this.state.titleValid && this.state.contentValid) {
      return (
        <Button appearance="primary" onClick={this.createPost}>
          Continue
        </Button>
      );
    } else {
      return (
        <Button appearance="primary" disabled>
          Continue
        </Button>
      );
    }
  };

  createPost = () => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/Post/create`,
        {
          title: this.state.title,
          content: this.state.content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <>
        <FormField>
          <TextInputField
            label="Post title"
            required
            placeholder="title"
            onChange={this.handleChange("title")}
            defaultValue={this.state.title}
          />
          <i>{this.state.ValidationMessage.title}</i>
          <br />
          <TextInputField
            label="Post content"
            required
            placeholder="content"
            onChange={this.handleChange("content")}
            defaultValue={this.state.content}
          />
          <i>{this.state.ValidationMessage.content}</i>
          <br />
          {this.state.renderButton}
        </FormField>
        {this.renderButton()}
      </>
    );
  }
}

export default CreatePostForm;
