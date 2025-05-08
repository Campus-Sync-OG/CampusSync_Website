import React, { useState } from "react";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(to right, #002e9f, #cc027c);
  padding: 10px;
  color: white;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 20px;
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

  const handleGenerate = (e) => {
    e.preventDefault();
    // Logic for ID generation can be added here
    setShowModal(true); // Show modal
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
          <Select required>
            <option value="">Select</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Principal">Principal</option>
            <option value="Operator">Operator</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Name *</Label>
          <Input type="text" placeholder="Type here" required />
        </FormGroup>

        <FormGroup>
          <Label>Phone Number *</Label>
          <Input type="tel" placeholder="Type here" required />
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
