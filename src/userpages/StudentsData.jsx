import React, { useState } from "react";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { useNavigate, Link } from "react-router-dom";

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

const romanClasses = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];
const sections = ["A", "B", "C"];

const StudentData = () => {
  const navigate = useNavigate();

  const studentList = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: "Daniel Grant",
    gender: "Male",
    class: romanClasses[Math.floor(Math.random() * romanClasses.length)],
    section: sections[Math.floor(Math.random() * sections.length)],
    parents: "Kofi Grant",
    address: "59 Australia, Sydney",
    dob: "02/05/2001",
    phone: "+123 9988568",
  }));

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const totalPages = Math.ceil(studentList.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredData = studentList.filter(
    (student) =>
      student.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (selectedClass === "" || student.class === selectedClass)
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <Header>
        <Title>Student Information</Title>
        <IconsContainer>
          <ImageIcon
            src={homeIcon}
            alt="Home"
            onClick={() => navigate("/admin-dashboard")}
          />
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
        <SelectBox
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {romanClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </SelectBox>
        <SearchButton>SEARCH</SearchButton>
      </SearchRow>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Class</th>
              <th>Section</th>
              <th>Parents</th>
              <th>Address</th>
              <th>Date of Birth</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.gender}</td>
                <td>{student.class}</td>
                <td>{student.section}</td>
                <td>{student.parents}</td>
                <td>{student.address}</td>
                <td>{student.dob}</td>
                <td>{student.phone}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {totalPages > 1 && (
        <Pagination>
          <span onClick={() => handlePageChange(currentPage - 1)}>&lt;</span>
          {[...Array(totalPages)].map((_, i) => (
            <Page
              key={i}
              active={currentPage === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Page>
          ))}
          <span onClick={() => handlePageChange(currentPage + 1)}>&gt;</span>
        </Pagination>
      )}
    </Container>
  );
};

export default StudentData;
