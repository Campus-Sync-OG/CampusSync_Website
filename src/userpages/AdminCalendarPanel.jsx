import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getEvent, createEvent, deleteEvent } from "../api/ClientApi";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { Link,useNavigate } from "react-router-dom";

// Styled Components (same as before + refresh button)
const Container = styled.div`
  padding: 0 30px;
`;

const Heading = styled.h2`
  text-align: center;
  color: #002087;
`;

const Form = styled.form`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
`;

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #002087;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #df0043;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Thead = styled.thead`
  background-color: #002087;
  color: white;
`;

const Th = styled.th`
  padding: 8px;
`;

const Td = styled.td`
  padding: 8px;
`;

const Tr = styled.tr`
  background-color: #f5f5f5;
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-style: italic;
  color: #888;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 10px 20px;
  color: white;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  width: 96%;
`;


const Title = styled.h2`
  font-size: 25px;
  font-weight: 600;
  margin: 0;
  font-family: "Poppins";
`;
const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Icon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 2px;
  height: 25px;
  background-color: white;
`;

const AdminCalendarPanel = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    start: "",
    end: "",
    tag: "Other",
    visibleTo: [],
    color: "",
    description: ""
  });

  const tagOptions = ["Holiday", "Exam", "Meeting", "Function", "Other"];
  const roleOptions = ["Teacher", "Student", "Principal"];

  const loadEvents = async () => {
    try {
      const data = await getEvent();
      setEvents(data);
    } catch (err) {
      console.error("Error loading events", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVisibleToChange = (e) => {
    const options = Array.from(e.target.selectedOptions, o => o.value);
    setForm(prev => ({ ...prev, visibleTo: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(form);
      await loadEvents();
      alert("Event added successfully!");
      setForm({
        title: "",
        start: "",
        end: "",
        tag: "Other",
        visibleTo: [],
        color: "",
        description: ""
      });
    } catch (err) {
      console.error("Error adding event", err);
      alert("Failed to add event.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        await loadEvents();
        alert("Event deleted successfully");
      } catch (err) {
        console.error("Error deleting event", err);
        alert("Failed to delete event");
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Admin Calendar of Events</Title>
        <IconGroup>
          <Link to="/admin-dashboard"><Icon src={home} alt="home" /></Link>
          <Divider />
          <Icon src={back} alt="back" onClick={() => navigate(-1)} />
        </IconGroup>
      </Header>
      <Heading></Heading>

      <Form onSubmit={handleSubmit}>
        <h3>Add New Event</h3>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <Input
          name="start"
          type="date"
          value={form.start}
          onChange={handleChange}
          required
        />
        <Input
          name="end"
          type="date"
          value={form.end}
          onChange={handleChange}
          required
        />
        <Select name="tag" value={form.tag} onChange={handleChange}>
          {tagOptions.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </Select>
        <Select multiple value={form.visibleTo} onChange={handleVisibleToChange}>
          {roleOptions.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </Select>
        <Input
          name="color"
          value={form.color}
          onChange={handleChange}
          placeholder="Hex Color (optional)"
        />
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
        ></Textarea>
        <Button type="submit">Add Event</Button>
        <Button type="button" onClick={loadEvents}>Refresh Events</Button>
      </Form>

      <h3>All Events</h3>
      {events.length === 0 ? (
        <EmptyMessage>No events available.</EmptyMessage>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Title</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Tag</Th>
              <Th>Visible To</Th>
              <Th>Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {events.map(ev => (
              <Tr key={ev.id}>
                <Td>{ev.title}</Td>
                <Td>{new Date(ev.start).toLocaleDateString()}</Td>
                <Td>{new Date(ev.end).toLocaleDateString()}</Td>
                <Td>{ev.tag}</Td>
                <Td>{ev.visibleTo ? ev.visibleTo.join(", ") : "All"}</Td>
                <Td>
                  <DeleteButton onClick={() => handleDelete(ev.id)}>Delete</DeleteButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminCalendarPanel;
