import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAnnouncements } from "../api/ClientApi"; // Adjust path as needed
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
// Utility
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
};

// Styled Components
const PageWrapper = styled.div`
  padding: 20px;
  font: Poppins;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const AnnouncementCard = styled.div`
  background-color: ${(props) => props.bgColor};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Message = styled.p`
  margin: 0;
  color: #555;
`;

const DateText = styled.p`
  margin-top: 12px;
  font-size: 0.8rem;
  color: #777;
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
  font-weight: 300;
  font-family: "Poppins";
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
// Main Component
const AnnouncementPage = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements().then((data) => {
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAnnouncements(sortedData);
    });
  }, []);

  return (
    <PageWrapper>
      <Header>
        <Title>Announcements</Title>
        <Wrapper>
          <Icons
            onClick={() => {
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
            }}
          >
            <img src={home} alt="home" />
          </Icons>

          <Divider />

          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>
      <CardGrid>
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            bgColor={getRandomPastelColor()}
          >
            <Title>{announcement.title}</Title>
            <Message>{announcement.message}</Message>
            <DateText>
              {new Date(announcement.createdAt).toLocaleString()}
            </DateText>
          </AnnouncementCard>
        ))}
      </CardGrid>
    </PageWrapper>
  );
};

export default AnnouncementPage;
