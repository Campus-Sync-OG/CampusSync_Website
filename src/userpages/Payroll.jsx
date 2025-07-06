import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
const PayrollSetup = () => {
  const navigate = useNavigate();

  return (
    <Container>
       <Header>
              <Title>Student Document Upload</Title>
              <Wrapper>
                <Icons onClick={() => navigate("/admin-dashboard")}>
                  <img src={home} alt="home" />
                </Icons>
                <Divider />
                <Icons onClick={() => navigate(-1)}>
                  <img src={back} alt="back" />
                </Icons>
              </Wrapper>
            </Header>
      <ButtonGroup>
        <ActionButton onClick={() => navigate('/admin-structure')}>
          Add Structure
        </ActionButton>
        <ActionButton onClick={() => navigate('/payroll/add-component-value')}>
          Add Component Value
        </ActionButton>
        <ActionButton onClick={() => navigate('/payroll/add-component-type')}>
          Add Component Type
        </ActionButton>
        <ActionButton onClick={() => navigate('/payroll/generate')}>
          Payroll
        </ActionButton>
      </ButtonGroup>
    </Container>
  );
};

export default PayrollSetup;

// Styled Components
const Container = styled.div`

  
  padding: 2rem;
  
`;



const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding:5rem auto;
  margin-top:2rem;
  max-width:400px;
`;

const ActionButton = styled.button`
  padding: 0.9rem 1.2rem;
  background-color:rgb(3, 24, 108);
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 22px 20px;
  border-radius: 10px;
  color: white;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 2px;
  height: 25px;
  background-color: white;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  img {
    width: 25px;
    height: 25px;
  }
`;