import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bgImage from "../assets/images/bg.jpeg";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { fetchPrincipalById } from "../api/ClientApi";

const PrincipalInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fieldLabels = {
    name: "Full Name",
    email: "Email",
    phone_no: "Phone Number",
    address: "Address",
    school_name: "School Name",
    joining_date: "Joining Date",
  };

  useEffect(() => {
    const getLoggedInPrincipal = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.unique_id) {
          setError("No principal logged in");
          setLoading(false);
          return;
        }

        const principalId = storedUser.unique_id;
        const data = await fetchPrincipalById(principalId);

        if (data.p_id !== principalId) {
          setError("Principal data mismatch");
          return;
        }

        setUserInfo(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to fetch principal data");
      } finally {
        setLoading(false);
      }
    };

    getLoggedInPrincipal();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorText>{error}</ErrorText>;
  if (!userInfo) return null;

  return (
    <UserInfoPage>
      <Content>
        <BgContainer>
          <BgImage src={bgImage} alt="Background" />
          <Icons>
            <NavIcon src={homeIcon} alt="Home" onClick={() => navigate("/dashboard")} />
            <NavIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
          </Icons>
          <Profile>
            <ProfilePic src={userInfo.image || bgImage} alt="Profile" />
          </Profile>
        </BgContainer>

        <InfoContainer>
  <InfoHeading>Principal Information</InfoHeading>
  <InfoGrid>
    {Object.keys(fieldLabels).map((field) => (
      <InfoItem key={field}>
        <Label>{fieldLabels[field]}</Label>
        <Value>
          {field === "joining_date"
            ? new Date(userInfo[field]).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : String(userInfo[field] || "")}
        </Value>
      </InfoItem>
    ))}
  </InfoGrid>
</InfoContainer>

      </Content>
    </UserInfoPage>
  );
};

export default PrincipalInfo;

const UserInfoPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;

  @media (max-width: 1024px) {
    height: 75vh;
  }
`;

const Content = styled.div`
  margin-top: 0;
  overflow-x: hidden;
  overflow-y: hidden;

  @media (max-width: 768px) {
    overflow-y: auto;
  }
`;

const BgContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;

  @media (max-width: 1024px) {
    height: 130px;
  }
`;

const BgImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const Icons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

const NavIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Profile = styled.div`
  position: absolute;
  bottom: -40px;
  left: 40px;
  display: flex;
  align-items: center;
`;

const ProfilePic = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
`;

const InfoContainer = styled.div`
  padding: 20px;
`;

const InfoHeading = styled.h2`
  color: #002087;
  font-weight: bold;
  margin-bottom: 15px;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;
  grid-template-columns: 1fr;
  gap:  4px;
 
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const Label = styled.label`
  position: relative;
  font-weight: bold;
  width: 150px;
  text-align: left;
  display: inline-block;
  padding-right: 20px;

  &::after {
    content: ":";
    position: absolute;
    right: 0;
  }

  @media (max-width: 1023px) {
    width: auto;
    font-size: 15px;
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const Value = styled.span`
  flex: 1;
  text-align: left;
  padding: 6px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ErrorText = styled.div`
  color: red;
`;
