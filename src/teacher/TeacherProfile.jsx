import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchTeacherProfile, updateTeacher } from "../api/ClientApi";
import bgImage from "../assets/images/bg.jpeg";
import profileImage from "../assets/images/profile.png";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [editableFields, setEditableFields] = useState({
    role: "",
    class_name: "",
    section_name: ""
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const empId = loggedInUser?.unique_id;

        if (empId) {
          const res = await fetchTeacherProfile(empId);
          setUserInfo(res.teacher);
          setEditableFields({
            role: res.teacher.role || "",
            class_name: res.teacher.class || "",
            section_name: res.teacher.section || ""
          });
        }
      } catch (err) {
        console.error("Error fetching teacher profile:", err);
      }
    };

    getProfile();
  }, []);

  const handleSubmit = async () => {
    try {
      const empId = userInfo.emp_id;
      const { role, class_name, section_name } = editableFields;

      const payload = { role };
      if (role === "Class Teacher") {
        payload.class_name = class_name;
        payload.section_name = section_name;
      }

      await updateTeacher(empId, payload);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update teacher profile:", error);
      alert("Update failed.");
    }
  };

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
                <RadioButton type="radio" checked={userInfo.gender === "Male"} readOnly /> Male
                <RadioButton type="radio" checked={userInfo.gender === "Female"} readOnly /> Female
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
              <Input as="select" value={editableFields.role} onChange={(e) => setEditableFields({ ...editableFields, role: e.target.value })}>
                <option value="">Select Role</option>
                <option value="Subject Teacher">Subject Teacher</option>
                <option value="Class Teacher">Class Teacher</option>
              </Input>
            </Column>
          </Row>

          {editableFields.role === "Class Teacher" && (
            <Row>
              <Column>
                <Label>Class</Label>
                <Input value={editableFields.class_name} onChange={(e) => setEditableFields({ ...editableFields, class_name: e.target.value })} />
              </Column>
              <Column>
                <Label>Section</Label>
                <Input value={editableFields.section_name} onChange={(e) => setEditableFields({ ...editableFields, section_name: e.target.value })} />
              </Column>
            </Row>
          )}

          <Row>
            <Column fullWidth>
              <button
                style={{
                  backgroundColor: "#002087",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={handleSubmit}
              >
                Submit Changes
              </button>
            </Column>
          </Row>
        </Section>
      </InfoGrid>
    </Container>
  );
};

export default TeacherProfile;

// Keep your styled-components as they are below this line


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
