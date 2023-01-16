import React, { Component } from "react";
import {
  FormField,
  TextInputField,
  Button,
  Pane,
  Label,
  Textarea,
} from "evergreen-ui";
import axios from "axios";

export class CreatePostForm extends Component {
  state = {
    title: "",
    content: "",
    price: "",
    image: "",
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

  handlePriceChange = (e) => {
    this.setState({ price: e.target.value });
  };

  handleFileSelect = (event) => {
    this.state.image = event.target.files[0];
  };

  validateField = (fieldName, value) => {
    let ErrorMessages = this.state.ValidationMessage;
    let titleValid = this.state.titleValid;
    let contentValid = this.state.contentValid;
    switch (fieldName) {
      case "title":
        titleValid = value.length >= 5 && value.length <= 70 && value !== null;
        ErrorMessages.title = titleValid ? "" : "post title is too short";
        break;
      case "content":
        contentValid =
          value.length >= 10 && value.length <= 700 && value !== null;
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
    let formData = new FormData();
    formData.append("Title", this.state.title);
    formData.append("Content", this.state.content);
    formData.append("Price", this.state.price);
    formData.append("FormFile", this.state.image);
    axios
      .post(`${process.env.REACT_APP_SERVER}/Post/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        this.props.backToFeed();
        alert(response.data);
      })
      .catch((error) => {
        console.log("formFile", formData);
        console.log(error);
      });
  };

  render() {
    console.log(this.props.post);
    const { backToFeed } = this.props;
    return (
      <>
        <div class="post-editor form">
          <FormField>
            <TextInputField
              label="Post title"
              required
              placeholder="title"
              onChange={this.handleChange("title")}
              defaultValue={this.state.title}
            />
            <i>{this.state.ValidationMessage.title}</i>
            <TextInputField
              type="number"
              label="Estimated contract price "
              required
              onChange={this.handlePriceChange}
              defaultValue={this.state.price}
            />
            <br />
            <Pane>
              <Label htmlFor="textarea-2" marginBottom={4} display="block">
                Post content
              </Label>
              <Textarea
                id="textarea-2"
                placeholder="Your message..."
                onChange={this.handleChange("content")}
                defaultValue={this.state.content}
              />
            </Pane>
            <i>{this.state.ValidationMessage.content}</i>
            <br />
            <input type="file" onChange={this.handleFileSelect} />
            <Button onClick={backToFeed}>Back</Button>
            {this.renderButton()}
          </FormField>
        </div>
      </>
    );
  }
}

export default CreatePostForm;
