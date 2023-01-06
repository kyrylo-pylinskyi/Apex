import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Button } from "evergreen-ui";
import CreatePostForm from "./CreatePostForm";
import EditPostForm from "./EditPostForm";

export default function FeedForm() {
  const [Page, setPage] = useState(0);
  const [user, setUser] = useState();
  const [company, setCompany] = useState();
  const [Data, setData] = useState();
  const [SelectedPost, setSelectedPost] = useState();

  const fetchUserCompany = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/Company/my-company`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserDetails = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/Auth/get-me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/Post/feed`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderButtons = (postAuthorId, post) => {
    if (user.id == postAuthorId) {
      return (
        <>
          <Button onClick={() => editPost(post)}>Edit Post</Button>
          <Button intent="danger" onClick={() => deletePost(post.id)}>
            Delete Post
          </Button>
        </>
      );
    }
    if (company)
      return (
        <>
          <Button>Send Contract Request</Button>
        </>
      );
  };

  const deletePost = (postId) => {
    if (window.confirm("Are you sure you want delete these post?")) {
      axios
        .delete(`${process.env.REACT_APP_SERVER}/Post/delete/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          fetchData();
          alert(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const createPost = () => {
    setPage(1);
  };

  const editPost = (post) => {
    setSelectedPost(post);
    setPage(2);
  };

  const backToFeed = () => {
    setPage(0);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchUserDetails();
    fetchUserCompany();
  }, []);

  switch (Page) {
    case 2:
      return <EditPostForm backToFeed={backToFeed} post={SelectedPost} />;
    case 1:
      return <CreatePostForm backToFeed={backToFeed} />;
    case 0:
      return (
        <>
          <div class="post-card">
            <Button onClick={createPost}>Create new post</Button>
          </div>
          <section class="cards">
            {Data &&
              Data.map((item, key) => (
                <div class="post-card" key={key}>
                  <div class="post-card-header">
                    <img
                      class="post-author-photo"
                      src={`data:image/png;base64,${item.creatorPhoto}`}
                    ></img>
                    <p class="post-author-name">{item.creatorName}</p>
                    <i class="post-created-at">{item.createdAt}</i>
                  </div>
                  <b class="post-card-title">{item.title}</b>
                  <p class="post-card-content">{item.content}</p>
                  <img src={`data:image/png;base64,${item.image}`}></img>
                  <br />
                  {renderButtons(item.creatorId, item)}
                </div>
              ))}
          </section>
        </>
      );
  }
}
