import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAllClassSections,
  getStudentsByClassAndSection,
  promoteStudentsAPI,
} from "../api/ClientApi";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { Link } from "react-router-dom";

const Promotion = () => {
  const [classSections, setClassSections] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [fromClass, setFromClass] = useState("");
  const [fromSection, setFromSection] = useState("");
  const [toClass, setToClass] = useState("");
  const [toSection, setToSection] = useState("");

  const [students, setStudents] = useState([]);
  const [excludedIds, setExcludedIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch class and section options
  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        setClassSections(data);
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };
    fetchClassSections();
  }, []);

  // Extract unique classes
  const classOptions = Array.from(
    new Set(classSections.map((item) => item.className))
  );

  // Filter sections based on selected class
  const getSectionsForClass = (className) => {
    return Array.from(
      new Set(
        classSections
          .filter((item) => item.className === className)
          .map((item) => item.section_name)
      )
    );
  };

  const handleLoadStudents = async () => {
    if (fromClass && fromSection) {
      try {
        const students = await getStudentsByClassAndSection(
          fromClass,
          fromSection
        );
        if (students?.length) {
          setStudents(students);
          setExcludedIds([]);
        } else {
          alert("No students found.");
          setStudents([]);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load students.");
      }
    } else {
      alert("Please select From Class and Section");
    }
  };
  const toggleStudent = (admission_no) => {
    setExcludedIds((prev) =>
      prev.includes(admission_no)
        ? prev.filter((id) => id !== admission_no)
        : [...prev, admission_no]
    );
  };

  const handlePromote = async () => {
    if (!toClass || !toSection) {
      alert("Please select To Class and To Section");
      return;
    }

    const promoteList = students
      .filter((s) => !excludedIds.includes(s.admission_no))
      .map((s) => s.admission_no);

    if (promoteList.length === 0) {
      alert("No students selected for promotion.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        from_class: fromClass,
        from_section: fromSection,
        to_class: toClass,
        to_section: toSection,
        academic_year: "2024-2025",
        admission_no: promoteList,
      };

      const res = await promoteStudentsAPI(payload);
      setSuccessMessage(res?.message || "Promotion successful.");
      setStudents([]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to promote students.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Promote Students</Title>
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
      <FormGroup>
        <label>From Class:</label>
        <select
          value={fromClass}
          onChange={(e) => {
            setFromClass(e.target.value);
            setFromSection(""); // reset section
          }}
        >
          <option value="">Select</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <label>Section:</label>
        <select
          value={fromSection}
          onChange={(e) => setFromSection(e.target.value)}
        >
          <option value="">Select</option>
          {getSectionsForClass(fromClass).map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <button onClick={handleLoadStudents}>Load Students</button>
      </FormGroup>

      {students.length > 0 && (
        <>
          <Table>
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Phone</th>
                <th>DOB</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <TableRow
                  key={s.admission_no}
                  onClick={() => toggleStudent(s.admission_no)}
                  red={excludedIds.includes(s.admission_no)}
                >
                  <td>{s.admission_no}</td>
                  <td>{s.student_name}</td>
                  <td>{s.roll_no}</td>
                  <td>{s.phone_no}</td>
                  <td>{s.dob}</td>
                </TableRow>
              ))}
            </tbody>
          </Table>

          <FormGroup>
            <label>To Class:</label>
            <select
              value={toClass}
              onChange={(e) => {
                setToClass(e.target.value);
                setToSection(""); // reset section
              }}
            >
              <option value="">Select</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <label>Section:</label>
            <select
              value={toSection}
              onChange={(e) => setToSection(e.target.value)}
            >
              <option value="">Select</option>
              {getSectionsForClass(toClass).map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            <button onClick={handlePromote} disabled={loading}>
              {loading ? "Promoting..." : "Promote"}
            </button>
          </FormGroup>
        </>
      )}

      {successMessage && <Success>{successMessage}</Success>}
    </Container>
  );
};

export default Promotion;

// Styled Components (unchanged)
const Container = styled.div`
  padding: 0 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
  background: #ffffff;
  padding: 20px;
  margin-bottom: 25px;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  top: 30px;

  label {
    font-weight: 600;
    color: #333;
    margin-right: 5px;
  }

  select {
    padding: 10px 14px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    min-width: 160px;
    background-color: #f1f3f5;
    font-size: 15px;

    &:focus {
      outline: none;
      border-color: #007bff;
      background-color: #fff;
    }
  }

  button {
    padding: 10px 18px;
    background-color: #00166b;
    color: #fff;
    border: none;
    font-size: 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #c9302c;
    }

    &:disabled {
      background-color: #adb5bd;
      cursor: not-allowed;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);

  th,
  td {
    padding: 12px 16px;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
  }

  th {
    background-color: #f8f9fa;
    font-weight: bold;
    color: #495057;
  }

  td {
    font-size: 14px;
    color: #333;
  }
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.red ? "red" : "#ffffff")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.red ? "#f5c6cb" : "#f1f3f5")};
  }
`;

const Success = styled.div`
  margin-top: 20px;
  padding: 14px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.1);
  text-align: center;
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
