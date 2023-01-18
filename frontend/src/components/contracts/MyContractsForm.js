import { useEffect, useState } from "react";
import axios from "axios";
import UesrProfileForm from "../feed/UserProfileForm";
import {
  BriefcaseIcon,
  PhoneIcon,
  AreaOfInterestIcon,
  DollarIcon,
  Button,
  TickCircleIcon,
  BanCircleIcon,
} from "evergreen-ui";

export default function MyContactsForm() {
  const [selectedExecutor, setSelectedExecutor] = useState();
  const [user, setUser] = useState();
  const [myContracts, setMyContracts] = useState();
  const [page, setPage] = useState(0);

  const fetchUserDetails = () => {
    axios
      .get(`api/Auth/get-me`, {
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

  const fetchMyContracts = () => {
    axios
      .get(`api/Contract/my-contracts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setMyContracts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const activateContract = (id) => {
    axios
      .put(
        `api/Contract/activate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        }
      )
      .then((response) => {
        fetchMyContracts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deactivateContract = (id) => {
    axios
      .put(
        `api/Contract/deactivate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        }
      )
      .then((response) => {
        alert(response.data);
        fetchMyContracts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteContract = (id) => {
    if (window.confirm("Are you sure you want delete these post?")) {
      axios
        .delete(`api/Contract/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        })
        .then((response) => {
          alert(response.data);
          fetchMyContracts();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const renderButton = (active, id) => {
    if (active)
      return (
        <>
          <p>
            <TickCircleIcon color="success" /> Contract is active
          </p>
          <Button intent="danger" onClick={() => deactivateContract(id)}>
            Close
          </Button>
        </>
      );
    else
      return (
        <>
          <p>
            <BanCircleIcon color="danger" /> Contract is not active
          </p>
          <Button intent="success" onClick={() => activateContract(id)}>
            Activate
          </Button>
        </>
      );
  };

  const toClientPage = () => {
    setPage(1);
  };

  const toExecutorPage = (id) => {
    setSelectedExecutor(id);
    setPage(2);
  };

  const back = () => {
    setPage(0);
    fetchMyContracts();
  };

  useEffect(() => {
    fetchMyContracts();
    fetchUserDetails();
  }, []);

  switch (page) {
    case 0:
      return (
        <>
          <div class="contracts-cards">
            {myContracts &&
              myContracts.map((item, key) => (
                <div class="contract-card" key={key}>
                  <div class="contract-card-post-content">
                    <div class="contract-card-post-content-img-time">
                      <img src={`data:image/png;base64,${item.postPhoto}`} />
                      <i>{item.createdAt}</i>
                    </div>
                    <div class="contract-card-post-content-text">
                      <h3>{item.postTitle}</h3>
                      <p>{item.postContent}</p>
                    </div>
                  </div>
                  <div class="contract-card-client-info">
                    <img
                      src={`data:image/png;base64,${item.postCreatorPhoto}`}
                    />
                    <p>{item.postCreatorName}</p>
                    <p>Client Price</p>
                    <p>
                      <DollarIcon /> {item.postPrice}.00
                    </p>
                    <Button onClick={toClientPage}>Visit client page</Button>
                  </div>
                  <div class="contract-card-executor-info">
                    <img src={`data:image/png;base64,${item.companyPhoto}`} />
                    <p>{item.companyName}</p>
                    <p>Executor Price</p>
                    <p>
                      <DollarIcon /> {item.price}.00
                    </p>
                    <Button onClick={() => toExecutorPage(item.companyAdminId)}>
                      Visit executor page
                    </Button>
                  </div>
                  <div class="contract-card-executor-comment">
                    <h4>Executor Comment</h4>
                    <p>{item.comment}</p>
                  </div>
                  <div class="contract-is-active">
                    {renderButton(item.isActive, item.id)}
                  </div>
                  <div class="delete-contract">
                    <Button
                      intent="danger"
                      onClick={() => deleteContract(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </>
      );
    case 1:
      return <UesrProfileForm backToFeed={back} userId={user.id} />;
    case 2:
      return <UesrProfileForm backToFeed={back} userId={selectedExecutor} />;
  }
}
