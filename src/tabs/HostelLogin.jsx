import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/images/logo.png";
import bg from "../assets/images/bg1.png";
import hostelIcon from "../assets/images/principalIcon.png"; 
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

const LoginCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  width: 400px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  @media (max-width: 480px) {
    width: 250px;
    height: 370px;
  }
  @media (max-width: 420px) {
    width: 230px;
    height: 370px;
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

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #df0043;
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
`;

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
`;

const ForgotPassword = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #df0043;
  cursor: pointer;
  text-decoration: underline;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
`;

const HostelLogin = () => {
  const navigate = useNavigate();
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ Dummy Hostel Login Bypass
    if (uniqueId === "W-2025-0001" && password === "123456") {
      localStorage.setItem("token", "dummy-hostel-token-xyz");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Hostel Admin",
          role: "Hostel",
          unique_id: uniqueId,
        })
      );
      navigate("/hostel-dashboard");
      return;
    }

    const credentials = { unique_id: uniqueId, password };

    try {
      const response = await loginUser(credentials);

      if (!response || !response.user) {
        setError("Invalid credentials");
        return;
      }

      const { token, user } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/hostel-dashboard");
    } catch (err) {
      setError("Login failed. Try again.");
      console.error("Hostel Login Error:", err);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password", {
      state: {
        role: "Hostel",
        icon: hostelIcon,
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
          <svg viewBox="0 0 1440 1024" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M-4,0 C300,500 1640,100 1440,700 L1440,0 Z" fill="#DF0043" />
          </svg>
        </BackgroundCurve>

        <LoginCard>
          <form onSubmit={handleLogin}>
            <BackText onClick={handleBack}>‹ Back</BackText>
            <Title>Login</Title>
            <Icon src={hostelIcon} alt="Hostel" />
            <RoleLabel>Hostel</RoleLabel>

            {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}

            <Input
              type="text"
              placeholder="User ID"
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              required
            />

            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <ToggleIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </ToggleIcon>
            </PasswordWrapper>

            <LoginButton type="submit">Login</LoginButton>

            <ForgotPassword onClick={handleForgotPassword}>
              Forgot Password?
            </ForgotPassword>
          </form>
        </LoginCard>

        <Footer>© 2024 Campus Sync School Management</Footer>

      </Container>
    </>
  );
};

export default HostelLogin;
