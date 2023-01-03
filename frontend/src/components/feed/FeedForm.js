import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Button } from "evergreen-ui";
import CreatePostForm from "./CreatePostForm";

export default function FeedForm() {
  const [openCreatingPage, setOpenCreatingPage] = useState(false);
  const [Data, setData] = useState();

  console.log(localStorage.getItem("access_token"));

  const fetchData = () => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER}/Post/feed`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        }
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   setOpenCreatingPage(false);
  // });

  useEffect(() => {
    fetchData();
  }, []);

  console.log("feed", Data);

  const createPost = () => {
    setOpenCreatingPage(true);
  };

  switch (openCreatingPage) {
    case true:
      return <CreatePostForm />;
    case false:
      return (
        <>
          <Button onClick={createPost}>Create new post</Button>
          <div class="card">
            {Data &&
              Data.map((item, key) => (
                <div class="container" key={key}>
                  <h4>
                    <b>{item.title}</b>
                  </h4>
                  <p>{item.content}</p>
                  <i>{item.createdAt}</i>
                  <a>{item.creatorId}</a>
                </div>
              ))}
          </div>
        </>
      );
  }
}
