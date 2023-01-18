import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-router-dom";
import { Button, DollarIcon } from "evergreen-ui";

export default function UesrProfileForm(props) {
  const [user, setUser] = useState();
  const [posts, setUserPosts] = useState();
  const [userCompany, setUserCompany] = useState();
  const [myCompany, setMyCompany] = useState();
  const [myDetails, setMyDetails] = useState();

  const fetchUserDetails = () => {
    axios
      .get(`api/Profile/${props.userId}`, {
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

  const fetchMyCompany = () => {
    axios
      .get(`api/Company/my-company`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setMyCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserCompany = () => {
    axios
      .get(`api/Company/user/${props.userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setUserCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserPosts = () => {
    axios
      .get(`api/Post/user/${props.userId}`, {
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

  const fetchMyDetails = () => {
    axios
      .get(`api/Auth/get-me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setMyDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserPosts();
    fetchUserCompany();
    fetchMyCompany();
    fetchMyDetails();
  }, []);

  return (
    <>
      <section class="layout">
        <div class="header post-card">
          <Button onClick={props.backToFeed}>Back</Button>
        </div>
        <div class="leftSide main-bd profile-side">
          <h3>Profile info</h3>
          {user && (
            <p>
              <i>Name</i>
              {user.name}
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
          {user && (
            <div>
              <h3>Bio</h3>
              <p>{user.bio}</p>
            </div>
          )}
        </div>
        <div class="rightSide main-bd profile-side">
          {userCompany && <h3>Company: {userCompany.name}</h3>}
          {userCompany && (
            <img
              class="company-photo"
              src={`data:image/png;base64,${userCompany.photo}`}
            />
          )}
          {userCompany && (
            <p>
              <i>Phone</i>
              {userCompany.phone}
            </p>
          )}
          {userCompany && (
            <p>
              <i>Email</i>
              {userCompany.email}
            </p>
          )}
          {userCompany && (
            <p>
              <i>Location</i>
              {userCompany.location}
            </p>
          )}
          {userCompany && (
            <div>
              <h3>About</h3>
              <p>{userCompany.about}</p>
            </div>
          )}
        </div>
        <div class="body">
          {posts &&
            posts.map((item, key) => (
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
                <br />
                <i class="post-card-content">
                  <DollarIcon /> {item.price}.00 PLN
                </i>
                <p class="post-card-content">{item.content}</p>
                <img src={`data:image/png;base64,${item.image}`}></img>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
