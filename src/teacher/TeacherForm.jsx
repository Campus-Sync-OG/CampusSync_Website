import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 0px;
  margin-bottom: 10px;
  width: 95%;
`;

const Title = styled.h2`
  font-size: 20px;
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
    width: 25px;
    height: 25px;
  }
`;

const Container = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #002087;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ChooseLinkButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid #888;
  padding: 5px 10px;
  cursor: pointer;
`;

const Status = styled.span`
  color: ${(props) => (props.status === "Live" ? "red" : "grey")};
  font-weight: bold;
`;

const TeacherForm = () => {
  const navigate = useNavigate();
  const formData = [
    { id: 1, title: "Annual day 2024 experience feedback", status: "Live" },
    { id: 2, title: "Dance Club membership form", status: "Closed" },
    { id: 3, title: "National olympiad participation", status: "Live" },
    { id: 4, title: "Dance Club membership form", status: "Closed" },
    { id: 5, title: "National olympiad participation", status: "Live" },
    { id: 6, title: "Dance Club membership form", status: "Closed" },
    { id: 7, title: "National olympiad participation", status: "Live" },
  ];

  return (
    <Container>
      <Header>
        <Title>Form</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
            <Icons>
              <img src={home} alt="home" />
            </Icons>
          </Link>
          <Divider />
          <Link to="/teacher-dashboard">
            <Icons onClick={() => navigate(-1)}>
              {" "}
              {/* Navigate to the previous page */}
              <img src={back} alt="back" />
            </Icons>
          </Link>
        </Wrapper>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>Sl no</Th>
            <Th>Form Title</Th>
            <Th>Upload Link</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item, index) => (
            <tr key={item.id}>
              <Td>{index + 1}</Td>
              <Td>{item.title}</Td>
              <Td>
                <ChooseLinkButton>Choose Link</ChooseLinkButton> No file chosen
              </Td>
              <Td>
                <Status status={item.status}>{item.status}</Status>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TeacherForm;
