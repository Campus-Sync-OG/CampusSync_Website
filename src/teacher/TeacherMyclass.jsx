import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import {
  getStudentsByClassAndSection,
  getAllClassSections,
} from "../api/ClientApi"; // adjust path if needed

// Styled Components for the page
const StudentListContainer = styled.div`
  padding: 0 15px;
  @media (max-width: 426px) {
    padding: 0;
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 8px 20px;
  border-radius: 8px;
  color: white;
`;

const NavIconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavTitle = styled.h1`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
  @media (max-width: 426px) {
    font-size: 14px;
  }
`;

const NavIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const IconDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: white;
`;

const HeadingRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;

  h2 {
    font-size: 20px;
    font-family: "Poppins", sans-serif;
    color: #002087;
    margin-bottom: 10px;
    flex: 1 1 100%;
  }

  input,
  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    min-width: 180px;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 16px;
    }
  }
`;

const TableWrapper = styled.div`
  overflow: hidden;
`;

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 10px;
  font-family: "Poppins", sans-serif;

  thead {
    background-color: #002087;
    color: white;
  }

  th,
  td {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    vertical-align: middle;
  }

  td img {
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
  }

  .action-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
    cursor: pointer;
  }

  .action-icons svg {
    color: grey;
    transition: 0.3s;
  }

  .action-icons svg:hover {
    color: #d9534f;
  }

  @media (max-width: 426px) {
    td,
    th {
      font-size: 12px;
    }
  }
`;

const TeacherMyclass = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [classSections, setClassSections] = useState([]);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections(); // Should return [{ className: 'X', section_name: 'A' }, ...]
        setClassSections(data);
      } catch (err) {
        console.error("Failed to fetch class sections", err);
      }
    };

    fetchClassSections();
  }, []);

  useEffect(() => {
    const fetchFilteredStudents = async () => {
      try {
        if (searchClass && searchSection) {
          const data = await getStudentsByClassAndSection(
            searchClass,
            searchSection
          );
          setStudents(data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchFilteredStudents();
  }, [searchClass, searchSection]);

  const filteredStudents = students.filter((student) => {
    const matchesNameOrRoll =
      student.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll_no?.toString().includes(searchQuery);
    return matchesNameOrRoll;
  });

  const uniqueClasses = [...new Set(classSections.map((cs) => cs.className))];
  const filteredSections = [
    ...new Set(
      classSections
        .filter((cs) => cs.className === searchClass)
        .map((cs) => cs.section_name)
    ),
  ];

  const handleEdit = (id) => console.log("Edit student:", id);
  const handleDelete = (id) => console.log("Delete student:", id);

  return (
    <StudentListContainer>
      {/* Header */}
      <NavigationContainer>
        <NavTitle>Student Database</NavTitle>
        <NavIconsContainer>
          <NavIcon
            src={home}
            alt="Home"
            onClick={() => navigate("/teacher-dashboard")} // Use navigate to go to the home page
          />
          <IconDivider />
          <NavIcon
            src={back}
            alt="Back"
            onClick={() => navigate(-1)} // Use navigate(-1) to go back to the previous page
          />
        </NavIconsContainer>
      </NavigationContainer>

      {/* Filters */}
      <HeadingRow>
        <h2>All Students List</h2>
        <input
          type="text"
          placeholder="Search by Name or Roll Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={searchClass}
          onChange={(e) => {
            setSearchClass(e.target.value);
            setSearchSection(""); // reset section when class changes
          }}
        >
          <option value="">All Classes</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={searchSection}
          onChange={(e) => setSearchSection(e.target.value)}
        >
          <option value="">All Sections</option>
          {filteredSections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </HeadingRow>

      {/* Table */}
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>No</th>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Section</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={student.images}
                      alt="Profile"
                      width="30"
                      height="30"
                    />
                    {student.student_name}
                  </td>
                  <td>{student.roll_no}</td>
                  <td>{student.class}</td>
                  <td>{student.section}</td>
                  <td>{student.phone_no}</td>
                  <td className="action-icons">
                    <FaEdit onClick={() => handleEdit(student.id)} />
                    <FaTrash onClick={() => handleDelete(student.id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </StudentListContainer>
  );
};

export default TeacherMyclass;
