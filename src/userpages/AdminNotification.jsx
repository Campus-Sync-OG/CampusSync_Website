import React, { useState } from "react";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
 
const Container = styled.div`
  padding: 20px;
  background-color: white;
`;
 
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 30px;
`;
 
const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
`;
 
const IconGroup = styled.div`
  display: flex;
  gap: 15px;
`;
 
const Icon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
 
const SubTitle = styled.h3`
  color: #002087;
  font-weight: 600;
  margin-bottom: 20px;
`;
 
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 30px;
`;
 
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  position: relative;
`;
 
const Label = styled.label`
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
`;
 
const Input = styled.input`
  width: 300px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background-color: #f1f1fa;
  outline: none;
`;
 
const TextArea = styled.textarea`
  width: 640px;
  height: 120px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background-color: #f1f1fa;
  outline: none;
  resize: none;
`;
 
const ButtonWrapper = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;
 
const Button = styled.button`
  padding: 10px 20px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 6px;
  background-color: ${(props) =>
    props.variant === "submit" ? "#df0043" : "#002087"};
  cursor: pointer;
 
  &:hover {
    opacity: 0.9;
  }
`;
 
const DeleteBtn = styled.button`
  position: absolute;
  top: 0;
  right: -40px;
  background-color: #df0043;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-weight: bold;
  line-height: 1;
 
  &:hover {
    opacity: 0.85;
  }
`;
 
const AdminNotification = () => {
  const [notifications, setNotifications] = useState([
    { title: "", description: "" },
  ]);
 
  const handleChange = (index, field, value) => {
    const updated = [...notifications];
    updated[index][field] = value;
    setNotifications(updated);
  };
 
  const handleAddMore = () => {
    setNotifications([...notifications, { title: "", description: "" }]);
  };
 
  const handleDelete = (index) => {
    const updated = [...notifications];
    updated.splice(index, 1);
    setNotifications(updated);
  };
 
  const handleSubmit = () => {
    for (let i = 0; i < notifications.length; i++) {
      const { title, description } = notifications[i];
      if (!title || !description) {
        alert(
          `Notification ${i + 1} is incomplete. Please fill in all fields.`
        );
        return;
      }
    }
 
    alert(
      "Notifications submitted:\n\n" +
        notifications
          .map(
            (n, idx) =>
              `#${idx + 1}\nTitle: ${n.title}\nDescription: ${n.description}`
          )
          .join("\n\n")
    );
 
    setNotifications([{ title: "", description: "" }]);
  };
 
  return (
    <Container>
      <Header>
        <Title>Notification</Title>
        <IconGroup>
          <Icon src={home} alt="Home" />
          <Icon src={back} alt="Back" />
        </IconGroup>
      </Header>
 
      <SubTitle>Add Notification</SubTitle>
 
      <FormWrapper>
        {notifications.map((notification, index) => (
          <div key={index}>
            <InputGroup>
              <Label>
                Title <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="text"
                name="title"
                placeholder="Type here"
                value={notification.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                required
              />
              {notifications.length > 1 && (
                <DeleteBtn onClick={() => handleDelete(index)}>×</DeleteBtn>
              )}
            </InputGroup>
 
            <InputGroup>
              <Label>
                Description <span style={{ color: "red" }}>*</span>
              </Label>
              <TextArea
                name="description"
                placeholder="Type here"
                value={notification.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                required
              />
            </InputGroup>
          </div>
        ))}
      </FormWrapper>
 
      <ButtonWrapper>
        <Button variant="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <Button onClick={handleAddMore}>Add more</Button>
      </ButtonWrapper>
    </Container>
  );
};
 
export default AdminNotification;