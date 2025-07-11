import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { postAnnouncement } from '../api/ClientApi';

const Container = styled.div`
  padding: 0 1.2rem;
  font-family: Poppins;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 25px 20px;
  border-radius: 15px;
  color: white;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
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
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  background-color: #f2f3f8;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  min-width: 220px;
  flex: 1;
`;

const Select = styled.select`
  background-color: #f2f3f8;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  min-width: 220px;
  flex: 1;
`;

const Textarea = styled.textarea`
  width: 100%;
  background-color: #f2f3f8;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  height: 120px;
  resize: none;
`;

const Label = styled.label`
  font-weight: 500;
  display: block;
  margin-bottom: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SubmitBtn = styled.button`
  background-color: #e60050;
  color: white;
  border: none;
  padding: 0.6rem 2rem;
  font-weight: bold;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
`;

const AddMoreBtn = styled(SubmitBtn)`
  background-color: #002087;
`;

const RemoveBtn = styled.button`
  background-color: #df0043;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  font-weight: bold;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
`;

const Announcement = () => {
  const navigate = useNavigate();

  const [formDataList, setFormDataList] = useState([
    {
      title: "",
      start_date: "",
      end_date: "",
      description: "",
    },
  ]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setFormDataList((prevFormDataList) =>
      prevFormDataList.map((formData, i) =>
        i === index ? { ...formData, [name]: value } : formData
      )
    );
  };

  const handleSubmit = async (e, index) => {
    e.preventDefault();

    const formData = formDataList[index];
    const announcementData = {
      title: formData.title,
      start_date: formData.start_date,
      end_date: formData.end_date,
      message: formData.description,
      status: "active",
    };

    try {
      const result = await postAnnouncement(announcementData);
      console.log("Announcement submitted successfully:", result);

      alert(`Announcement ${index + 1} Submitted Successfully!`);

      const updatedFormData = [...formDataList];
      updatedFormData[index] = {
        title: "",
        start_date: "",
        end_date: "",
        description: "",
      };
      setFormDataList(updatedFormData);
    } catch (error) {
      console.error("Error submitting announcement:", error);
      alert("Error submitting announcement!");
    }
  };

  const addMoreForm = () => {
    setFormDataList((prevFormDataList) => [
      ...prevFormDataList,
      { title: "", start_date: "", end_date: "", description: "" },
    ]);
  };

  const removeForm = (index) => {
    setFormDataList((prevFormDataList) =>
      prevFormDataList.filter((_, i) => i !== index)
    );
  };

  return (
    <Container>
      <Header>
        <Title>Announcement</Title>
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

      <SectionTitle>Add Announcement</SectionTitle>

      {formDataList.map((formData, index) => (
        <form onSubmit={(e) => handleSubmit(e, index)} key={index}>
          <FormGroup>
            <div style={{ flex: 1 }}>
              <Label>Title *</Label>
              <Input
                type="text"
                name="title"
                placeholder="Type here"
                value={formData.title}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <Label>Start Date *</Label>
              <Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <Label>End Date *</Label>
              <Input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>
          </FormGroup>

          <div>
            <Label>Description *</Label>
            <Textarea
              name="description"
              placeholder="Type here"
              value={formData.description}
              onChange={(e) => handleChange(e, index)}
              required
            />
          </div>

          <ButtonGroup>
            <SubmitBtn type="submit">Submit</SubmitBtn>
            {formDataList.length > 1 && (
              <RemoveBtn type="button" onClick={() => removeForm(index)}>
                Remove
              </RemoveBtn>
            )}
          </ButtonGroup>
        </form>
      ))}

      <ButtonGroup>
        <AddMoreBtn type="button" onClick={addMoreForm}>
          Add More
        </AddMoreBtn>
      </ButtonGroup>
    </Container>
  );
};

export default Announcement;
