import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { fetchAllNotifications } from "../api/ClientApi";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const role = loggedInUser?.role;

        let allNotifications = await fetchAllNotifications(role);

        if (Array.isArray(allNotifications)) {
          // ✅ Remove duplicates based on title + message
          const uniqueNotifications = [];
          const seen = new Set();

          for (const notif of allNotifications) {
            const key = `${notif.title}-${notif.message}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueNotifications.push(notif);
            }
          }

          // ✅ Optional: Reverse for latest-first order
          setNotifications(uniqueNotifications.reverse());
        } else {
          console.error("Unexpected notification format:", allNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    loadNotifications();
  }, []);


  const getRandomColor = () => {
    const pastelColors = [
      "#FFEBEE",
      "#E8F5E9",
      "#FFF3E0",
      "#E3F2FD",
      "#F3E5F5",
      "#FCE4EC",
      "#E0F7FA",
    ];
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  const randomIcons = ["📢", "🔔", "📅", "📝", "📣"];
  const getRandomIcon = () => {
    return randomIcons[Math.floor(Math.random() * randomIcons.length)];
  };

  const handleHomeClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.trim().toLowerCase();

    if (role === "teacher") {
      navigate("/teacher-dashboard");
    } else if (role === "student") {
      navigate("/dashboard");
    } else if (role === "principal") {
      navigate("/principal-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      alert("Unknown role. Cannot navigate to home.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Notifications</Title>
        <Wrapper>
          <Icons onClick={handleHomeClick}>
            <img src={homeIcon} alt="home" />
          </Icons>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={backIcon} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      {notifications.map((notif, index) => (
        <NotificationCard key={notif.id || index} bgColor={getRandomColor()}>
          <Content>
            <NotificationTitle>
              <Emoji>{getRandomIcon()}</Emoji>
              {notif.title}
            </NotificationTitle>
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
  padding: 0 15px;
  margin: auto;
  max-height: 90vh;
  overflow-y: auto;
  font-family: "Poppins", sans-serif;
`;

const NotificationCard = styled.div`
  display: flex;
  background-color: ${(props) => props.bgColor};
  padding: 10px;
  margin: 8px 0;
  border-radius: 10px;
  align-items: center;
  width: 95%;
  gap: 30px;
`;

const Content = styled.div`
  flex-grow: 1;
`;

const NotificationTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 18px;
`;

const NotificationMessage = styled.div`
  font-size: 16px;
  color: gray;
`;

const Emoji = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 22px 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 400;
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 2px;
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
