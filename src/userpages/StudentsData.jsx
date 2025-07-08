import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentsByClassAndSection, getAllClassSections } from "../api/ClientApi";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const Container = styled.div`
  padding: 0 15px;
  font-family: "Poppins", sans-serif;
  background: #f9f9f9;
  flex-direction: column;
  height: 70vh;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 1px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 25px;
  font-weight: 600;
  font-family: "Poppins";
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ImageIcon = styled.img`
  width: 25px;
  height: 25px;
  margin: 0 8px;
  cursor: pointer;
`;

const VerticalDivider = styled.div`
  height: 25px;
  width: 2px;
  background-color: white;
`;

const SectionTitle = styled.h3`
  margin: 20px 0 10px;
  font-weight: bold;
  color: #002087;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 200px;
`;

const SelectBox = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 200px;
`;

const SearchButton = styled.button`
  background: #d9534f;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
  }

  th {
    background: #f5f5f5;
    color: #d6004c;
    font-weight: bold;
  }

  tr:hover {
    background: #f1f1f1;
  }
`;

const Pagination = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
  color: gray;

  span {
    cursor: pointer;
    font-size: 50px;
    color: #002087;
  }
`;

const Page = styled.div`
  padding: 6px 12px;
  border: 1px solid #d9534f;
  background-color: ${({ active }) => (active ? "#d9534f" : "white")};
  color: ${({ active }) => (active ? "white" : "#d9534f")};
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const StudentData = () => {
  const navigate = useNavigate();

  const [classSections, setClassSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchClassSections();
  }, []);

  const fetchClassSections = async () => {
    try {
      const data = await getAllClassSections();
      console.log("Class Sections:", data); // Debug API response
      setClassSections(data || []);
    } catch (error) {
      console.error("Error fetching class-section:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getStudentsByClassAndSection(selectedClass, selectedSection);
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
    }
  };

  const handleSearch = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    fetchStudents();
  };

  useEffect(() => {
    const filtered = students.filter((student) =>
      (student.student_name || "").toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [students, searchName]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamically extract class and section
  const classOptions = [...new Set(classSections.map((item) => item.className || item.class_grade))];
  const sectionOptions = [...new Set(
    classSections
      .filter(cs => (cs.className || cs.class_grade) === selectedClass)
      .map((item) => item.section_name || item.section)
  )];

  return (
    <Container>
      <Header>
        <Title>Student Information</Title>
        <IconsContainer>
          <ImageIcon src={homeIcon} alt="Home" onClick={() => navigate("/admin-dashboard")} />
          <VerticalDivider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </Header>

      <SectionTitle>All Students Data</SectionTitle>

      <SearchRow>
        <SearchInput
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <SelectBox value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </SelectBox>
        <SelectBox value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
          <option value="">Select Section</option>
          {sectionOptions.map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </SelectBox>
        <SearchButton onClick={handleSearch}>SEARCH</SearchButton>
      </SearchRow>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Class</th>
              <th>Section</th>
              <th>Date of Birth</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((student, idx) => (
              <tr key={student.id || idx}>
                <td>{student.roll_no}</td>
                <td>{student.student_name}</td>
                <td>{student.gender}</td>
                <td>{student.class || student.class_grade}</td>
                <td>{student.section}</td>
                <td>{student.dob}</td>
                <td>{student.phone_no}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {totalPages > 1 && (
        <Pagination>
          <span onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>&lt;</span>
          {[...Array(totalPages)].map((_, i) => (
            <Page key={i} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Page>
          ))}
          <span onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>&gt;</span>
        </Pagination>
      )}
    </Container>
  );
};

export default StudentData;
