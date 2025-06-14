import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import adminImage from "../assets/images/admindashboard.png";
import studentdataImage from "../assets/images/studentdata.png";
import notificationImage from "../assets/images/notifi.png";
import teacherdataImage from "../assets/images/teacherdata.png";
import announcementImage from "../assets/images/announcement.png";
import { FaEllipsisH } from "react-icons/fa";
const TeacherDashboard = () => {
  const [date, setDate] = useState(new Date());

  const announcements = [
    {
      id: 1,
      title: "Circular for Trek",
      date: "16-03-2025",
    },
    {
      id: 2,
      title: "New Parking Layout",
      date: "14-03-2025",
    },
  ];
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <DashboardContainer>
      {/* Welcome Card */}
      <WelcomeCard>
        <div className="text">
          <div className="dashboard-title">Dashboard</div>
          <div className="welcome-text">
            <p>Welcome, Admin</p>
          </div>
          <div className="date">
            <p>{currentDate}</p>
          </div>
        </div>
        <img className="image" src={adminImage} alt="Welcome" />
      </WelcomeCard>

      {/* Main Section with Cards & Calendar */}
      <MainContent>
        {/* 2x2 Grid Cards */}
        <CardGrid>
          <Link to="/admin-students-data" style={{ textDecoration: "none" }}>
            <DashboardCard color="#9865F6">
              <p>Student Data</p>
              <img src={studentdataImage} alt="studentdata" />
            </DashboardCard>
          </Link>

          <Link to="/admin-teacher-data" style={{ textDecoration: "none" }}>
            <DashboardCard color="#FE8906">
              <p>Teacher Data</p>
              <img src={teacherdataImage} alt="teacherdata" />
            </DashboardCard>
          </Link>

          <Link to="/admin-notification" style={{ textDecoration: "none" }}>
            <DashboardCard color="#D5321A">
              <p>Notification</p>
              <img src={notificationImage} alt="notification" />
            </DashboardCard>
          </Link>

          <Link to="/admin-announcement" style={{ textDecoration: "none" }}>
            <DashboardCard color="#5DC355">
              <p>Announcement </p>
              <img src={announcementImage} alt="Announcement" />
            </DashboardCard>
          </Link>
        </CardGrid>

        {/* Calendar & Announcements Section */}
        <CalendarSection>
          <CalendarCard>
            <h3>Calendar</h3>
            <StyledCalendar value={date} onChange={setDate} />
            <AnnouncementsHeading>Announcements</AnnouncementsHeading>
            <AnnouncementsContainer>
              {announcements.map((announcement) => (
                <NotificationCard
                  key={announcement.id}
                  to={`/announcement/${announcement.id}`}
                >
                  <Content>
                    <Title>{announcement.title}</Title>
                    <DateText>• {announcement.date}</DateText>
                  </Content>
                  <OptionsIcon />
                </NotificationCard>
              ))}
            </AnnouncementsContainer>
          </CalendarCard>
        </CalendarSection>
      </MainContent>
    </DashboardContainer>
  );
};

export default TeacherDashboard;

/* Styled Components */

const DashboardContainer = styled.div`
  flex: 1;
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  max-height: 90vh;
  overflow-x: hidden;
  @media (max-width: 320px) {
    width: 100%;
    overflow-x: hidden;
  }
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #002087, #df0043);
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 27px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 150px;
  width: 95%;
  z-index: -1;

  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .dashboard-title {
    font-size: 30px;
    font-weight: bold;
    font-family: Poppins;
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
  @media (max-width: 1024px) {
    margin: 0;
    margin-bottom: 10px;
    width: 94%;
    padding-left: 10px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    text-align: left;
    height: auto;
    padding-bottom: 30px;

    .dashboard-title {
      position: absolute;
      margin-bottom: 10px;
    }

    .welcome-text {
      position: absolute;
      margin-top: 10px;
    }

    .image {
      margin-left: auto;
    }
  }
  @media (max-width: 480px) {
    width: 90%;
    margin-left: 0px;

    .welcome-text {
      font-size: 17px;
    }
    .image {
      height: 70px;
      width: 70px;
      margin-right: 10px;
    }
    .date {
      font-size: 12px;
      margin: 0;
    }
  }

  @media (max-width: 380px) {
    width: 90%;
    margin-left: 0px;
  }
`;

const MainContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 30px;
  margin-left: 0;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 10px;
  //max-width:650px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-left: 10px;

  @media (max-width: 1366px) {
    gap: 0;
    padding-top: 0;
    padding-left: 0;
    margin: 0;
    height: 30%;
  }

  @media (max-width: 1024px) {
    width: 100%;
    gap: 10px;
    margin-left: 10px;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr; /* Stack cards */
    margin-left: 20px;
    width: auto;
  }

  @media (max-width: 426px) {
    grid-template-columns: 1fr; /* Stack cards */
    margin-left: -10px;
    gap: 20px;
    width: auto;
  }
  @media (max-width: 376px) {
    width: 100%;
    gap: 20px;
  }
`;

const DashboardCard = styled.div`
  background: ${(props) => props.color || "#ffffff"};
  color: black;
  border-radius: 10px;
  padding: 20px;
  text-align:left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s;
  cursor: pointer;
  height: 155px;
  width:85%;
  gap:10px;
  margin:8px;
  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 220px;
    height: 190px;
    margin:0;
    position: relative;
    left:10px;
    padding:0;
    bottom:10px;
  }
  
  p {
    flex:1;
    font-size: 18px;
    font-weight: bold;
    text-align: left; 
    margin:0;
    padding:0;
    font-family: 'Poppins', sans-serif;
    color: white;
  }

   @media(max-width:1366px){
    height:120px;
    img {
      width:170px;
      height:140px;
    }
  }

  @media (max-width: 1024px) {
    gap:5px;
    margin:0;
    width:84%;
   
  }
  @media (max-width: 768px) {
    gap:5px;
    margin:0;
    width:80%;
    img{
    position:relative;
    left: -15px;
    }
    
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Stack cards */
    gap:20px;
    margin-left:28px;
    width:75%;
  }

   @media (max-width: 420px) {
    margin:0;
    margin-left:10px;
    width:84%;
    height:150px;
    img {
    width: 150px;
    height: 150px;
    margin-left:auto;

  }
  }
     @media (max-width: 380px) {
    margin:0;
    margin-left:10px;
    width:82%;
    height:150px;
    img {
    width: 150px;
    height: 150px;
    margin-left:auto;

  }
  }
   @media (max-width: 320px) {
    margin:0;
    margin-left:10px;
    width:74%;
    height:140px;
    img {
    width: 130px;
    height: 130px;
    margin-left:auto;

  }
`;

const CalendarSection = styled.div`
  width: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  flex-direction: column;
  position: relative;
  right: 15px;

  @media (max-width: 1366px) {
    width: 22%;
  }

  @media (max-width: 1024px) {
    width: 45%;
    margin-left: 200px;
    bottom: 15px;
  }
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 15px;
    margin-left: 35px;
  }
  @media (max-width: 480px) {
    width: 90%;
    margin-left: 35px;
    margin-right: 15px;
    margin-top: 0;
  }
  @media (max-width: 376px) {
    margin-left: 45px;
  }
  @media (max-width: 320px) {
    margin-left: 40px;
    overflow-x: hidden;
  }
`;

const CalendarCard = styled.div`
  background: rgb(111, 184, 162);
  color: #333;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 95%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  height: 385px;

  h3 {
    margin-top: 1px;
    align-text: left;
    font-family: "Poppins", sans-serif;
    color: white;
  }

  @media (max-width: 1366px) {
    height: 310px;

    h3 {
      margin-top: 0;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 425px) {
    width: 90%;
  }
`;

const StyledCalendar = styled(Calendar)`
  max-width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 5px;
  height: 70vh;
  .react-calendar__navigation {
    margin-bottom: 2px; /* Reduce gap between month and days */
    padding-bottom: 0; /* Minimize extra space */
  }

  .react-calendar__month-view__weekdays {
    margin-bottom: 0; /* Remove extra gap */
    font-size: 12px;
  }
  .react-calendar__tile {
    font-size: 12px; /* Reduce font size to fit */
    padding: 4px;
  }

  .react-calendar__month-view {
    height: 150px; /* Ensure the calendar stays within 200px */
    margin: 0;
  }

  .react-calendar__navigation button {
    font-size: 12px;
    padding: 2px;
  }

  @media (max-width: 1366px) {
    padding: 0;

    .react-calendar__tile {
      font-size: 9px; /* Reduce font size to fit */
      padding: 0px;
    }
  }
`;

const AnnouncementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 300px; /* Prevent overflow */
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const NotificationCard = styled(Link)`
  display: flex;
  align-items: center;
  background: #f1f9f6;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease-in-out;
  text-decoration: none;
  color: inherit;
  width: 90%;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
`;

const DateText = styled.span`
  font-size: 11px;
  color: #6c757d;
  font-family: "Roboto", sans-serif;
  margin-top: 3px;
`;

const OptionsIcon = styled(FaEllipsisH)`
  font-size: 14px;
  color: #6c757d;
`;
const AnnouncementsHeading = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
`;
