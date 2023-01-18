import { useState, useEffect } from "react";
import axios from "axios";
import {
  CommentIcon,
  PhoneIcon,
  AreaOfInterestIcon,
  GlobeNetworkIcon,
  Button,
} from "evergreen-ui";
import UesrProfileForm from "../feed/UserProfileForm";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState();
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState();

  const fetchCompanies = () => {
    axios
      .get(`api/Company/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toCompanyAdminPage = (userId) => {
    setPage(1);
    setSelectedUser(userId);
  };

  const back = () => {
    setPage(0);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  switch (page) {
    case 0:
      return (
        <>
          <div>
            {companies &&
              companies.map((item, key) => (
                <div class="company-card" key={key}>
                  <div class="company-card-img">
                    <img
                      class="post-author-photo"
                      s
                      src={`data:image/png;base64,${item.photo}`}
                    ></img>
                  </div>
                  <div class="comapny-card-info">  
                    <h3>{item.name}</h3>
                    <p>{item.about}</p>
                  </div>
                  <div class="company-card-contact-data">
                    <h3>Contact data</h3>
                    <p>
                      <AreaOfInterestIcon /> {item.location}
                    </p>
                    <p>
                      <CommentIcon /> {item.email}
                    </p>
                    <p>
                      <PhoneIcon /> {item.phone}
                    </p>
                    <p>
                      <GlobeNetworkIcon /> {item.website}
                    </p>
                  </div>
                  <div class="company-card-admin-data">
                    <img
                      s
                      src={`data:image/png;base64,${item.photo}`}
                    ></img>
                    <p>
                       {item.adminName}
                    </p>
                    <p>
                      <CommentIcon /> {item.adminEmail}
                    </p>
                    <p>
                      <PhoneIcon /> {item.adminPhone}
                    </p>
                  </div>
                  <div class="to-admin-page">
                    <Button appearance="primary" height={60} width={140} onClick={() => toCompanyAdminPage(item.adminId)}>
                      Visit Admin Page
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </>
      );
    case 1:
      return <UesrProfileForm backToFeed={back} userId={selectedUser} />;
  }
}
