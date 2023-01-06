import React, { useEffect, useState } from "react";
import validateToken from "../auth/tokenValidator";
import axios from "axios";
import { Table, Button } from "evergreen-ui";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import CreateCompanyForm from "./CreateCompanyForm";
import EditCompanyForm from "./EditCompanyForm";
import EditProfileForm from "./EditProfileForm";
import ResetPasswordForm from "./ResetPasswordForm";
import EditPostForm from "../feed/EditPostForm";
import CreatePostForm from "../feed/CreatePostForm";

export default function ProfileForm() {
  const [user, setUser] = useState();
  const [company, setCompany] = useState();
  const [Page, setPage] = useState(0);
  const [userPosts, setUserPosts] = useState();
  const [selectedPost, setSelectedPost] = useState();

  const fetchUserPosts = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/Post/my-post`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setUserPosts(response.data);
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
          fetchUserPosts();
          alert(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

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

  const sendResetPasswordToken = () => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/Auth/forgot-password/${user.email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        }
      )
      .then((response) => {
        resetPassword();
        alert(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCompany = () => {
    if (window.confirm("Are you sure you want delete you company?")) {
      axios
        .delete(`${process.env.REACT_APP_SERVER}/Company/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        })
        .then((response) => {
          alert(response.data);
          fetchUserCompany();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const editProfile = () => {
    setPage(1);
  };

  const resetPassword = () => {
    setPage(2);
  };

  const createCompany = () => {
    setPage(3);
  };

  const editCompany = () => {
    setPage(4);
  };

  const createPost = () => {
    setPage(5);
  };

  const editPost = (post) => {
    setSelectedPost(post);
    setPage(6);
  };

  const backToProfile = () => {
    fetchUserCompany();
    fetchUserPosts();
    fetchUserDetails();
    setPage(0);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserCompany();
    fetchUserPosts();
  }, []);

  const renderCompanyInfo = () => {
    if (company) {
      return (
        <div>
          <div>
            <div>
              <div>
                <h3>Company info</h3>
                {company && (
                  <p>
                    <i>Phone</i>
                    {company.phone}
                  </p>
                )}
                {company && (
                  <p>
                    <i>Email</i>
                    {company.email}
                  </p>
                )}
                {company && (
                  <p>
                    <i>Location</i>
                    {company.location}
                  </p>
                )}
                <div>
                  <h3>Bio</h3>
                  <p>
                    Lorem ipsum dolor sit amet, hello how consectetur
                    adipisicing elit. Sint consectetur provident magni yohoho
                    consequuntur, voluptatibus ghdfff exercitationem at quis
                    similique. Optio, amet!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={editCompany}>Edit Company</Button>
          <Button intent="danger" onClick={deleteCompany}>
            Delete Company
          </Button>
        </div>
      );
    }
    return (
      <>
        <h3>You have no registered company</h3>
        <Button onClick={createCompany}>Create company</Button>
      </>
    );
  };

  switch (Page) {
    case 0:
      return (
        <>
          <section class="layout">
            <div class="header profile-header">
              <div class="avatar profile-img">
                {user && (
                  <img
                    src={`data:image/png;base64,${user.avatar}`}
                    width="200"
                    alt="Profile Image"
                  />
                )}
              </div>
              <div class="profile-nav-info">{user && <h3>{user.name}</h3>}</div>
            </div>
            <div class="leftSide main-bd profile-side">
              <h4>Profile info</h4>
              {user && (
                <p>
                  <i>Name</i>
                  {user.phone}
                </p>
              )}
              {user && (
                <p>
                  <i>Email</i>
                  {user.email}
                </p>
              )}
              {user && (
                <p>
                  <i>Phone</i>
                  {user.phone}
                </p>
              )}
              <div>
                <h3>Bio</h3>
                <p>
                  Lorem ipsum dolor sit amet, hello how consectetur adipisicing
                  elit. Sint consectetur provident magni yohoho consequuntur,
                  voluptatibus ghdfff exercitationem at quis similique. Optio,
                  amet!
                </p>
              </div>
              <div>
                <Button onClick={editProfile}>Edit Profile</Button>
              </div>
            </div>
            <div class="body">
              <div class="post-card">
                <Button onClick={createPost}>Create Post</Button>
              </div>
              {userPosts &&
                userPosts.map((item, key) => (
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
                    <Button onClick={() => editPost(item)}>Edit Post</Button>
                    <Button intent="danger" onClick={() => deletePost(item.id)}>
                      Delete Post
                    </Button>
                  </div>
                ))}
            </div>
            <div class="rightSide main-bd profile-side">
              {renderCompanyInfo()}
            </div>
          </section>
        </>
      );
    case 1:
      return (
        <EditProfileForm
          backToProfile={backToProfile}
          user={user}
          sendResetPasswordToken={sendResetPasswordToken}
          resetPassword={resetPassword}
        />
      );
    case 2:
      return (
        <ResetPasswordForm
          sendResetPasswordToken={sendResetPasswordToken}
          backToProfile={backToProfile}
        />
      );
    case 3:
      return <CreateCompanyForm backToProfile={backToProfile} />;
    case 4:
      return (
        <EditCompanyForm backToProfile={backToProfile} company={company} />
      );
    case 5:
      return <CreatePostForm backToFeed={backToProfile} />;
    case 6:
      return <EditPostForm backToFeed={backToProfile} post={selectedPost} />;
  }
}
