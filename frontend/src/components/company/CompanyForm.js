import { useState, useEffect } from "react";
import axios from "axios";
import CreateEmployeeForm from "./CreateEmployeeForm";
import EditEmployeeFrom from "./EditEmployeeForm";
import EditCompanyForm from "../profile/EditCompanyForm";
import {
  Button,
  BriefcaseIcon,
  CalendarIcon,
  DollarIcon,
  PhoneIcon,
  UserIcon,
  GlobeNetworkIcon,
} from "evergreen-ui";

export default function CompanyForm() {
  const [user, setUser] = useState();
  const [company, setCompany] = useState();
  const [employees, setEmployees] = useState();
  const [page, setPage] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState();

  const jobs = [
    "Health and safety",
    "Foreman",
    "Engineer",
    "Manager",
    "Designer",
  ];

  const fetchUserCompany = () => {
    axios
      .get(`api/Company/my-company`, {
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

  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want delete you company?")) {
      axios
        .delete(`api/Employee/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            // 'Content-Type': 'application/json'
          },
        })
        .then((response) => {
          alert(response.data);
          fetchUserEmployees();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchUserEmployees = () => {
    axios
      .get(`api/Employee/my-employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toEmployeeCreatePage = () => {
    setPage(1);
  };

  const toEmployeeEditPage = (employee) => {
    setSelectedEmployee(employee);
    setPage(2);
  };

  const toCompanyEditPage = () => {
    setPage(3);
  };

  const backToCompanyPage = () => {
    fetchUserEmployees();
    fetchUserCompany();
    setPage(0);
  };

  useEffect(() => {
    fetchUserCompany();
    fetchUserEmployees();
  }, []);

  switch (page) {
    case 0:
      return (
        <>
          <section class="company-layout">
            <div class="header profile-header">
              <div class="avatar profile-img">
                {company && (
                  <img
                    src={`data:image/png;base64,${company.photo}`}
                    width="200"
                    alt="Profile Image"
                  />
                )}
              </div>
              <div class="profile-nav-info">
                {company && <h3>{company.name}</h3>}
              </div>
            </div>
            <div class="leftSide main-bd profile-side">
              <h3>Company info</h3>
              {company && (
                <img
                  class="company-photo"
                  src={`data:image/png;base64,${company.photo}`}
                />
              )}
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
                <h3>About</h3>
                {company && <p>{company.about}</p>}
              </div>
              <Button onClick={toCompanyEditPage}>Edit company</Button>
            </div>
            <div class="company-body">
              <div>
                <div class="post-card">
                  <Button onClick={toEmployeeCreatePage}>Add Employee</Button>
                </div>
                <div class="scroller">
                  <div class="employee-cards">
                    {employees &&
                      employees.map((item, key) => (
                        <div class="employee-card" key={key}>
                          <img
                            class="employee-photo"
                            src={`data:image/png;base64,${item.photo}`}
                          />
                          <div class="employee-info">
                            <p>
                              <UserIcon />
                              {item.fullName}
                            </p>

                            <p>
                              <PhoneIcon /> {item.phone}
                            </p>

                            <p>
                              <GlobeNetworkIcon /> {item.email}
                            </p>

                            <p>
                              <BriefcaseIcon /> {jobs[item.job]}
                            </p>

                            <p>
                              <DollarIcon /> {item.salary}
                            </p>

                            <p>
                              <CalendarIcon /> Birthday {item.birthDate}
                            </p>

                            <p>
                              <CalendarIcon /> Employment: {item.employedAt}
                            </p>
                          </div>
                          <Button onClick={() => toEmployeeEditPage(item)}>
                            Edit
                          </Button>
                          <Button
                            intent="danger"
                            onClick={() => deleteEmployee(item.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    case 1:
      return <CreateEmployeeForm back={backToCompanyPage} />;
    case 2:
      return (
        <EditEmployeeFrom
          back={backToCompanyPage}
          employee={selectedEmployee}
        />
      );
    case 3:
      return (
        <EditCompanyForm backToProfile={backToCompanyPage} company={company} />
      );
  }
}
