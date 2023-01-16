import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Button, DollarIcon } from "evergreen-ui";
import CreatePostForm from "./CreatePostForm";
import EditPostForm from "./EditPostForm";
import UserProfileForm from "./UserProfileForm";
import CreateContractForm from "../contracts/CreateContreactForm";

export default function FeedForm() {
  const [Page, setPage] = useState(0);
  const [user, setUser] = useState();
  const [company, setCompany] = useState();
  const [Data, setData] = useState();
  const [SelectedPost, setSelectedPost] = useState();
  const [SelectedUser, setSelectedUser] = useState();
  const [contracts, setContracts] = useState();

  const fetchContracts = () => {
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
  }

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
          <Button onClick={() => toCreateContractPage(post)}>Send Contract Request</Button>
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

  const toUserProfile = (userId) => {
    setSelectedUser(userId);
    setPage(3);
  };

  const toCreateContractPage = (post) => {
    setSelectedPost(post);
    setPage(4);
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
    case 4:
      return <CreateContractForm post={SelectedPost} back={backToFeed}/>;
    case 3:
      return <UserProfileForm userId={SelectedUser} backToFeed={backToFeed} />;
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
                  <div
                    class="post-card-header"
                    onClick={() => toUserProfile(item.creatorId)}
                  >
                    <img
                      class="post-author-photo"
                      s
                      src={`data:image/png;base64,${item.creatorPhoto}`}
                    ></img>
                    <p class="post-author-name">{item.creatorName}</p>
                    <i class="post-created-at">{item.createdAt}</i>
                  </div>
                  <b class="post-card-title">{item.title}</b>
                  <br />
                  <i class="post-card-content">
                    <DollarIcon/> {item.price}.00 PLN
                  </i>
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
