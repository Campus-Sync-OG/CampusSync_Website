import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import principalImage from "../assets/images/principaldashboard.png";
import attendanceImg from "../assets/images/princiattendance.png";
import academicsImg from "../assets/images/princiacademics.png";
import subjectsImg from "../assets/images/princisubject.png";
import announcementImg from "../assets/images/princiannouncement.png";

const DashboardContainer = styled.div`
  flex: 1;
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
`;


const HeaderCard = styled.div`
  background: linear-gradient(135deg, #002087, #df0043);
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 27px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 150px;
  width: 95%;
  position: relative;

  .dashboard-title {
    font-size: 30px;
    font-weight: bold;
    position: absolute;
    top: 10px;
    left: 20px;
    font-family: "Poppins", sans-serif;
  }

  .welcome-text {
    position: absolute;
    bottom: 25px;
    left: 20px;
    font-size: 25px;
    font-family: "Roboto", sans-serif;
  }

  .date {
    position: absolute;
    bottom: 8px;
    left: 20px;
    font-size: 15px;
    font-family: "Roboto", sans-serif;
  }

  .image {
    width: 180px;
    height: 160px;
    margin-right: 30px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding-bottom: 30px;
    .image {
      margin-left: auto;
    }
  }
  @media (max-width: 480px) {
    width: 90%;
    .welcome-text {
      font-size: 17px;
    }
    .image {
      width: 70px;
      height: 70px;
      margin-right: 10px;
    }
    .date {
      font-size: 12px;
    }
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 20px; 
  padding: 10px;
  justify-items: space-between;


  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* stack cards vertically */
  }
`;

const DashboardCard = styled.div`
  background: ${(props) => props.color || "#ffffff"};
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  transition: 0.2s;
  cursor: pointer;
  height: 120px;
  width: 80%; /* full width of grid column */
  margin: 0 10px;

  &:hover {
    transform: scale(1.03);
  }

  img {
    width: 150px;
    height: 150px;
    position: relative;
    left: 10px;
    bottom: 10px;
  }

  p {
    flex: 1;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    font-family: "Poppins", sans-serif;
    color: white;
  }

  @media (max-width: 768px) {
    height: 180px;
    img {
      left: 0;
    }
  }

  @media (max-width: 420px) {
    height: 150px;
    img {
      width: 130px;
      height: 130px;
      margin-left: auto;
    }
  }
  @media (max-width: 320px) {
    height: 120px;
    img {
      width: 120px;
      height: 120px;
    }
  }
`;

const HostelDashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <DashboardContainer>
  

      <HeaderCard>
        <div className="text">
          <div className="dashboard-title">Dashboard</div>
          <div className="welcome-text">Welcome, Hostel</div>
          <div className="date">{today}</div>
        </div>
        <img className="image" src={principalImage} alt="Welcome" />
      </HeaderCard>

      <CardGrid>
        <Link to="/hostel-attendance" style={{ textDecoration: "none" , marginLeft: "1%"}}>
          <DashboardCard color="#9865F6">
            <p>Attendence</p>
            <img src={attendanceImg} alt="Fees" />
          </DashboardCard>
        </Link>

        <Link to="/hostel-leave-request" style={{ textDecoration: "none" }}>
          <DashboardCard color="#FE8906">
            <p>Leave Request</p>
            <img src={academicsImg} alt="Academics" />
          </DashboardCard>
        </Link>

        <Link to="/hostel-students" style={{ textDecoration: "none" }}>
          <DashboardCard color="#5DC355">
            <p>Students</p>
            <img src={subjectsImg} alt="Students" />
          </DashboardCard>
        </Link>

        <Link to="/hostel-complaints" style={{ textDecoration: "none" }}>
          <DashboardCard color="#D5321A">
            <p>Complaints</p>
            <img src={announcementImg} alt="Announcement" />
          </DashboardCard>
        </Link>
      </CardGrid>
    </DashboardContainer>
  );
};

export default HostelDashboard;
