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

const ToggleButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => (props.active ? "#002087" : "#ccc")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 100px;
  margin-top: 20px;
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
`;

const AttendancePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendance, setAttendance] = useState({});
  const [viewMode, setViewMode] = useState("day-wise");

  const subjects = ["Math", "Science", "English", "Kannada", "Social"];

  const studentsPerPage = 5;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleSearch = async () => {
    if (!selectedClass || !selectedSection) {
      alert("Please select class and section");
      return;
    }
    if (viewMode === "period-wise" && !selectedSubject) {
      alert("Please select a subject for period-wise attendance");
      return;
    }

    setStudents([]);
    setFilteredStudents([]);
    setAttendance({});
    setCurrentPage(1);

    try {
      const fetchedStudents = await getStudentsByClassAndSection(selectedClass, selectedSection);

      if (!fetchedStudents || fetchedStudents.length === 0) return;

      const initialAttendance = fetchedStudents.reduce((acc, student) => {
        acc[student.admission_no] = true;
        return acc;
      }, {});

      setStudents(fetchedStudents);
      setFilteredStudents(fetchedStudents);
      setAttendance(initialAttendance);
      setSearchQuery("");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students. Please try again.");
    }
  };

  const handleSubmitAttendance = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const emp_id = loggedInUser?.unique_id;
    const date = new Date().toISOString().split("T")[0];

    const records = filteredStudents.map((student) => ({
      admission_no: student.admission_no,
      student_name: student.student_name,
      status: attendance[student.admission_no] ? "Present" : "Absent",
      class: selectedClass,
      section: selectedSection,
      date,
      emp_id,
      attendance_type:"day-wise"  ,
    }));
    console.log("Attendance Records:", records);

    try {
      await bulkUpdateAttendance(emp_id, { records }, "day-wise");

      alert("Attendance submitted successfully!");
    } catch (error) {
      console.error("Failed to submit attendance:", error);
      alert("Failed to submit attendance.");
    }
  };

  const handleToggleView = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchQuery, students]);

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>Attendance Report</HeaderTitle>
        <IconsContainer>
          <ImageIcon src={homeIcon} alt="Home" onClick={() => navigate("/teacher-dashboard")} />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </Header>

      <ToggleButtonContainer>
        <ToggleButton active={viewMode === "day-wise"} onClick={() => handleToggleView("day-wise")}>Day-wise</ToggleButton>
        <ToggleButton active={viewMode === "period-wise"} onClick={() => handleToggleView("period-wise")}>Period-wise</ToggleButton>
      </ToggleButtonContainer>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SelectDropdownClass value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"].map((cls, i) => (
            <option key={cls} value={i + 1}>{cls}</option>
          ))}
        </SelectDropdownClass>
        <SelectDropdownSec value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
          <option value="">Select Section</option>
          {["A", "B", "C"].map(sec => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </SelectDropdownSec>
        {viewMode === "period-wise" && (
          <SelectDropdownClass value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </SelectDropdownClass>
        )}
        <SearchButton onClick={handleSearch}>SEARCH</SearchButton>
      </SearchContainer>

      {/* Render Table */}
      {filteredStudents.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px", fontSize: "18px", color: "#666" }}>
          No data found for the selected class and section.
        </div>
      ) : (
        <>
          <TableWrapper>
            <TableContainer>
              <Table>
                <TheadWrapper>
                  <tr>
                    <Th>Sl No</Th>
                    <Th>Student Name</Th>
                    <Th>Class</Th>
                    <Th>Section</Th>
                    <Th>Roll Number</Th>
                    <Th>Attendance</Th>
                  </tr>
                </TheadWrapper>
                <tbody>
                  {currentStudents.map((student, index) => (
                    <tr
                      key={student.admission_no}
                      style={{ backgroundColor: attendance[student.admission_no] ? "transparent" : "#FF0000" }}
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
                          onChange={() => setAttendance((prev) => ({ ...prev, [student.admission_no]: !prev[student.admission_no] }))}
                          style={{ accentColor: attendance[student.admission_no] ? "green" : "red", width: "18px", height: "18px" }}
                        />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </TableWrapper>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ padding: "8px 12px", marginRight: "10px", backgroundColor: "#002087", color: "white", border: "none", borderRadius: "5px" }}
            >
              &lt;
            </button>
            <span style={{ alignSelf: "center", fontSize: "16px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ padding: "8px 12px", marginLeft: "10px", backgroundColor: "#002087", color: "white", border: "none", borderRadius: "5px" }}
            >
              &gt;
            </button>
          </div>

          <SubmitButton onClick={handleSubmitAttendance}>SUBMIT</SubmitButton>
        </>
      )}
    </PageContainer>
  );
};

export default AttendancePage;

