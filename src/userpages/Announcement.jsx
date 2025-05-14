import React, { useState } from "react";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(to right, #002e9f, #cc027c);
  padding: 20px;
  color: white;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 22px;
`;

const IconBtn = styled.img`
  height: 30px;
  width: 30px;
  cursor: pointer;
  margin-left: 15px;
`;

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background-color: white;
  margin: 0 10px;
`;

const SectionTitle = styled.h2`
  color: #002e9f;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;

  & > div {
    flex: 1;
    min-width: 200px;
  }
`;

const Input = styled.input`
  padding: 10px;
  width: 90%;
  border: none;
  border-radius: 5px;
  background: #f1f2f7;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background: #f1f2f7;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  height: 120px;
  resize: none;
  border: none;
  background: #f1f2f7;
  border-radius: 5px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const SubmitButton = styled.button`
  background: #d6004c;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
`;

const AddMoreButton = styled.button`
  padding: 10px 20px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 6px;
  background-color: #002087;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 15px;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 6px;
  background-color: gray;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([
    { title: "", duration: "", date: "", description: "" },
  ]);
  const navigate = useNavigate();

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...announcements];
    updated[index][name] = value;
    setAnnouncements(updated);
  };

  const handleAddMore = () => {
    setAnnouncements([
      ...announcements,
      { title: "", duration: "", date: "", description: "" },
    ]);
  };

  const handleDelete = (index) => {
    const updated = announcements.filter((_, i) => i !== index);
    setAnnouncements(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !announcements[0].title ||
      !announcements[0].duration ||
      !announcements[0].date ||
      !announcements[0].description
    ) {
      alert("First announcement form is required.");
      return;
    }

    console.log("Submitted announcements:", announcements);
    alert("Announcements submitted!");
    // Optionally reset after submission:
    setAnnouncements([{ title: "", duration: "", date: "", description: "" }]);
  };

  return (
    <Container>
      <Header>
        <Title>Announcement</Title>
        <div style={{ display: "flex", alignItems: "center" }}>

          <div onClick={() => navigate("/admin-dashboard")} style={{ cursor: "pointer" }}>
            <IconBtn src={homeIcon} alt="Home" title="Home" />
          </div>
          
          <Divider />
      
          <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
            <IconBtn src={backIcon} alt="Back" title="Back" />
          </div>
        </div>
      </Header>

      <SectionTitle>Add Announcement</SectionTitle>

      <form onSubmit={handleSubmit}>
        {announcements.map((form, index) => (
          <div key={index} style={{ marginBottom: "40px" }}>
            <FormRow>
              <div>
                <label>Title *</label>
                <Input
                  placeholder="Type here"
                  name="title"
                  value={form.title}
                  onChange={(e) => handleChange(index, e)}
                  required={index === 0}
                />
              </div>
              <div>
                <label>Duration *</label>
                <Select
                  name="duration"
                  value={form.duration}
                  onChange={(e) => handleChange(index, e)}
                  required={index === 0}
                >
                  <option value="">Select Time</option>
                  <option>30 mins</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </Select>
              </div>
              <div>
                <label>Date *</label>
                <Input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(e) => handleChange(index, e)}
                  required={index === 0}
                />
              </div>
            </FormRow>

            <div>
              <label>Description *</label>
              <TextArea
                placeholder="Type here"
                name="description"
                value={form.description}
                onChange={(e) => handleChange(index, e)}
                required={index === 0}
              />
            </div>

            {index !== 0 && (
              <div style={{ marginTop: "10px" }}>
                <DeleteButton type="button" onClick={() => handleDelete(index)}>
                  Delete
                </DeleteButton>
              </div>
            )}
          </div>
        ))}

        <ButtonGroup>
          <SubmitButton type="submit">Submit</SubmitButton>
          <AddMoreButton type="button" onClick={handleAddMore}>
            Add more
          </AddMoreButton>
        </ButtonGroup>
      </form>
    </Container>
  );
};

export default Announcement;
