import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const LandingContainer = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ContentContainer = styled.div`
  text-align: center;
  color: white;
  z-index: 1;
`;

const LogoSection = styled.div`
  position: relative;
  top: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rem;

  img {
    width: 15vw;
    height: auto;
    max-width: 300px;
  }

  @media (max-width: 1366px) {
    img {
      position: relative;
      bottom: 15px;
      width: 15vw;
    }
  }

  @media (max-width: 1024px) {
    position: relative;
    bottom: -3rem;
  }

  @media (max-width: 768px) {
    img {
      position: relative;
      bottom: 30px;
      width: 30vw;
    }
  }

  @media (max-width: 480px) {
    img {
      width: 40vw;
    }
  }

  @media (max-width: 344px) {
    img {
      position: relative;
      bottom: 25px;
    }
  }
`;

const TextSection = styled.div`
  font-size: clamp(1.2rem, 2vw, 2rem);
  line-height: 1.8;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  margin-bottom: 2rem;

  h1 {
    font-size: clamp(2rem, 3vw, 3rem);
    margin: 0;
    font-family: "Koulen", sans-serif;
    position: relative;
    bottom: -1rem;
  }

  @media (max-width: 1366px) {
    position: relative;
    bottom: 1.2rem;
  }

  @media (max-width: 1024px) {
    position: relative;
    bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    h1 {
      bottom: 30px;
    }
  }

  @media (max-width: 344px) {
    h1 {
      font-size: 1.7rem;
      bottom: 6px;
    }
  }

  @media (max-width: 320px) {
    position: relative;
  }
`;

const SubTextSection = styled.div`
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-family: "Kalam", sans-serif;
  color: white;

  p {
    position: relative;
    top: 1rem;
    letter-spacing: 0.1rem;
  }

  @media (max-width: 1366px) {
    p {
      top: -0.8rem;
    }
  }

  @media (max-width: 1024px) {
    position: relative;
    bottom: -3rem;
  }

  @media (max-width: 768px) {
    p {
      top: -4.5rem;
    }
  }
  @media (max-width: 344px) {
    p {
      position: relative;
      top: -59px;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    position: relative;
    bottom: 3rem;
    left: 0.1rem;
  }
  @media (max-width: 344px) {
    position: relative;
    top: -7px;
    left: -7px;
  }
`;

const DotNavigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  position: relative;
  bottom: 6rem;
  left: 2%;

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: white;
    opacity: 1.5;
    transition: opacity 0.3s;
    position: relative;
    bottom: 3em;

    &.active {
      opacity: 1;
    }
  }

  @media (max-width: 1366px) {
    gap: 0.5rem;
    position: relative;
    top: -7rem;
  }

  @media (max-width: 1024px) {
    gap: 0.5rem;
    position: relative;
    top: -6rem;
  }

  @media (max-width: 768px) {
    position: relative;
    gap: 0.5rem;
  }

  @media (max-width: 344px) {
    position: relative;
    top: -70px;
  }

  @media (max-width: 320px) {
    position: relative;
    top: -9rem;
  }
`;
const Button = styled.button`
  background-color: #df0043;
  color: white;
  font-weight: bold;
  padding: 0.8rem 2rem;
  border-radius: 0.375rem;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  top: -2rem;
  left: 1rem;

  &:hover {
    background-color: #6a1b9a;
  }

  @media (max-width: 1366px) {
    padding: 0.6rem 1.5rem;
    position: relative;
    bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
  }

  @media (max-width: 344px) {
    position: relative;
    top: 50px;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/login"); // Navigate to the login page
  };
  return (
    <LandingContainer>
      <BackgroundCurve>
        <svg
          viewBox="0 0 1440 1024"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M-4,0 C300,500 1640,100 1440,700 L1440,0 Z" fill="#DF0043" />
        </svg>
      </BackgroundCurve>
      <Background>
        <svg
          viewBox="0 0 1440 1024"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect x="0" y="0" width="1440" height="1024" fill="#002087" />
        </svg>
      </Background>

      <ContentContainer>
        <LogoSection>
          <img src={logo} alt="Logo" />
        </LogoSection>
        <SubTextSection>
          <p>Where Knowledge Meets Convenience</p>
        </SubTextSection>
        <TextSection>
          <h1>School Management Portal</h1>
        </TextSection>
        <ButtonContainer>
          <Button onClick={handleButtonClick}>Click Here</Button>
        </ButtonContainer>

        <DotNavigation>
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </DotNavigation>
      </ContentContainer>
    </LandingContainer>
  );
};

export default LandingPage;
