import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { getAllFeedback } from "../api/ClientApi";
const Container = styled.div`
  padding: 2rem;
  font-family: Poppins;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 15px;
  color: white;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
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
    width: 100%;
    height: 100%;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  color: #002087;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 20px;

  input,
  select {
    padding: 0.6rem 1rem;
    background-color: #f2f3f8;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    min-width: 200px;
  }
`;

const SearchButton = styled.button`
  background-color: #e60050;
  color: white;
  padding: 0.6rem 2rem;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  height: fit-content;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #002087;
  color: white;
  padding: 12px;
  font-weight: bold;
`;

const Td = styled.td`
  background-color: #f8f8f8;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
`;



const PrincipalFeedback = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  

  useEffect(() => {
    // Fetch feedback data when component mounts
    const fetchFeedbacks = async () => {
      try {
        const data = await getAllFeedback();  // Call the API function
        setFeedbackList(data);  // Set the feedback data to state
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Feedback</Title>
        <Wrapper>
          <Link to="/principal-dashboard">
            <Icons>
              <img src={home} alt="home" />
            </Icons>
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <SectionTitle>Feedback List</SectionTitle>

      

      <Table>
        <thead>
          <tr>
            <Th>Sl no</Th>
            <Th>Date</Th>
            <Th>Reason</Th>
          </tr>
        </thead>
        <tbody>
        {feedbackList.length > 0 ? (
            feedbackList.map((item, index) => (
              <tr key={index}>
                <Td>{item.id}</Td>
                <Td>{item.createdAt}</Td>
                <Td>{item.message}</Td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No feedback found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default PrincipalFeedback;
