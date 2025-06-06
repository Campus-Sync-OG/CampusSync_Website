import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getStudentsByClassAndSection,
  bulkUpdateAttendance,
} from "../api/ClientApi";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

// Styled Components
const PageContainer = styled.div`
  padding: 0 10px;
  font-family: "Poppins", sans-serif;
  max-height: 90vh;
  overflow-y: auto;
  @media (max-width: 426px) {
    max-height: 400px;
    overflow-y: auto;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #df0043);
  color: white;
  padding: 1px 10px;
  border-radius: 10px;
  font-family: "Poppins";
`;

const HeaderTitle = styled.h2`
  font-size: 26px;
  font-family: "Poppins";
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ImageIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin: 0 10px;
`;

const Divider = styled.div`
  height: 30px;
  width: 1px;
  background-color: white;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 100px;
  margin-top: 50px;
  @media (max-width: 1024px) {
    gap: 40px;
  }
  @media (max-width: 426px) {
    gap: 10px;
    flex-direction: column;
    margin-top: 10px;
  }
`;

const SearchInput = styled.input`
  width: 30%;
  max-width: 250px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  @media (max-width: 426px) {
    width: 95%;
    max-width: 100%;
  }
`;

const SelectDropdownClass = styled.select`
  width: 30%;
  max-width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  @media (max-width: 426px) {
    width: 100%;
    max-width: 100%;
  }
`;

const SelectDropdownSec = styled.select`
  width: 20%;
  max-width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  @media (max-width: 426px) {
    width: 100%;
    max-width: 100%;
  }
`;

const SearchButton = styled.button`
  background-color: #df0043;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 250px;
  @media (max-width: 426px) {
    justify-content: flex-end;
  }
`;

const TableWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  overflow-x: auto;
`;

const TableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  @media (max-width: 426px) {
    max-height: 200px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-radius: 20px;
`;

const TheadWrapper = styled.thead`
  box-shadow: 0 8px 10px rgba(34, 22, 200, 0.1);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #002087;
  color: white;
  font-family: Poppins;
  font-weight: 100;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const Td = styled.td`
  font-family: Poppins;
  padding: 10px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  text-align: center;
`;

const SubmitButton = styled.button`
  background-color: #df0043;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
  float: right;
  width: 200px;
  @media (max-width: 1024px) {
    width: 180px;
  }
  @media (max-width: 426px) {
    width: 140px;
  }
`;

const AttendancePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendance, setAttendance] = useState({});

  const studentsPerPage = 5;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleSearch = async () => {
    if (!selectedClass || !selectedSection) {
      alert("Please select class and section");
      return;
    }
    const students = await getStudentsByClassAndSection(
      selectedClass,
      selectedSection
    );
    setFilteredStudents(students);

    const initialAttendance = students.reduce((acc, student) => {
      acc[student.admission_no] = true; // default to present
      return acc;
    }, {});
    setAttendance(initialAttendance);
  };

  const handleCheckboxChange = (admission_no) => {
    setAttendance((prev) => ({
      ...prev,
      [admission_no]: !prev[admission_no],
    }));
  };

  const handleSubmitAttendance = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const emp_id = loggedInUser?.unique_id;
    const date = new Date().toISOString().split("T")[0];

    const records = filteredStudents.map((student) => ({
      admission_no: student.admission_no,
      status: attendance[student.admission_no] ? "Present" : "Absent",
    }));

    try {
      await bulkUpdateAttendance({ records, emp_id, date });
      alert("Attendance submitted successfully!");
    } catch (error) {
      alert("Failed to submit attendance.");
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>Attendance Report</HeaderTitle>
        <IconsContainer>
          <ImageIcon
            src={homeIcon}
            alt="Home"
            onClick={() => navigate("/teacher-dashboard")}
          />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by name."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SelectDropdownClass
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          <option value="10">X</option>
          <option value="9">IX</option>
          <option value="8">VIII</option>
          <option value="7">VII</option>
          <option value="6">VI</option>
          <option value="5">V</option>
          <option value="4">IV</option>
          <option value="3">III</option>
          <option value="2">II</option>
          <option value="1">I</option>
        </SelectDropdownClass>
        <SelectDropdownSec
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </SelectDropdownSec>
        <SearchButton onClick={handleSearch}>SEARCH</SearchButton>
      </SearchContainer>

      <TableWrapper>
        <TableContainer>
          <Table>
            <TheadWrapper>
              <tr>
                <Th style={{ width: "50px" }}>Sl No</Th>
                <Th style={{ width: "150px" }}>Student Name</Th>
                <Th style={{ width: "100px" }}>Class</Th>
                <Th style={{ width: "100px" }}>Section</Th>
                <Th style={{ width: "120px" }}>Roll Number</Th>
                <Th style={{ width: "150px" }}>Attendance</Th>
              </tr>
            </TheadWrapper>

            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={student.admission_no}
                  style={{
                    backgroundColor: attendance[student.admission_no]
                      ? "transparent"
                      : "#FF0000",
                    transition: "background-color 0.5s ease",
                  }}
                >
                  <Td>{indexOfFirstStudent + index + 1}</Td>
                  <Td>{student.student_name}</Td>
                  <Td>{student.class}</Td>
                  <Td>{student.section}</Td>
                  <Td>{student.admission_no}</Td>
                  <Td>
                    <input
                      type="checkbox"
                      checked={attendance[student.admission_no] || false}
                      onChange={() =>
                        handleCheckboxChange(student.admission_no)
                      }
                      style={{
                        accentColor: attendance[student.admission_no]
                          ? "green"
                          : "red",
                        width: "18px",
                        height: "18px",
                      }}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </TableWrapper>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            padding: "8px 12px",
            marginRight: "10px",
            backgroundColor: "#002087",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          &lt;
        </button>
        <span style={{ alignSelf: "center", fontSize: "16px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 12px",
            marginLeft: "10px",
            backgroundColor: "#002087",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          &gt;
        </button>
      </div>

      <SubmitButton onClick={handleSubmitAttendance}>SUBMIT</SubmitButton>
    </PageContainer>
  );
};

export default AttendancePage;
