import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { createForm, getForms,deleteForms } from "../api/ClientApi";

// ==== Header Styles (unchanged) ====
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 1px 20px;
  border-radius: 10px;
  color: white;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
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

const FormBox = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  background-color: #f9f9f9;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #999;
  font-size: 14px;
`;

const UploadButton = styled.button`
  padding: 8px 16px;
  background-color: #002087;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
 
  &:hover {
    background-color: #001a70;
  }
`;

const StatusText = styled.p`
  margin-top: 10px;
  font-weight: bold;
  color: ${(props) => (props.status === "Live" ? "green" : "grey")};
`;
const Note = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #888;
`;

const FormTable = styled.table`
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
`;

FormTable.Thead = styled.thead`
  background-color: #002087;
  color: white;
`;

FormTable.Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f7f7f7;
  }
`;

FormTable.Th = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
`;

FormTable.Td = styled.td`
  padding: 12px;
  color: #333;
  border-bottom: 1px solid #ddd;

  a {
    color: #002087;
    text-decoration: underline;

    &:hover {
      color: #001a70;
    }
  }
`;



const TeacherForm = () => {
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState({
    title: "",
    link: "",
    startDate: "",
    endDate: "",
  });

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const[allForms,setAllForms]=useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });

    const updatedStart = name === "startDate" ? value : formDetails.startDate;
    const updatedEnd = name === "endDate" ? value : formDetails.endDate;

    if (updatedStart && updatedEnd) {
      const now = new Date();
      const start = new Date(updatedStart);
      const end = new Date(updatedEnd);

      if (start <= now && end >= now) {
        setStatus("Live");
      } else {
        setStatus("Closed");
      }
    }
  };

  const handleUpload = async () => {
    const { title, link, startDate, endDate } = formDetails;

    if (!title || !link || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const calculatedStatus = start <= now && end >= now ? "Live" : "Closed";

    try {
      await createForm({ title, link, startDate, endDate, status: calculatedStatus });
      setMessage("Form link uploaded successfully.");
      setFormDetails({ title: "", link: "", startDate: "", endDate: "" });
      setStatus(null);
    } catch (err) {
      console.error(err);
      alert("Error uploading form link");
    }
  };

  const loadAllForms = async () => {
    try {
      const response = await getForms();
      const forms = Array.isArray(response.forms) ? response.forms.reverse() : [];
      setAllForms(forms);
    } catch (err) {
      console.error("Error loading forms:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await deleteForms(id);
        loadAllForms();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete form");
      }
    }
  };

  const truncateLink = (link) => {
    try {
      const url = new URL(link);
      return url.hostname + url.pathname.slice(0, 20) + "...";
    } catch {
      return link.slice(0, 25) + "...";
    }
  };

  useEffect(() => {
    loadAllForms();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Upload Teacher Form</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
            <Icons><img src={home} alt="home" /></Icons>
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <FormBox>
        <Label>Form Title</Label>
        <Input type="text" name="title" value={formDetails.title} onChange={handleChange} placeholder="Enter form title" />
        <Label>Form Link</Label>
        <Input type="text" name="link" value={formDetails.link} onChange={handleChange} placeholder="Paste Google Form or doc link" />
        <Label>Start Date</Label>
        <Input type="date" name="startDate" value={formDetails.startDate} onChange={handleChange} />
        <Label>End Date</Label>
        <Input type="date" name="endDate" value={formDetails.endDate} onChange={handleChange} />
        <UploadButton onClick={handleUpload}>Upload Form</UploadButton>
        {status && <StatusText status={status}>Status: {status}</StatusText>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </FormBox>

      {/* Display all uploaded forms */}
      {allForms.length > 0 && (
        <FormTable>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Title</th>
              <th>Link</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allForms.map((form, index) => (
              <tr key={form.id || index}>
                <td>{index + 1}</td>
                <td>{form.title}</td>
                <td>
                  <a href={form.link} target="_blank" rel="noopener noreferrer">
                    {truncateLink(form.link)}
                  </a>
                </td>
                <td>{form.start_date}</td>
                <td>{form.end_date}</td>
                <td><StatusText status={form.status}>{form.status}</StatusText></td>
                <td>
                  <button
                    onClick={() => handleDelete(form.id)}
                    style={{
                      background: "#df0043",
                      color: "#fff",
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </FormTable>
      )}
    </Container>
  );
};

export default TeacherForm;
