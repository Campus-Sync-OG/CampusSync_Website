import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import {
  getAllClassSections,
  fetchStudents,
  getAllTeachers,
  getStudentsByClassAndSection,
  postNotification,
  getAllUsers,
} from "../api/ClientApi"; // Import from your centralized API file

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
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  margin: 0;
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
    width: 100%;
    height: 100%;
  }
`;

const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #002087;
  margin-bottom: 1.5rem;
  margin-left: 10px;
  width: 300px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  margin-left: 10px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: 0;
  }
`;

const FieldGroup = styled.div`
  flex: 0 0 calc(50% - 1rem); // two columns with spacing

  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    flex: 1 0 100%;
  }
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
  width: 420px;
  max-width: 100%;
  gap: 30px;
  @media (max-width: 768px) {
    width: 320px;
  }
  @media (max-width: 376px) {
    width: 250px;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, auto));
  gap: 1.2rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const BaseButton = styled.button`
  padding: 0.7rem 1.8rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: 0.3s ease;
`;

const SubmitButton = styled(BaseButton)`
  background-color: #e60050;

  &:hover {
    background-color: #cc0045;
  }
`;

const AddMoreButton = styled(BaseButton)`
  background-color: #002087;

  &:hover {
    background-color: #00156a;
  }
`;

const NotificationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notification_type: "",
    role: "",
    user_id: "",
    class_id: "",
    section_id: "",
  });

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [classSections, setClassSections] = useState([]); // For class list
  const [selectedClassSection, setSelectedClassSection] = useState([]); // For section list

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userRole = currentUser?.role;

  // ✅ Separate fetch for class and section lists
  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        const uniqueClasses = Array.from(
          new Set(data.map((item) => item.className))
        ).map((cls) => ({ className: cls }));

        const uniqueSections = Array.from(
          new Set(data.map((item) => item.section_name))
        ).map((sec) => ({ section_name: sec }));

        setClassSections(uniqueClasses);
        setSelectedClassSection(uniqueSections);
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };

    fetchClassSections();
  }, []);

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Filter users based on role/class/section
  useEffect(() => {
    const fetchRelevantUsers = async () => {
      if (formData.role === "student" && selectedClass && selectedSection) {
        try {
          const students = await getStudentsByClassAndSection(
            selectedClass,
            selectedSection
          );
          setFilteredUsers(students || []);
        } catch (error) {
          console.error("Error fetching students:", error);
          setFilteredUsers([]);
        }
      } else if (formData.role === "general") {
        setFilteredUsers(users);
      } else if (formData.role) {
        const roleUsers = users.filter((u) => u.role === formData.role);
        setFilteredUsers(roleUsers);
      } else {
        setFilteredUsers([]);
      }
    };

    fetchRelevantUsers();
  }, [formData.role, selectedClass, selectedSection, users]);

  // ✅ Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      roles: formData.role === "general" ? ["general"] : [formData.role],
      user_id: formData.role === "general" ? null : formData.user_id || null,
    };

    try {
      await postNotification(payload, userRole);
      alert("Notification sent successfully!");
      handleAddMore(e);
    } catch (error) {
      console.error("Submission Error:", error);
      alert(
        `Failed to send notification: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleAddMore = (e) => {
    e.preventDefault();
    setFormData({
      title: "",
      message: "",
      notification_type: "",
      role: "",
      user_id: "",
      class_id: "",
      section_id: "",
    });
    setSelectedClass("");
    setSelectedSection("");
    setFilteredUsers([]);
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
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label>Notification Type *</Label>
          <Select
            name="notification_type"
            value={formData.notification_type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="General Announcement">General Announcement</option>
            <option value="Event Announcement">Event Announcement</option>
            <option value="Fee Update">Fee Update</option>
            <option value="Academic Results">Academic Results</option>
            <option value="Leave Update">Leave Update</option>
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label>Role *</Label>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
            <option value="general">General (All)</option>
          </Select>
        </FieldGroup>

        {formData.role === "student" && (
          <>
            <FieldGroup>
              <Label>Class *</Label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classSections.map((cls, index) => (
                  <option key={index} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </Select>
            </FieldGroup>

            <FieldGroup>
              <Label>Section *</Label>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {selectedClassSection.map((sec, index) => (
                  <option key={index} value={sec.section_name}>
                    {sec.section_name}
                  </option>
                ))}
              </Select>
            </FieldGroup>
          </>
        )}

        {formData.role && formData.role !== "general" && (
          <FieldGroup>
            <Label>Select User</Label>
            <Select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
            >
              <option value="all">All Users</option>
              {filteredUsers.map((user) => (
                <option
                  key={user.unique_id || user.id}
                  value={user.unique_id || user.id}
                >
                  {user.name} ({user.unique_id || user.id})
                </option>
              ))}
            </Select>
          </FieldGroup>
        )}
        <FieldGroup>
          <Label>Title *</Label>
          <Input
            name="title"
            type="text"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Message *</Label>
          <Input
            name="message"
            as="textarea"
            rows={4}
            placeholder="Enter message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </FieldGroup>

        <ButtonRow>
          <SubmitButton type="submit">Submit</SubmitButton>
          <AddMoreButton onClick={handleAddMore}>Add More</AddMoreButton>
        </ButtonRow>
      </Form>
    </Container>
  );
};

export default NotificationForm;
