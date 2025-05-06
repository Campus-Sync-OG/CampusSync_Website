import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import styled from "styled-components";

// Sample student data
const StudentData = [
  { id: 1, name: "Pranav", rollNum: "522bbc009", class: "12 - A", contact: "82486 69086", profile: "https://i.pravatar.cc/40" },
  { id: 2, name: "Vijay", rollNum: "522bbc010", class: "12 - B", contact: "82486 69087", profile: "https://i.pravatar.cc/41" },
  { id: 3, name: "Abbey", rollNum: "522bbc011", class: "12 - C", contact: "82486 69088", profile: "https://i.pravatar.cc/42" },
  { id: 4, name: "Shilpa", rollNum: "522bbc012", class: "12 - D", contact: "82486 69089", profile: "https://i.pravatar.cc/43" },
  { id: 5, name: "Pranav", rollNum: "522bbc009", class: "12 - A", contact: "82486 69086", profile: "https://i.pravatar.cc/40" },
  { id: 6, name: "Vijay", rollNum: "522bbc010", class: "12 - B", contact: "82486 69087", profile: "https://i.pravatar.cc/41" },
  { id: 7, name: "Abbey", rollNum: "522bbc011", class: "12 - C", contact: "82486 69088", profile: "https://i.pravatar.cc/42" },
  { id: 8, name: "Shilpa", rollNum: "522bbc012", class: "12 - D", contact: "82486 69089", profile: "https://i.pravatar.cc/43" },
];

// Styled Components for Layout
const StudentListContainer = styled.div`
  padding: 20px;
   @media (max-width: 426px) {
  padding:0;
}
`;
const TableWrapper = styled.div`
  
 
  overflow: hidden;
`;

const TableContainer = styled.div`
  max-height: 400px; /* Adjust height as needed */
  overflow-y: auto; /* Enables vertical scrolling only for tbody */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 10px; /* Ensures rounded corners */
 text-align: left;

  thead {
    background-color: #002087;
    color: white;
  }

  th,
  td {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    font-family: "Poppins", sans-serif;
  }
    td{
    padding:15px;
    text-align: center;
    }

  tbody {
    max-height: 400px; /* Adjustable height */
    overflow-y: auto;
    width: 100%;
    
  }

  
  tr {
    
    width: 100%;
    
  }

  td img {
    border-radius: 50%;
    margin-right: 10px;
  }

  .action-icons {
    display: flex;
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

const SearchInput = styled.input`
  width: 50%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

// Navigation Components
const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
`;

const NavIconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  font-family:Poppins;
   @media (max-width: 426px) {
  
  font-size:14px;
  
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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  h2{
  font-size:20px;
  font-family:Poppins;
  }
  @media (max-width: 768px) {
  h2{
  font-size:14px;
  }
  @media (max-width: 425px) {
  h2{
  font-size:14px;
  }
}
`;

const StudentList = () => {
    const [students, setStudents] = useState(StudentData);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter students by name or roll number
  const filteredStudents = students
    ? students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNum.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleEdit = (id) => console.log("Edit student:", id);
  const handleDelete = (id) => console.log("Delete student:", id);

  return (
    <StudentListContainer>
      {/* Navigation Container */}
      <NavigationContainer>
        <NavTitle>Student Database</NavTitle>
        <NavIconsContainer>
          <NavIcon
            src="../assets/images/home.png"
            alt="Home"
            onClick={() => console.log("Home Clicked")}
          />
          <IconDivider />
          <NavIcon
            src="../assets/images/back.png"
            alt="Back"
            onClick={() => console.log("Back Clicked")}
          />
        </NavIconsContainer>
      </NavigationContainer>

      <HeaderContainer>
        <h2>All Students List</h2>
        <SearchInput
          type="text"
          placeholder="Search by Name or Roll Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </HeaderContainer>
      <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>No</th>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>
      </Table>
        <TableContainer>
          <Table>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No students found.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td style={{  alignItems: "center", gap: "10px" }}>
                  <img
                    src={student.profile}
                    alt="Profile"
                    width="30"
                    height="30"
                    style={{ borderRadius: "50%" }}
                  />
                  {student.name}
                </td>
                <td>{student.rollNum}</td>
                <td>{student.class}</td>
                <td>{student.contact}</td>
                <td className="action-icons">
                  <FaEdit onClick={() => handleEdit(student.id)} />
                  <FaTrash onClick={() => handleDelete(student.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      </TableContainer>
      </TableWrapper>
    </StudentListContainer>
  );
};

// Directly render StudentList with studentData
export default StudentList;
