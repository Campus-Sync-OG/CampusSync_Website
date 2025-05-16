import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import bgImage from "../assets/images/bg.jpeg";
import profileImage from "../assets/images/profile.png";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { Link } from "react-router-dom";
import { getSchoolInfoById } from '../api/ClientApi'; // ✅ import the correct function

const SchoolPage = () => {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const schoolId = 1; // 🔁 Replace with dynamic logic if needed

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const data = await getSchoolInfoById(schoolId); // ✅ Pass the ID here
        setSchoolInfo(data);
      } catch (err) {
        console.error("Error fetching school info:", err);
      }
    };

    fetchSchool();
  }, []);

  return (
    <Container>
      <Header>
        <SchoolImage src={bgImage} alt="school" />
        <Link to="/dashboard">
          <BackIcon src={backIcon} alt="Back to dashboard" />
        </Link>
        <Logo src={profileImage} alt="logo" />
        <SchoolName>{schoolInfo?.school_name || "Loading..."}</SchoolName>
        <Link to="/dashboard">
          <HomeIcon src={homeIcon} alt="Home to dashboard" />
        </Link>
      </Header>

      <Content>
        <Title>School Information</Title>
        <InfoContainer>
          <InfoRow><InfoLabel>School Name</InfoLabel><Colon>:</Colon><InfoValue>{schoolInfo?.school_name}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Address</InfoLabel><Colon>:</Colon><InfoValue>{schoolInfo?.address}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Phone Number</InfoLabel><Colon>:</Colon><InfoValue>{schoolInfo?.phone_number}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Email</InfoLabel><Colon>:</Colon><InfoValue>{schoolInfo?.email}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Website</InfoLabel><Colon>:</Colon><InfoValue>{schoolInfo?.website}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Established Year</InfoLabel><Colon>:</Colon><InfoValue>{schoolInfo?.established_year}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Affiliation</InfoLabel><Colon>:</Colon><InfoValue>{schoolInfo?.affiliation}</InfoValue></InfoRow>
        </InfoContainer>
      </Content>
    </Container>
  );
};

export default SchoolPage;



/* ───────────────────────── styled-components ───────────────────────── */

const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
`;

const Header = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const SchoolImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  filter: brightness(0.8);
`;

const Logo = styled.img`
  position: relative;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background: white;
  bottom: 50px;
  left: 20px;
  border: 2px solid white;
  z-index: 999;
`;

const SchoolName = styled.h2`
  position: relative;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  bottom: 140px;
  right: 310px;
  color: white;

  @media (max-width: 768px) {
    right: 80px;
  }
  @media (max-width: 480px) {
    font-size: 14px;
    left: 50px;
  }
  @media (max-width: 375px) {
    position: relative;
    right: 1px;
  }
  @media (max-width: 320px) {
    position: relative;
    font-size: 11px;
  }
`;

const HomeIcon = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  height: 30px;
  width: 30px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    right: 20px;
  }
`;

const BackIcon = styled.img`
  position: absolute;
  top: 20px;
  right: 60px;
  height: 30px;
  width: 30px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    right: 60px;
  }
`;

const Content = styled.div`
  padding: 30px;
`;

const Title = styled.h3`
  color: #1a237e;
  font-size: 20px;
  margin-bottom: 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 180px 10px 1fr;
  padding: 8px 0;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 140px 10px 1fr;
  }
`;

const InfoLabel = styled.div`
  font-weight: bold;
  white-space: nowrap;
`;

const Colon = styled.div`
  text-align: center;
`;

const InfoValue = styled.div`
  word-wrap: break-word;
  white-space: pre-wrap;
`;
