import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../api/ClientApi';
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
const TeacherInfo = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [teacherList, setTeacherList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers from backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachers = await getAllTeachers();
        setTeacherList(teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teacherList.filter((t) =>
      t.emp_name && t.emp_name.toLowerCase().includes(searchName.toLowerCase())
    );
  }, [teacherList, searchName]);


  if (loading) {
    return <div>Loading teachers...</div>; // Simple loading state
  }

  return (
    <Container>
      {/* Top Navigation */}
      <NavContainer>
        <Title>Teacher information</Title>
        <IconsContainer>
          <ImageIcon
            src={homeIcon}
            alt="Home"
            onClick={() => navigate("/dashboard")}
          />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </NavContainer>

      {/* Section Title */}
      <SectionTitle>All Teachers Data</SectionTitle>

      {/* Search Bar */}
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
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </SelectBox>
        <SearchButton>SEARCH</SearchButton>
      </SearchRow>

      {/* Table */}
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              
              <th>Address</th>
              <th>Joining Date</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher, index) => (
              <tr key={teacher.emp_id}>
                <td>{teacher.emp_id}</td>
                <td>{teacher.emp_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.address}</td>
                <td>{teacher.joining_date ? teacher.joining_date.slice(0, 10) : ''}</td>

                <td>{teacher.phone_no}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {/* Pagination */}
      <Pagination>
        <span>Previous</span>
        <Page active>1</Page>
        <Page>2</Page>
        <Page>3</Page>
        <span>Next</span>
      </Pagination>
    </Container>
  );
};

export default TeacherInfo;

/* Styled Components */
const Container = styled.div`
  padding: 20px;
  font-family: "Poppins", sans-serif;
  background: #f9f9f9;
`;

const NavContainer = styled.div`
  background: linear-gradient(90deg, #002087, #d9534f);
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
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

const Divider = styled.div`
  width: 2px;
  height: 20px;
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
    color: #333;
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
