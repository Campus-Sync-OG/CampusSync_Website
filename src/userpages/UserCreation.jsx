import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/ClientApi"; // adjust path as needed
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const Container = styled.div`
  padding: 0px 15px;
  font-family: sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 5px 20px;
  border-radius: 15px;
  color: white;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 25px;
  font-weight: bold;
  font-family: "Poppins";
`;

const IconWrapper = styled.div`
  display: flex;
`;

const IconBtn = styled.img`
  height: 28px;
  width: 28px;
  cursor: pointer;
`;

const SectionTitle = styled.h2`
  color: #002e9f;
  font-size: 20px;
  font-weight: bold;
  margin: 40px 0 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  background: #f1f2f7;
  border: none;
  border-radius: 6px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 12px;
  background: #f1f2f7;
  border: none;
  border-radius: 6px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  margin-top: 40px;
`;

const GenerateButton = styled.button`
  background: #d6004c;
  color: white;
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
`;

// Styled Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 30px 40px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background: #002e9f;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 4px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
  position: relative;
  top: 5px;
`;

const UserCreation = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setShowModal(true);
    } catch (error) {
      console.error("User creation failed:", error);
      alert("User creation failed");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Create User IDs</Title>
        <IconWrapper>
          <IconBtn
            src={homeIcon}
            alt="Home"
            title="Home"
            onClick={() => navigate("/admin-dashboard")}
          />
          <Divider />
          <IconBtn
            src={backIcon}
            alt="Back"
            title="Back"
            onClick={() => navigate(-1)}
          />
        </IconWrapper>
      </Header>

      <SectionTitle>Add Users</SectionTitle>

      <Form onSubmit={handleGenerate}>
        <FormGroup>
          <Label>Roles *</Label>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
            <option value="operator">Operator</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Name *</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Type here"
          />
        </FormGroup>

        <FormGroup>
          <Label>Phone Number *</Label>
          <Input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            placeholder="Type here"
          />
        </FormGroup>

        <ButtonGroup>
          <GenerateButton type="submit">Generate</GenerateButton>
        </ButtonGroup>
      </Form>

      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <p>
              <strong>ID and password is generated and sent</strong>
            </p>
            <CloseButton onClick={() => setShowModal(false)}>OK</CloseButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default UserCreation;
