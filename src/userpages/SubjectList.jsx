import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { saveSubjects } from "../api/ClientApi"; // Adjust the import based on your file structure

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

const Container = styled.div`
  padding: 0 15px;
 
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  flex: 1;
`;

const Label = styled.label`
  font-family: "Poppins";
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
`;

const Ftitle = styled.div`
  font-size: 24px;
  color: #002087;
  margin: 10px 0;
  font-family: "Poppins";
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  background-color: ${(props) => props.color || "#002087"};
`;

const SearchButton = styled(Button)`
  background-color: #df0043;
  margin-top: 25px;
`;
const SubjectBox = styled(Input)`
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  width: 100%;
  font-size: 16px;
  border-radius: 8px;
`;

const RemoveButton = styled(Button)`
  background-color: #ff4d4f;
  color: white;
  margin-left: 1rem;
`;

const SubjectList = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [subjects, setSubjects] = useState([""]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Unauthorized: Please log in.");
      return navigate("/login");
    }

    const { role } = JSON.parse(userData);
    if (role !== "admin" && role !== "operator") {
      alert("Access denied: Only admin or operator allowed.");
      return navigate("/unauthorized");
    }
  }, [navigate]);

  const handleInputChange = (index, value) => {
    const updated = [...subjects];
    updated[index] = value;
    setSubjects(updated);
  };

  const handleAddSubject = () => setSubjects([...subjects, ""]);

  const handleRemoveSubject = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };
  const handleSaveSubjects = async () => {
    try {
      const filtered = subjects.filter((s) => s.trim() !== "");
      if (filtered.length === 0) return alert("Please enter valid subjects.");

      await saveSubjects(filtered);
      alert("Subjects saved successfully!");

      // Reset the form
      setSubjects([""]);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving subjects:", err);
      alert("Failed to save subjects.");
    }
  };
  return (
    <Container>
      <Header>
        <Title>Subject Management</Title>
        <Wrapper>
          <Link to="/admin-dashboard">
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

      <Form>
        <Ftitle>Enter Subjects</Ftitle>

        {subjects.map((subject, index) => (
          <Row key={index}>
            <Field style={{ width: "100%" }}>
              <Label>Subject {index + 1}</Label>
              <SubjectBox
                type="text"
                value={subject}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </Field>
            {isEditing && (
              <RemoveButton
                type="button"
                onClick={() => handleRemoveSubject(index)}
              >
                Remove
              </RemoveButton>
            )}
          </Row>
        ))}

        {isEditing && (
          <Button type="button" onClick={handleAddSubject}>
            Add Subject
          </Button>
        )}

        <ButtonContainer>
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button type="button" onClick={handleSaveSubjects}>
            Save
          </Button>

          <Button type="button" color="#007bff" onClick={() => navigate("/admin-subjectlistview")}>
            View Subjects
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default SubjectList;
