import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import {
  assignSubject,
  getAllClassSections,
  getAllSubjects,
  getAllTeachers,
} from "../api/ClientApi";

const Container = styled.div`
  padding: 0 15px;
  width: 95%;
`;

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

const Ftitle = styled.div`
  font-size: 22px;
  color: #002087;
  margin: 20px 0 10px;
  font-family: "Poppins";
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 30px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  flex: 1;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
`;

const Button = styled.button`
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  background-color: ${(props) => props.color || "#002087"};
  margin-top: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`;

const AddSubject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    teacher: "",
    subject: "",
  });

  const [classSections, setClassSections] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const { class: className, section, teacher, subject } = formData;

    if (!className || !section || !teacher || !subject) {
      alert("Please fill in all fields before saving.");
      return;
    }

    const newEntry = {
      class_name: className,
      section,
      subject,
      teacher,
    };

    setPendingAssignments((prev) => [...prev, newEntry]);

    // Clear form for next entry
    setFormData({
      class: "",
      section: "",
      teacher: "",
      subject: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let user;
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        user = JSON.parse(userData);
      } else {
        alert("User not found. Please login again.");
        return;
      }
    } catch (err) {
      console.error("Error accessing user from localStorage:", err);
      alert("An error occurred. Please try again.");
      return;
    }

    try {
      const grouped = pendingAssignments.reduce((acc, curr) => {
        const key = `${curr.class_name}_${curr.section}_${curr.teacher}`;
        if (!acc[key]) {
          acc[key] = {
            class_name: curr.class_name,
            section: curr.section,
            subjects: [],
            teacher: curr.teacher,
          };
        }
        acc[key].subjects.push(curr.subject);
        return acc;
      }, {});

      const assignmentsToSend = Object.values(grouped);

      for (const entry of assignmentsToSend) {
        await assignSubject(
          entry.teacher,
          [
            {
              class_name: entry.class_name,
              section: entry.section,
              subjects: entry.subjects,
            },
          ],
          user.unique_id
        );
      }

      alert("Subjects assigned successfully!");
      setPendingAssignments([]);
      navigate("/admin-subjects");
    } catch (error) {
      console.error("Error assigning subjects:", error);
      alert("Failed to assign subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        setClassSections(
          Array.from(new Set(data.map((item) => item.className))).map(
            (cls) => ({ className: cls })
          )
        );
        setSelectedClassSection(
          Array.from(new Set(data.map((item) => item.section_name))).map(
            (sec) => ({ section_name: sec })
          )
        );
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };

    fetchClassSections();
  }, []);

  useEffect(() => {
    getAllSubjects()
      .then((data) => {
        const allSubjects = data.subjects?.map((s) => s.subject_name) || [];
        setSubjectList([...new Set(allSubjects)]);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  useEffect(() => {
    getAllTeachers()
      .then((data) => {
        const teacherArray = Array.isArray(data) ? data : data?.teachers || [];
        const allTeachers = teacherArray.map((t) => ({
          emp_id: t.emp_id,
          emp_name: t.emp_name || "Unnamed",
        }));
        setTeacherList(allTeachers);
      })
      .catch((err) => console.error("Error fetching teachers:", err));
  }, []);

  return (
    <Container>
      <Header>
        <Title>Subjects</Title>
        <Wrapper>
          <Icons onClick={() => navigate("/admin-dashboard")}>
            <img src={home} alt="home" />
          </Icons>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <Ftitle>Subject Addition</Ftitle>

      <form onSubmit={handleSubmit}>
        <FormRow>
          <Field>
            <Select
              name="class"
              value={formData.class}
              onChange={handleInputChange}
            >
              <option>Select Class</option>
              {classSections.map((item) => (
                <option key={item.className} value={item.className}>
                  {item.className}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Select
              name="section"
              value={formData.section}
              onChange={handleInputChange}
            >
              <option>Select Section</option>
              {selectedClassSection.map((section) => (
                <option key={section.section_name} value={section.section_name}>
                  {section.section_name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Select
              name="teacher"
              value={formData.teacher}
              onChange={handleInputChange}
            >
              <option value="">Select Teacher</option>
              {teacherList.map((emp, index) => (
                <option key={index} value={emp.emp_id}>
                  {emp.emp_name} ({emp.emp_id})
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
            >
              <option value="">Select Subject</option>
              {subjectList.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </Select>
          </Field>
        </FormRow>

        <ButtonContainer>
          <Button color="#df0043" onClick={handleSave} type="button">
            Save
          </Button>
          <Button color="#df0043" type="submit" disabled={loading}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
          <Button color="#df0043" onClick={() => navigate("/admin-subjects")}>
            View Subjects
          </Button>
        </ButtonContainer>
      </form>
    </Container>
  );
};

export default AddSubject;
