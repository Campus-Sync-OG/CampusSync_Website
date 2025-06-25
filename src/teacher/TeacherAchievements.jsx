import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { fetchAchievements } from "../api/ClientApi";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 20px 20px;
  border-radius: 10px;
  color: white;
  
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 3px;
  height: 25px;
  background-color: white;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  img {
    width: 25px;
    height: 25px;
  }
`;

const Container = styled.div`
  padding: 0 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    text-align: center;
    vertical-align: middle;
  }

  th {
    background: #002087;
    color: white;
  }

  td a {
    color: #d6003b;
    font-style: italic;
    text-decoration: none;
    cursor: pointer;
  }

  td:last-child {
    width: 30%;
    text-align: justify;
  }
`;

const Note = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 10px;
`;

const TeacherAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null);

  const navigate = useNavigate();

  const getEmp = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.unique_id || "";
  };

  const emp_id = getEmp();

  useEffect(() => {
    fetchAchievements(emp_id)
      .then((data) => {
        setAchievements(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching achievements:", error);
        setError("Failed to fetch achievements");
        setLoading(false);
      });
  }, [emp_id]);

  return (
    <Container>
      <Header>
        <Title>Achievements</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
            <Icons>
              <img src={home} alt="home" />
            </Icons>
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <h3>Student Achievements Information</h3>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Admission No</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Certificate</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement, index) => (
              <tr key={achievement.id}>
                <td>{index + 1}</td>
                <td>{achievement.admission_no}</td>
                <td>{achievement.student_name || "N/A"}</td>
                <td>{achievement.class || "N/A"}</td>
                <td>{achievement.section || "N/A"}</td>
                <td>
                  <button onClick={() => setActiveCertificate(achievement.Certificateurl)}>
                    View
                  </button>
                </td>
                <td>{achievement.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {activeCertificate && (
        <div style={{ marginTop: "20px" }}>
          <h4>Certificate Preview</h4>
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(activeCertificate)}&embedded=true`}
            width="100%"
            height="600px"
            title="Certificate Viewer"
            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => setActiveCertificate(null)}>Close Preview</button>
          </div>
        </div>
      )}

      <Note>{/* Optional note content here */}</Note>
    </Container>
  );
};

export default TeacherAchievements;
