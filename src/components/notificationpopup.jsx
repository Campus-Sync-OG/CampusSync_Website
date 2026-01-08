import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAllNotifications } from "../api/ClientApi";

const NotificationPopupPage = ({ onClose }) => {
  const [newNotifications, setNewNotifications] = useState([]);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user?.unique_id;

      if (!user_id) {
        console.warn("No user_id found in localStorage");
        return;
      }

      const res = await fetchAllNotifications({ user_id });
      const notifications = res?.data || [];

      // Get last popup fetch timestamp
      const lastFetchTime =
        parseInt(localStorage.getItem(`lastNotificationFetch_${user_id}`)) || 0;

      // Only notifications newer than last fetch
      const newlyArrived = notifications.filter(
        (n) => new Date(n.createdAt).getTime() > lastFetchTime
      );

      if (newlyArrived.length > 0) {
        setNewNotifications(newlyArrived);
      }

      // Update last fetch timestamp
      localStorage.setItem(`lastNotificationFetch_${user_id}`, Date.now().toString());
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Polling: fetch notifications every 5 seconds
  useEffect(() => {
    loadNotifications(); // initial load
    intervalRef.current = setInterval(loadNotifications, 5000); // poll every 5 sec

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleViewAllNotifications = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = (user?.role || "").trim().toLowerCase();

    switch (role) {
      case "teacher":
        navigate("/teacher-notification");
        break;
      case "student":
        navigate("/notification");
        break;
      case "principal":
        navigate("/principal-notification");
        break;
      case "admin":
        navigate("/admin-notification");
        break;
      default:
        alert("Unknown role. Cannot open notification page.");
    }
  };

  return (
    <>
      <PopupOverlay onClick={onClose} />
      <Popup>
        <Header>
          <h3>New Notifications ({newNotifications.length})</h3>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        {newNotifications.length === 0 ? (
          <NotificationCard bgColor="#F5F5F5">
            <Content>
              <Message>No new notifications</Message>
            </Content>
          </NotificationCard>
        ) : (
          newNotifications.map((notif, index) => (
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
          ))
        )}

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
  background: rgba(0, 0, 0, 0.5);
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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const NotificationCard = styled.div`
  display: flex;
  background-color: ${(props) => props.bgColor};
  padding: 10px;
  margin: 8px 0;
  border-radius: 10px;
  align-items: center;
`;

const Icon = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;

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
