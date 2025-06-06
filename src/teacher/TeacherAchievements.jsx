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

  useEffect(() => {
    // Fetch data from the backend API
    fetchAchievements()
      .then((data) => {
        setAchievements(data); // Set the achievements data from the response
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching achievements:", error);
        setError("Failed to fetch achievements");
        setLoading(false);
      });
  }, []);
  const navigate = useNavigate();
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
          <Link to="/teacher-dashboard">
            <Icons onClick={() => navigate(-1)}>
              {" "}
              {/* Navigate to the previous page */}
              <img src={back} alt="back" />
            </Icons>
          </Link>
        </Wrapper>
      </Header>

      <h3>Student achievements information</h3>

      <Table>
        <thead>
          <tr>
            <th>Sl no</th>
            <th> Admission_no</th>
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
              <td>{achievement.student?.student_name || "N/A"}</td>
              <td>{achievement.className}</td>
              <td>
                <a href="#">{achievement.section}</a>
              </td>
              <td>
                <a href="#">{achievement.Certificateurl}</a>
              </td>
              <td>{achievement.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Note>{/* incase if you want to add a note */}</Note>
    </Container>
  );
};

export default TeacherAchievements;
