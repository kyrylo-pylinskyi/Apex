import { useState } from "react";
import axios from "axios";
import {
  FormField,
  TextInputField,
  Button,
  Pane,
  Label,
  Textarea,
} from "evergreen-ui";

export default function CreateContractForm(props) {
  const [price, setPrice] = useState(props.post.price);
  const [comment, setComment] = useState("");

  const sendContractRequst = () => {
    let formData = new FormData();
    formData.append("PostId", props.post.id);
    formData.append("Price", price);
    formData.append("Comment", comment);
    axios
      .post(`api/Contract/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        alert(response.data);
        props.back();
      })
      .catch((error) => {
        console.log(error);
      });
    props.back();
    alert("Contract created");
  };

  const renderButton = () => {
    if (comment && price >= 0) {
      return (
        <>
          <Button onClick={props.back}>Back</Button>
          <Button appearance="primary" onClick={sendContractRequst}>
            Send contract request
          </Button>
        </>
      );
    } else
      return (
        <>
          <i>Please set price and add comment</i>
          <br />
          <Button onClick={props.back}>Back</Button>
          <Button appearance="primary" disabled>
            Send contract request
          </Button>
        </>
      );
  };

  return (
    <>
      <div class="form">
        <FormField>
          <TextInputField
            type="number"
            label="Your contract price proposition"
            required
            onChange={(e) => setPrice(e.target.value)}
            defaultValue={price}
          />
          <Pane>
            <Label htmlFor="textarea-2" marginBottom={4} display="block">
              Post content
            </Label>
            <Textarea
              id="textarea-2"
              placeholder="Your message..."
              onChange={(e) => setComment(e.target.value)}
              defaultValue={comment}
            />
          </Pane>
          {renderButton()}
        </FormField>
      </div>
    </>
  );
}
