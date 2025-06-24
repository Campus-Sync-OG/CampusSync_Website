import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAllNotifications } from "../api/ClientApi";

const NotificationPopupPage = ({ onClose }) => {
  const [topTwoNotifications, setTopTwoNotifications] = useState([]);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const role = loggedInUser?.role; // Get the role from localStorage

    const all = await fetchAllNotifications(role); // Pass role to the API function
    const topTwo = all.slice(0, 2);
    setTopTwoNotifications(topTwo);
  };

  const handleViewAllNotifications = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const rawRole = user?.role || "";
    const role = rawRole.trim().toLowerCase();

    console.log("Normalized role:", role);

    if (role === "teacher") {
      console.log("Navigating to teacher page");
      navigate("/teacher-notification");
    } else if (role === "student") {
      console.log("Navigating to student page");
      navigate("/notifications");
    } else if (role === "principal") {
      console.log("Navigating to principal page");
      navigate("/principal-notification");
    } else {
      console.warn("Unknown role, navigating to fallback");
      navigate("/notification");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <>
      <PopupOverlay onClick={onClose} />
      <Popup>
        <Header>
          <h3>Notification</h3>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        {topTwoNotifications.map((notif, index) => (
          <NotificationCard
            key={notif.id}
            bgColor={index % 2 === 0 ? "#FFF3E0" : "#E3F2FD"}
          >
            <Icon>{notif.icon || "🔔"}</Icon>
            <Content>
              <Title>{notif.title}</Title>
              <Message>{notif.message}</Message>
            </Content>
          </NotificationCard>
        ))}

        <ViewAllButton onClick={handleViewAllNotifications}>
          View All
        </ViewAllButton>
      </Popup>
    </>
  );
};

export default NotificationPopupPage;

/* Styled Components */
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dims background */
  z-index: 999;
`;

const Popup = styled.div`
  position: fixed;
  top: 60px;
  right: 50px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 1000;

  @media (max-width: 460px) {
    width: 300px;
  }
  @media (max-width: 420px) {
    width: 250px;
  }
  @media (max-width: 320px) {
    width: 200px;
  }
`;

/* Header with Close Button */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

/* Close Button */
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

/* Notification Card */
const NotificationCard = styled.div`
  display: flex;
  background-color: ${(props) => props.bgColor};
  padding: 10px;
  margin: 8px 0;
  border-radius: 10px;
  align-items: center;
`;

/* Icon Style */
const Icon = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;

/* Notification Content */
const Content = styled.div`
  flex-grow: 1;
`;

const Title = styled.div`
  font-weight: bold;
`;

const Message = styled.div`
  font-size: 12px;
  color: gray;
`;

/* View All Button */
const ViewAllButton = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
