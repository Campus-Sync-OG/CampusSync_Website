import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { createTeacher } from "../api/ClientApi"; // Adjust the import based on your API structure

const TeacherInformation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emp_name: "",
    emp_id: "",
    gender: "",
    dob: "",
    blood_gp: "",
    religion: "",
    email: "",
    phone_no: "",
    role: "",
    status: "",
    address: "",
    joining_date: "",
    is_active: true, // default to active
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    try {
      // Send as JSON (no photo), or FormData if photo handling needed
      const payload = { ...formData };
      const response = await createTeacher(payload);

      console.log("Teacher saved:", response);
      alert("Teacher created successfully");
      navigate("/admin-teacher-information"); // Redirect to dashboard or another page
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert(error.response?.data?.message || "Failed to save teacher.");
    }
  };

  const handleReset = () => {
    setFormData({
      emp_name: "",
      emp_id: "",
      gender: "",
      dob: "",
      blood_gp: "",
      religion: "",
      email: "",
      phone_no: "",
      role: "",
      status: "",
      address: "",
      joining_date: "",
      photo: null,
    });
  };

  return (
    <Container>
      <NavContainer>
        <Title>Teacher Information</Title>
        <IconsContainer>
          <ImageIcon
            src={homeIcon}
            alt="Home"
            onClick={() => navigate("/dashboard")}
          />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </NavContainer>

      <Card>
        <SectionTitle>Add New Teacher</SectionTitle>
        <PhotoUploadWrap>
          <ProfilePreview>
            {formData.photo && (
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Preview"
                style={{ width: 100, height: 100 }}
              />
            )}
          </ProfilePreview>
          <ChooseFile>
            <Input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleInputChange}
            />
          </ChooseFile>
        </PhotoUploadWrap>
        <FlexWrap>
          <InputGroup>
            <Label>Employee Name *</Label>
            <Input
              name="emp_name"
              value={formData.emp_name}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Employee ID *</Label>
            <Input
              name="emp_id"
              value={formData.emp_id}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Gender *</Label>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Please Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Date of Birth *</Label>
            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Blood Group *</Label>
            <Input
              name="blood_gp"
              value={formData.blood_gp}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Religion *</Label>
            <Select
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
            >
              <option value="">Please Select Religion</option>
              <option>Hindu</option>
              <option>Muslim</option>
              <option>Christian</option>
              <option>Other</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Email</Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Phone</Label>
            <Input
              name="phone_no"
              value={formData.phone_no}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Role *</Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="">Please Select Role</option>
              <option>classTeacher</option>
              <option>subjectTeacher</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Status *</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="">Please Select Status</option>
              <option>active</option>
              <option>inactive</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Address *</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Joining Date *</Label>
            <Input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleInputChange}
            />
          </InputGroup>
        </FlexWrap>

        <ButtonRow>
          <Button onClick={handleSave}>Save</Button>
          <Button primary onClick={handleReset}>
            Reset
          </Button>
        </ButtonRow>
      </Card>
    </Container>
  );
};

export default TeacherInformation;
// ---------------- Styled Components ----------------

const Container = styled.div`
  padding: 2rem;
  background: #f0f2f5;
  font-family: Arial, sans-serif;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #d9534f);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: white;
  font-size: 25px;
  font-weight: bold;
  font-family: Poppins;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  width: 4px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
  position: relative;
  right: 30px;
`;

const ImageIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
  position: relative;
  right: 30px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  margin: 2rem 0 1rem;
  color: #002087;
`;

const Section = styled.h3`
  margin: 2rem 0 1rem;
  position: relative;
  left: 440px;
  font-size: 12px;
`;

const FlexWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #f0f2f8;
`;

const Select = styled.select`
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #f0f2f8;
`;

const PhotoUploadWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChooseFile = styled.div`
  input[type="file"] {
    font-size: 14px;
    padding: 0.5rem;
  }
`;

const ProfilePreview = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e0e0e0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  background: ${(props) => (props.primary ? "#002087" : "#df0043")};
  color: white;
`;
