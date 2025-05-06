import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png"; // adjust path as needed
import backIcon from "../assets/images/back.png"; // adjust path as needed
import { fetchAllNotifications } from "../api/ClientApi";
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
       const loggedInUser = JSON.parse(localStorage.getItem("user"));
         const role = loggedInUser?.role; // Get the role from localStorage
       
         const allNotifications = await fetchAllNotifications(role); // Using the API function
        if (Array.isArray(allNotifications)) {
          setNotifications(allNotifications.reverse()); // Display newest first
        } else {
          console.error("Unexpected notification format:", allNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    loadNotifications();
  }, []);

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const getRandomColor = () => {
    const pastelColors = ["#FFEBEE", "#E8F5E9", "#FFF3E0", "#E3F2FD", "#F3E5F5", "#FCE4EC", "#E0F7FA"];
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  const randomIcons = ["📢", "🔔", "📅", "📝", "📣"];
  const getRandomIcon = () => {
    return randomIcons[Math.floor(Math.random() * randomIcons.length)];
  };

  return (
    <Container>
      <NavContainer>
        <Title>Notifications</Title>
        <IconsContainer>
          <ImageIcon src={homeIcon} alt="Home" onClick={handleHomeClick} />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={handleBackClick} />
        </IconsContainer>
      </NavContainer>

      {notifications.map((notif, index) => (
        <NotificationCard key={notif.id || index} bgColor={getRandomColor()}>
          <Content>
            <NotificationTitle><Emoji>{getRandomIcon()}</Emoji>{notif.title}</NotificationTitle>
            <NotificationMessage>{notif.message}</NotificationMessage>
          </Content>
        </NotificationCard>
      ))}
    </Container>
  );
};

export default NotificationsPage;

/* Styled Components */
const Container = styled.div`
  padding: 20px;
  width:100%;
  margin: auto;
  max-height:90vh;
  overflow-y:auto;
  
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #d9534f);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  height: 40px;
  width:95%;
`;

const Title = styled.h2`
  color: white;
  font-size: 25px;
  font-weight: bold;
  @media (max-width: 426px) {
    font-size: 20px;
  }
  font-family:Poppins;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
`;

const ImageIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const NotificationCard = styled.div`
  display: flex;
  background-color: ${(props) => props.bgColor};
  padding: 10px;
  margin: 8px 0;
  border-radius: 10px;
  align-items: center;
  width:95%;
  gap:30px;
`;



const Content = styled.div`
  flex-grow: 1;
`;

const NotificationTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 100;
  font-size: 18px;
  font-family:Poppins;
`;

const NotificationMessage = styled.div`
  font-size: 16px;
  color: gray;
  font-family:Poppins;
`;
const Emoji = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;
const TitleRow = styled.div`
  display: flex;
  align-items: center;
`;