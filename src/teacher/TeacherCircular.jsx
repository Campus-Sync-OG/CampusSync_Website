import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { getAllClassSections, uploadCircular, getTeacherCirculars, deleteCircular } from "../api/ClientApi";

const Container = styled.div`
  padding: 0 1.2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 5px 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
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
  width: 30px;
  height: 30px;
  cursor: pointer;
  img {
    width: 30px;
    height: 30px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px 2px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
  width: 100%;
`;

const Select = styled.select`
  padding: 10px 2px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
  width: 100%;
`;

const Option = styled.option``;

const FileInput = styled(Input)`
  padding: 6px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 150px;
  background-color: #f0f0f0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.primary ? "#df0043" : "#002087")};
`;

const Note = styled.p`
  margin-top: 10px;
  color: red;
  font-size: 12px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-family: "Poppins";
  font-size: 18px;
`;

const TeacherCircular = () => {
  const navigate = useNavigate();

  const [forms, setForms] = useState([
    {
      date: "",
      title: "",
      description: "",
      file: null,
      class_name: "",
      section: "",
    },
  ]);

  const [classSections, setClassSections] = useState([]);
  const [uploadedCirculars, setUploadedCirculars] = useState([]); // ✅ New

  // ✅ Load class sections
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllClassSections();
      setClassSections(data);
    };
    fetchData();
  }, []);

  // ✅ Load uploaded circulars on mount
  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const res = await getTeacherCirculars();
        setUploadedCirculars(res.data);
      } catch (err) {
        console.error("Failed to fetch teacher circulars:", err);
      }
    };

    fetchCirculars();
  }, []);


  const handleDeleteCircular = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this circular?");
    if (!confirmDelete) return;

    try {
      await deleteCircular(id);
      alert("Circular deleted successfully!");

      // Refresh the list after deletion
      const res = await getTeacherCirculars();
      setUploadedCirculars(res.data);
    } catch (error) {
      alert("Failed to delete circular");
    }
  };


  const handleChange = (e, index) => {
    const { name, value, files } = e.target;
    const updatedForms = [...forms];
    updatedForms[index][name] = files ? files[0] : value;
    setForms(updatedForms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const form of forms) {
      const { date, title, description, file, class_name, section } = form;
      if (!date || !title || !description || !class_name || !section || !file) {
        alert("Please fill in all required fields in all circulars.");
        return;
      }
    }

    try {
      for (const form of forms) {
        const formData = new FormData();
        formData.append("date", form.date);
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("class_name", form.class_name);
        formData.append("section", form.section);
        formData.append("file", form.file);

        await uploadCircular(formData);
      }

      alert("All circulars uploaded successfully!");
      setForms([
        {
          date: "",
          title: "",
          description: "",
          file: null,
          class_name: "",
          section: "",
        },
      ]);

      // ✅ Refresh circulars after upload
      const res = await getTeacherCirculars();
      setUploadedCirculars(res.data);

    } catch (error) {
      alert("Failed to upload one or more circulars");
      console.error(error);
    }
  };

  const addNewForm = () => {
    setForms([
      ...forms,
      {
        date: "",
        title: "",
        description: "",
        file: null,
        class_name: "",
        section: "",
      },
    ]);
  };

  const deleteLastForm = () => {
    if (forms.length > 1) {
      setForms(forms.slice(0, -1));
    }
  };

  return (
    <Container>
      <Header>
        <Title>Circular</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
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

      <Form onSubmit={handleSubmit}>
        {forms.map((form, index) => (
          <div key={index}>
            <Row>
              <div style={{ flex: 1 }}>
                <Label>Date *</Label>
                <Input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Label>Select Class *</Label>
                <Select
                  name="class_name"
                  value={form.class_name}
                  onChange={(e) => handleChange(e, index)}
                >
                  <Option value="">Select Class</Option>
                  {[...new Set(classSections.map((cs) => cs.className))].map(
                    (cls) => (
                      <Option key={cls} value={cls}>
                        {cls}
                      </Option>
                    )
                  )}
                </Select>
              </div>
              <div style={{ flex: 1 }}>
                <Label>Select Section *</Label>
                <Select
                  name="section"
                  value={form.section}
                  onChange={(e) => handleChange(e, index)}
                >
                  <Option value="">Select Section</Option>
                  {[...new Set(classSections.map((cs) => cs.section_name))].map(
                    (sec) => (
                      <Option key={sec} value={sec}>
                        {sec}
                      </Option>
                    )
                  )}
                </Select>
              </div>
            </Row>

            <div>
              <Label>Notification Title *</Label>
              <Input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) => handleChange(e, index)}
              />
            </div>

            <div>
              <Label>Select Attachment *</Label>
              <FileInput
                type="file"
                name="file"
                onChange={(e) => handleChange(e, index)}
              />
            </div>

            <div>
              <Label>Description *</Label>
              <TextArea
                name="description"
                value={form.description}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          </div>
        ))}

        <ButtonContainer>
          <Button primary type="submit">Submit</Button>
          <Button type="button" onClick={addNewForm}>Add More</Button>
          {forms.length > 1 && (
            <Button type="button" onClick={deleteLastForm}>Delete</Button>
          )}
        </ButtonContainer>

        <Note>
          Note: Only one circular will be created per student in the selected class and section.
        </Note>
      </Form>

      {/* ✅ Uploaded Circulars */}
      {uploadedCirculars.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Uploaded Circulars</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>#</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Title</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Class</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Section</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {uploadedCirculars.map((circ, idx) => (
                <tr key={circ.id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{circ.date}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{circ.headline}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{circ.class_name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{circ.section}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <button
                      onClick={() => handleDeleteCircular(circ.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#df0043",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </Container>
  );
};

export default TeacherCircular;