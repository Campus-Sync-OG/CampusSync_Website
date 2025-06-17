import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllClassSections, getStudentsByClassAndSection, promoteStudentsAPI } from "../api/ClientApi";

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
        const students = await getStudentsByClassAndSection(fromClass, fromSection);
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
      <h2>Promote Students</h2>

      <FormGroup>
        <label>From Class:</label>
        <select value={fromClass} onChange={(e) => {
          setFromClass(e.target.value);
          setFromSection(""); // reset section
        }}>
          <option value="">Select</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <label>Section:</label>
        <select value={fromSection} onChange={(e) => setFromSection(e.target.value)}>
          <option value="">Select</option>
          {getSectionsForClass(fromClass).map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
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
            <select value={toClass} onChange={(e) => {
              setToClass(e.target.value);
              setToSection(""); // reset section
            }}>
              <option value="">Select</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>

            <label>Section:</label>
            <select value={toSection} onChange={(e) => setToSection(e.target.value)}>
              <option value="">Select</option>
              {getSectionsForClass(toClass).map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
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
  max-width: 900px;
  margin: auto;
  padding: 1rem;
`;

const FormGroup = styled.div`
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  label {
    margin-right: 5px;
  }
  select, button {
    padding: 5px 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  th, td {
    border: 1px solid #ccc;
    padding: 0.5rem;
  }
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.red ? "red" : "white")};
  cursor: pointer;
`;

const Success = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
`;
