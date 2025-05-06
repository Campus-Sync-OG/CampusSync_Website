import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // ✅ Icons imported
import bg from "../assets/images/bg1.png";
import logo from "../assets/images/logo.png";
import { resetPassword } from "../api/ClientApi"; // API function to handle password reset
import { toast } from "react-toastify"; // For notifications

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
  }
`;

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -4;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 32, 135, 0.9);
  z-index: -2;
`;

const BackgroundCurve = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  z-index: -1;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const LogoSection = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;

  img {
    width: 100px;
    height: auto;
  }
`;

const ForgotCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  width: 400px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
`;

const BackText = styled.div`
  text-align: left;
  color: #000;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #df0043;
  margin-bottom: 1.5rem;
`;

const Icon = styled.img`
  width: 90px;
  height: auto;
  margin-bottom: 0.5rem;
`;

const RoleLabel = styled.div`
  font-weight: bold;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 90%;

  gap: 1rem;
  padding: 0.8rem 2.5rem 0.8rem 0.8rem;
  border: 1px solid #df0043;
  border-radius: 4px;
  outline: none;
  margin-bottom: 10px;
  font-size: 0.9rem;
`;

const IconToggle = styled.div`
  position: absolute;
  top: 50%;
  right: 0.8rem;
  transform: translateY(-50%);
  cursor: pointer;
  color: #df0043;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #df0043;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
`;


const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #df0043;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
`;

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, icon } = location.state || {};

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'success' or 'error'

  const handleBack = () => navigate(-1);

  const handleReset = async () => {
    if (!userId || !oldPassword || !newPassword) {
      showModal('Please fill all fields.', 'error');
      return;
    }

    try {
      const res = await resetPassword({
        unique_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
      });

      // Show success message
      showModal(res.message || 'Password reset successful. Please log in with your new password.', 'success');
      navigate('/'); // Redirect to login or dashboard
    } catch (err) {
      // Show error message
      showModal(err.response?.data?.message || 'Password reset failed. Please try again.', 'error');
    }
  };

  const showModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <BackgroundImage>
          <img src={bg} alt="Background" />
        </BackgroundImage>

        <BackgroundOverlay />

        <BackgroundCurve>
          <svg
            viewBox="0 0 1440 1024"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M-4,0 C300,500 1640,100 1440,700 L1440,0 Z"
              fill="#DF0043"
            />
          </svg>
        </BackgroundCurve>

        <LogoSection>
          <img src={logo} alt="Logo" />
        </LogoSection>

        <ForgotCard>
          <BackText onClick={handleBack}>‹ Back</BackText>
          <Title>Login</Title>
          {icon && <Icon src={icon} alt={`${role} icon`} />}
          {role && <RoleLabel>{role}</RoleLabel>}

          <Input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <InputWrapper>
        <Input
          type={showOldPassword ? 'text' : 'password'}
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <IconToggle onClick={() => setShowOldPassword(!showOldPassword)}>
          {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </IconToggle>
      </InputWrapper>

      <InputWrapper>
        <Input
          type={showNewPassword ? 'text' : 'password'}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <IconToggle onClick={() => setShowNewPassword(!showNewPassword)}>
          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </IconToggle>
      </InputWrapper>

      <SubmitButton onClick={handleReset}>Reset Password</SubmitButton>
        </ForgotCard>

        <Footer>© 2024 Campus Sync School Management</Footer>
        <Modal show={modalVisible}>
          <ModalContent>
            <h3>{modalType === 'success' ? 'Success' : 'Error'}</h3>
            <p>{modalMessage}</p>
            <ModalButton onClick={closeModal}>Close</ModalButton>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default ForgotPassword;
