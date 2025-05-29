// App.js
import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAllSubjects, getAssignmentsByAdmissionNo } from "../api/ClientApi"; // Adjust the import path as necessary

// Global style to reset box sizing and overflow
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
   
  }

  /* Optional scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  font-family: Arial, sans-serif;
  background: #fff;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 32, 135, 1) 31%,
    /* 100% opacity */ rgba(0, 32, 135, 0.69) 69%,
    /* 69% opacity */ #df0043 100%
  );
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  color: white;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    width: 30px;
    height: 25px;
  }
`;

const Icons2 = styled.div`
  display: flex;
  align-items: center;

  img {
    position: relative;
    width: 27px;
    height: 25px;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const SubjectsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SubjectItem = styled.li`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;

const AssignmentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
  }
`;

const AssignmentLink = styled.span`
  color: red;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 15px;
  background: #8e2de2;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background: #4a00e0;
  }
`;

const App = () => {
  const navigate = useNavigate();
  const [admission_no, setAdmissionNo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
    }
  }, []);

  useEffect(() => {
    getAllSubjects()
      .then((data) => {
        const allSubjects = data.subjects?.map((s) => s.subject_name) || [];
        const uniqueSubjects = [...new Set(allSubjects)];
        setSubjects(uniqueSubjects);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  const fetchAssignments = (subject) => {
    setSelectedSubject(subject);
    if (!admission_no) return;

    getAssignmentsByAdmissionNo(admission_no)
      .then((data) => {
        console.log("Full response from assignment API:", data);

        // Normalize response to always be an array
        const allAssignments = Array.isArray(data)
          ? data
          : Array.isArray(data.assignments)
          ? data.assignments
          : [];

        const filtered = allAssignments.filter(
          (a) => a.subjects === subject || a.subject_name === subject
        );

        console.log("Filtered assignments:", filtered);
        setAssignments(filtered);
      })
      .catch((err) => console.error("Error fetching assignments:", err));
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <HeaderWrapper>
          <Header>
            <Title>Assignments Info</Title>
            <Wrapper>
              <Link to="/dashboard">
                <Icons>
                  <img src={home} alt="home" />
                </Icons>
              </Link>
              <Divider />
              <Icons2 onClick={() => navigate(-1)}>
                <img src={back} alt="back" />
              </Icons2>
            </Wrapper>
          </Header>
        </HeaderWrapper>

        <Content>
          {selectedSubject ? (
            <>
              <h2>{selectedSubject}</h2>
              <AssignmentsTable>
                <thead>
                  <tr>
                    <th>Sl no</th>
                    <th>Teacher Name</th>
                    <th>Assignment</th>
                    <th>Date</th>
                    <th>Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(assignments) && assignments.length > 0 ? (
                    assignments.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>{index + 1}</td>
                        <td>{item.emp_name}</td>
                        <td>
                          <AssignmentLink>{item.title}</AssignmentLink>
                        </td>
                        <td>{item.Date}</td>
                        <td>
                          {item.attachment ? (
                            <a href={item.attachment} download>
                              <img
                                src="https://img.icons8.com/ios-glyphs/30/000000/download--v1.png"
                                alt="Download"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                }}
                              />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No assignments available</td>
                    </tr>
                  )}
                </tbody>
              </AssignmentsTable>
              <BackButton onClick={() => setSelectedSubject(null)}>
                Back
              </BackButton>
            </>
          ) : (
            <>
              <h2>Subjects</h2>
              <SubjectsList>
                {subjects.map((subject_name, index) => (
                  <SubjectItem
                    key={index}
                    onClick={() => fetchAssignments(subject_name)}
                  >
                    {subject_name}
                  </SubjectItem>
                ))}
              </SubjectsList>
            </>
          )}
        </Content>
      </AppContainer>
    </>
  );
};

export default App;
