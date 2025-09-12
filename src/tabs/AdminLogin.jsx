import React, { useState,useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/images/logo.png";
import bg from "../assets/images/bg1.png";
import adminIcon from "../assets/images/adminIcon.png";
import { loginUser } from "../api/ClientApi";

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

const LoginCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  width: 400px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    width: 250px;
    height: 350px;
  }
  @media (max-width: 420px) {
    width: 230px;
    height: 350px;
  }
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

  @media (max-width: 480px) {
    margin-bottom: 0px;
  }
`;

const Icon = styled.img`
  width: 90px;
  height: auto;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    margin-bottom: 0px;
  }
`;

const RoleLabel = styled.div`
  font-weight: bold;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #df0043;
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
  margin-left: -13px;

  @media (max-width: 480px) {
    position: relative;
    bottom: 30px;
    margin-bottom: 10px;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #df0043;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  @media (max-width: 480px) {
    position: relative;
    bottom: 50px;
  }
`;

const ForgotPassword = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #df0043;
  cursor: pointer;
  text-decoration: underline;

  @media (max-width: 480px) {
    position: relative;
    bottom: 55px;
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
`;

// New styles for password visibility
const PasswordWrapper = styled.div`
  position: relative;
`;

const ToggleIcon = styled.div`
  position: absolute;
  top: 40%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #df0043;

  @media (max-width: 480px) {
    position: relative;
    bottom: 59px;
    left: 45%;
    margin: 0;
  }
`;

const AdminLogin = ({ role = "Admin" || "operator" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [uniqueId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const icon = role === "Admin" ? adminIcon : operatorIcon;

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = {
      unique_id: uniqueId,
      password: password,
    };

    const selectedRole = localStorage.getItem("selectedRole");

    try {
      const response = await loginUser(credentials);

      // ✅ Make sure response is valid
      if (!response || !response.user) {
        setError("Something went wrong. Please try again.");
        return;
      }

      const { token, user } = response;

      if (user.role !== selectedRole) {
        setError("Role mismatch. Please go back and select the correct role.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("selectedRole");

      navigate("/admin-dashboard"); // or redirect to role-based dashboard
    } catch (err) {
      console.error("Login failed:", err);
      setError(err?.response?.data?.message || "Invalid credentials");
    }
  };
  const handleBack = () => {
    navigate("/login");
  };

  useEffect(() => {
    const navType =
      window.performance.getEntriesByType("navigation")[0]?.type ||
      window.performance.navigation?.type;

    const isRefresh =
      navType === "reload" || navType === 1;

    if (isRefresh) {
      window.location.replace("/login");
    }
  }, []);

  const handleForgotPassword = () => {
    navigate("/forgot-password", {
      state: {
        role: "Admin",
        icon: adminIcon,
        unique_id: uniqueId,
      },
    });
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

        <LoginCard>
          <form onSubmit={handleLogin}>
            <BackText onClick={handleBack}>‹ Back</BackText>
            <Title>Login</Title>
            <Icon src={icon} alt={role} />
            <RoleLabel>{role}</RoleLabel>

            <Input
              type="text"
              placeholder="User ID"
              value={uniqueId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <ToggleIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </ToggleIcon>
            </PasswordWrapper>

            <LoginButton onClick={handleLogin}>Login</LoginButton>
            <ForgotPassword onClick={handleForgotPassword}>
              Forgot Password?
            </ForgotPassword>
          </form>
        </LoginCard>

        <Footer>© 2024 Campus Synergy School Management</Footer>
      </Container>
    </>
  );
};

export default AdminLogin;
