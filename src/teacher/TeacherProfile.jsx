import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchTeacherProfile } from "../api/ClientApi";
import bgImage from "../assets/images/bg.jpeg";
import profileImage from "../assets/images/profile.png";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    emp_name: "",
    phone_no: "",
    email: "",
    emp_id: "",
    subjects: "",
    joining_date: "",
    role: "",
    gender: "",
    dob: "",
    class: "",
    section: "",
    address: "",
    classesAssigned: "",
    department: "",
    optionA: false,
    optionB: false,
    optionC: false,
    optionD: false,
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const empId = loggedInUser?.unique_id;

        if (empId) {
          const res = await fetchTeacherProfile(empId);
          setUserInfo(res.teacher);
        } else {
          console.warn("Employee ID not found in localStorage.");
        }
      } catch (err) {
        console.error("Error fetching teacher profile:", err);
      }
    };

    getProfile();
  }, []);

  return (
    <Container>
      <NavigationContainer>
        <NavTitle>Teacher Profile</NavTitle>
        <NavIconsContainer>
          <NavIcon
            src={homeIcon}
            alt="Home"
            onClick={() => navigate("/teacher-dashboard")}
          />
          <IconDivider />
          <NavIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </NavIconsContainer>
      </NavigationContainer>

      <Header>
        <BackgroundImage src={bgImage} alt="Background" />
        <ProfileSection>
          <ProfileImage src={profileImage} alt="Profile" />
        </ProfileSection>
      </Header>

      <InfoGrid>
        {/* Basic Information */}
        <Section>
          <SectionTitle>My Basic Information</SectionTitle>
          <Row>
            <Column>
              <Label>First Name</Label>
              <Input value={userInfo.emp_name?.split(" ")[0] || ""} readOnly />
            </Column>
            <Column>
              <Label>Last Name</Label>
              <Input value={userInfo.emp_name?.split(" ")[1] || ""} readOnly />
            </Column>
          </Row>
          <Row>
            <Column>
              <Label>Gender</Label>
              <RadioGroup>
                <RadioButton
                  type="radio"
                  checked={userInfo.gender === "Male"}
                  readOnly
                />{" "}
                Male
                <RadioButton
                  type="radio"
                  checked={userInfo.gender === "Female"}
                  readOnly
                />{" "}
                Female
              </RadioGroup>
            </Column>
            <Column>
              <Label>Date of Birth</Label>
              <Input value={userInfo.dob || ""} readOnly />
            </Column>
          </Row>
          <Row>
            <Column>
              <Label>Class</Label>
              <Input value={userInfo.class || ""} readOnly />
            </Column>
            <Column>
              <Label>Section</Label>
              <Input value={userInfo.section || ""} readOnly />
            </Column>
          </Row>
        </Section>

        {/* Contact Information */}
        <Section>
          <SectionTitle>Contact Information</SectionTitle>
          <Row>
            <Column>
              <Label>Phone</Label>
              <Input value={userInfo.phone_no || ""} readOnly />
            </Column>
            <Column>
              <Label>Email</Label>
              <Input value={userInfo.email || ""} readOnly />
            </Column>
          </Row>
          <Row>
            <Column fullWidth>
              <Label>Address</Label>
              <Input value={userInfo.address || ""} readOnly />
            </Column>
          </Row>
        </Section>

        {/* Department & Classes */}
        <Section>
          <SectionTitle>My Department & Class Assigned</SectionTitle>
          <Row>
            <Column>
              <Label>My Faculty ID</Label>
              <Input value={userInfo.emp_id || ""} readOnly />
            </Column>
            <Column>
              <Label>Classes Assigned</Label>
              <Input value={userInfo.classesAssigned || ""} readOnly />
            </Column>
          </Row>
          <Row>
            <Column>
              <Label>Department</Label>
              <Input value={userInfo.department || ""} readOnly />
            </Column>
            <Column>
              <Label>Designation</Label>
              <Input value={userInfo.role || ""} readOnly />
            </Column>
          </Row>
        </Section>

        {/* Additional Information */}
        <Section>
          <SectionTitle>Additional Information</SectionTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <input type="checkbox" checked={userInfo.optionA} readOnly />{" "}
              Option A
            </CheckboxLabel>
            <CheckboxLabel>
              <input type="checkbox" checked={userInfo.optionB} readOnly />{" "}
              Option B
            </CheckboxLabel>
            <CheckboxLabel>
              <input type="checkbox" checked={userInfo.optionC} readOnly />{" "}
              Option C
            </CheckboxLabel>
            <CheckboxLabel>
              <input type="checkbox" checked={userInfo.optionD} readOnly />{" "}
              Option D
            </CheckboxLabel>
          </CheckboxGroup>
        </Section>
      </InfoGrid>
    </Container>
  );
};

export default TeacherProfile;

// Styled-components
const Container = styled.div`
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 70vh;
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
`;

const NavTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  font-family: Poppins;
  @media (max-width: 426px) {
    font-size: 14px;
  }
`;

const NavIconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const IconDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: white;
`;

const Header = styled.div`
  position: relative;
  height: 150px;
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileSection = styled.div`
  position: absolute;
  bottom: -40px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 80px;
  border-radius: 50%;
  border: 3px solid white;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px black;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 60px;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #002087;
  font-size: 18px;
  margin-bottom: 15px;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const Column = styled.div`
  flex: ${({ fullWidth }) => (fullWidth ? "1 1 100%" : "1 1 48%")};
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 90%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 5px;
`;

const RadioButton = styled.input`
  margin-right: 5px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;
