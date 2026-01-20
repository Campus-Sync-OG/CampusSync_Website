import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { fetchAllNotifications } from "../api/ClientApi";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  const getNotificationType = (notif) => {
    if (notif.message?.preferred_sharing) return "hostel";
    if (notif.title?.toLowerCase().includes("marks")) return "marks";
    return "unknown";
  };


  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const user_id = loggedInUser?.unique_id;
        const role = loggedInUser?.role?.trim().toLowerCase();
        setUserRole(role);

        let response = await fetchAllNotifications({ user_id });
        let allNotifications = response?.data || [];

        if (Array.isArray(allNotifications)) {
          const uniqueNotifications = [];
          const seen = new Set();

          for (const notif of allNotifications) {
            const key = `${notif.title}-${notif.message}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueNotifications.push(notif);
            }
          }

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

  // 🎨 Pastel colors
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
  const getRandomIcon = () =>
    randomIcons[Math.floor(Math.random() * randomIcons.length)];

  const handleHomeClick = () => {
    if (userRole === "teacher") navigate("/teacher-dashboard");
    else if (userRole === "student") navigate("/dashboard");
    else if (userRole === "principal") navigate("/principal-dashboard");
    else if (userRole === "admin") navigate("/admin-dashboard");
    else alert("Unknown role. Cannot navigate to home.");
  };

  // 🚀 Open popup ONLY for principal
  const openPopup = (notif) => {
    const type = getNotificationType(notif);

    if (type === "marks") {
      navigate("/marks-approval", { state: { notif } });
    }
    else if (type === "hostel") {
      navigate("/hostel-approval", { state: { notif } });
    }
    else {
      alert("Unknown notification type");
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

      {notifications.map((notif, index) => {
        const isPrincipal = userRole === "principal";

        return (
          <NotificationCard
            key={notif.id || notif.user_id || index}
            bgColor={getRandomColor()}
            clickable={isPrincipal}
            onClick={() => {
              if (isPrincipal) openPopup(notif);
            }}
          >
            <Content>
              <NotificationTitle>
                <Emoji>{getRandomIcon()}</Emoji>
                {notif.title}
              </NotificationTitle>
              <NotificationMessage>
                {typeof notif.message === "string"
                  ? notif.message
                  : `Admission No: ${notif.message.admission_no}, 
       Sharing: ${notif.message.preferred_sharing}, 
       Payment: ${notif.message.payment_type}},
       registration: ${notif.message.registration_id || ""}`}
              </NotificationMessage>

            </Content>
          </NotificationCard>
        );
      })}
    </Container>
  );
};

export default NotificationsPage;

/* =========================
   STYLED COMPONENTS
========================= */

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

  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  opacity: ${(props) => (props.clickable ? "1" : "0.9")};
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
