import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAllNotifications } from "../api/ClientApi";

const NotificationPopupPage = ({ onClose, onViewAll }) => {
  const [newNotifications, setNewNotifications] = useState([]);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const loadNewNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user?.unique_id;
      if (!user_id) return;

      const res = await fetchAllNotifications({ user_id });
      const notifications = res?.data || [];

      const lastFetch =
        parseInt(localStorage.getItem(`lastNotificationFetch_${user_id}`)) || 0;

      const newOnes = notifications.filter(
        (n) => new Date(n.createdAt).getTime() > lastFetch
      );

      setNewNotifications(newOnes);
    } catch (err) {
      console.error("Popup fetch error:", err);
    }
  };

  useEffect(() => {
    loadNewNotifications();
    intervalRef.current = setInterval(loadNewNotifications, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleViewAllClick = () => {
    onViewAll(); // ✅ updates lastNotificationFetch in Header
    onClose();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.toLowerCase();

    if (role === "teacher") navigate("/teacher-notification");
    else if (role === "student") navigate("/notification");
    else if (role === "principal") navigate("/principal-notification");
    else if (role === "admin") navigate("/admin-notification");
  };

  return (
    <Popup>
      <PopupHeader>
        <h4>New Notifications</h4>
        <CloseButton onClick={onClose}>×</CloseButton>
      </PopupHeader>

      <NotificationList>
        {newNotifications.length === 0 ? (
          <Empty>No new notifications</Empty>
        ) : (
          newNotifications.map((n, i) => (
            <NotificationCard key={i}>
              <Title>{n.title}</Title>
              <Message>{n.message}</Message>
            </NotificationCard>
          ))
        )}
      </NotificationList>

      <ViewAllButton onClick={handleViewAllClick}>View All</ViewAllButton>
    </Popup>
  );
};

export default NotificationPopupPage;

/* ===================== STYLED COMPONENTS ===================== */

const Popup = styled.div`
  position: fixed;
  top: 70px;
  right: 40px;
  width: 320px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  padding: 15px;
  z-index: 1000;
`;

const NotificationList = styled.div`
  max-height: 240px; /* ✅ fixed scroll area */
  overflow-y: auto;
  margin-bottom: 10px;
  padding-right: 4px;

  /* Optional nice scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
`;

const NotificationCard = styled.div`
  background: #f7f7f7;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const Message = styled.div`
  font-size: 12px;
  color: #555;
`;

const Empty = styled.p`
  text-align: center;
  color: gray;
  font-size: 13px;
`;

const ViewAllButton = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #d81b60;
  }
`;
