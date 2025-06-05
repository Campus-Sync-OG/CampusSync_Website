import React, { useState ,useEffect} from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import home from '../assets/images/home.png';
import back from '../assets/images/back.png';
import { postNotification } from '../api/ClientApi';

const Container = styled.div`
  padding: 0.5rem;
  font-family:Poppins;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 25px 20px;
  border-radius: 15px;
  color: white;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-family: "Poppins";
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

const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #002087;
  margin-bottom: 1.5rem;
  margin-top: 2.5rem;
  width:300px;
`;

const Form = styled.form`
   display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width:120px;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  background-color: #f2f3f8;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
width: 420px;         // 👈 Adjust width here
  max-width: 100%;  
  gap:30px;
  @media (max-width: 768px) {
   
    width:320px;
  }
    @media (max-width: 376px) {
   
    width:250px;
  }
`;
const Select = styled.select`
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const ButtonRow = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #e60050;
  color: white;
  padding: 0.6rem 1.8rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const AddMoreButton = styled.button`
  background-color: #002087;
  color: white;
  padding: 0.6rem 1.8rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const NotificationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notification_type: '',
  });
  
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const role = loggedInUser?.role ;
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postNotification(formData, role);
      alert('Notification submitted successfully!');
      setFormData({ title: '', message: '', notification_type: '' });
    } catch (error) {
      console.error('Error submitting notification:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };
  

  const handleAddMore = (e) => {
    e.preventDefault();
    setFormData({ title: '', description: '' }); // Just clear
  };

  return (
    <Container>
      <Header>
        <Title>Notification</Title>
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

      <FormTitle>Add Notification</FormTitle>
      <Form>
      <FieldGroup>
  <Label>Notification Type *</Label>
  <Select
    name="notification_type"
    value={formData.notification_type}
    onChange={handleChange}
  >
    <option value="">Select type</option>
    <option value="General Announcement">General Announcement</option>
    <option value="Event Announcement">Event Announcement</option>
    <option value="Fee Update">Fee Update</option>
    <option value="Academic Results">Academics Results</option>
    <option value="Leave Update">Leave Update</option>
  </Select>
</FieldGroup>
        <FieldGroup>
          <Label>Title *</Label>
          <Input
            name="title"
            type="text"
            placeholder="Type here"
            value={formData.title}
            onChange={handleChange}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Message *</Label>
          <Input
            name="message"
            type="text"
            placeholder="Type here"
            value={formData.message}
            onChange={handleChange}
          />
        </FieldGroup>
      </Form>

      <ButtonRow>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        <AddMoreButton onClick={handleAddMore}>Add more</AddMoreButton>
      </ButtonRow>
    </Container>
  );
};

export default NotificationForm;
