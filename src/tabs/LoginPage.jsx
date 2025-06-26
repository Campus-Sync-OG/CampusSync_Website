import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import bg from "../assets/images/bg1.png";
import adminIcon from "../assets/images/adminIcon.png";
import teacherIcon from "../assets/images/teacherIcon.png";
import studentIcon from "../assets/images/studentIcon.png";
import principalIcon from "../assets/images/principalIcon.png";

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

const LogoSection = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;

  img {
    width: 100px;
    height: auto;
  }
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

const LoginBox = styled.div`
  background: #fff;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 50%;
  height: 50vh;

  @media (max-width: 1366px) {
    width: 71%;
    height: 62vh;
  }
  @media (max-width: 1024px) {
    width: 71%;
    height: 62vh;
  }
  @media (max-width: 768px) {
    width: 86%;
    height: 62vh;
  }
  @media (max-width: 460px) {
    height: 62vh;
  }
  @media (max-width: 320px) {
    height: 56vh;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #df0043;
  margin-bottom: 3rem;

  @media (max-width: 460px) {
    margin-bottom: 0rem;
  }
  @media (max-width: 320px) {
    margin-bottom: 1rem;
  }
`;

const RoleSelection = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 0rem;

  @media (max-width: 460px) {
    gap: 0rem 0;
  }
  @media (max-width: 320px) {
    gap: 0rem 0;
  }
`;

const RoleCard = styled.div`
  color: #fff;
  border-radius: 8px;
  padding: 1rem;
  width: 120px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  span {
    display: block;
    font-weight: bold;
    margin-top: 0.5rem;
  }

  @media (max-width: 320px) {
    padding: 0px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;

  img {
    width: ${({ imgWidth }) => imgWidth || "90px"};
    height: ${({ imgHeight }) => imgHeight || "90px"};
    object-fit: contain;
    transition: all 0.3s ease;
  }

  /* Admin Responsive */
  ${({ isAdmin }) =>
    isAdmin &&
    `
    position:relative;
    bottom:10px;

    @media (max-width: 460px) {
      img {
        width: 213px !important;
        height: 134px !important;
        position: relative;
        left:10px;
      
            }
    }
    @media (max-width: 320px) {
      img {
        width: 120px !important;
        height: 130px !important;
            }
    }
  `}

  /* Principal Responsive */
  ${({ isPrincipal }) =>
    isPrincipal &&
    `
    @media (max-width: 460px) {
      img {
        width: 100px !important;
        height: 120px !important;
        position: relative;
        right:10px;
      }
    }
    @media (max-width: 320px) {
      img {
        width: 100px !important;
        height: 115px !important;
         position: relative;
        right:10px;
        bottom:5px;
      }
    }
  `}

  /* Teacher Responsive */
  ${({ isTeacher }) =>
    isTeacher &&
    `
    position:relative;
    top:8px;
    @media (max-width: 460px) {
      img {
        width: 105px !important;
        height: 125px !important;
        position: relative;
        left:10px;
        bottom:20px;
      }
    }
    @media (max-width: 320px) {
      img {
        width: 105px !important;
        height: 125px !important;
      }
    }
  `}

  /* Student Responsive */
  ${({ isStudent }) =>
    isStudent &&
    `
     position:relative;
    top:8px;
    @media (max-width: 480px) {
      img {
        width: 100px !important;
        height: 120px !important;
        position: relative;
        right:10px;
        bottom:20px;
      }
    }
      @media (max-width: 320px) {
      img {
        width: 100px !important;
        height: 125px !important;
        position: relative;
        right:10px;
        bottom:17px;
}}
  `}
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
`;

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    localStorage.setItem("selectedRole", role); // ✅ Save selected role

    switch (role) {
      case "admin":
        navigate("/admin-login");
        break;
      case "principal":
        navigate("/principal-login");
        break;
      case "teacher":
        navigate("/teacher-login");
        break;
      case "student":
        navigate("/student-login");
        break;
      default:
        break;
    }
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

        <LoginBox>
          <Title>Login</Title>
          <RoleSelection>
            <RoleCard onClick={() => handleRoleClick("admin")}>
              <IconWrapper imgWidth="212px" imgHeight="235px" isAdmin>
                <img src={adminIcon} alt="Admin" />
              </IconWrapper>
            </RoleCard>
            <RoleCard onClick={() => handleRoleClick("principal")}>
              <IconWrapper imgWidth="148px" imgHeight="200px" isPrincipal>
                <img src={principalIcon} alt="Principal" />
              </IconWrapper>
            </RoleCard>
            <RoleCard onClick={() => handleRoleClick("teacher")}>
              <IconWrapper imgWidth="150px" imgHeight="193px" isTeacher>
                <img src={teacherIcon} alt="Teacher" />
              </IconWrapper>
            </RoleCard>
            <RoleCard onClick={() => handleRoleClick("student")}>
              <IconWrapper imgWidth="148px" imgHeight="200px" isStudent>
                <img src={studentIcon} alt="Student" />
              </IconWrapper>
            </RoleCard>
          </RoleSelection>
        </LoginBox>

        <Footer>© 2024 Campus Sync School Management</Footer>
      </Container>
    </>
  );
};

export default LoginPage;
