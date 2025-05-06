import React, { useEffect, useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import styled from 'styled-components';
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { getStudentsByClassAndSection } from '../api/ClientApi';
const Container = styled.div`
  padding: 2rem;
  max-height:90vh;
  overflow-y:auto;
  font-family:poppins;
  
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex: 1;
  min-width: 180px;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex: 1;
  min-width: 180px;
`;

const Button = styled.button`
  background-color: #e60050;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
 
  

`;

const Thead = styled.thead`
 background: linear-gradient(90deg,rgb(3, 27, 106), #002087b0, #df0043);
  color: white;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

`;

const Td = styled.td`
  padding: 0.75rem 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg,rgb(1, 26, 109), #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 0px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 3px;
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

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
margin-top: 2.5rem;

  input,
  select {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const SearchButton = styled.button`
  background-color: #f50057;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  svg {
    stroke: white;
  }
`;
const StudentInfo = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    student_name: '',
    roll_no: '',
    class: '',
    section: '',
  });
  const [students, setStudents] = useState([]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const fetchStudents = async () => {
    if (filters.class && filters.section) {
      try {
        const response = await getStudentsByClassAndSection(filters.class, filters.section);
        setStudents(response || []);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    }
  };

  const handleSearch = () => {
    fetchStudents();
  };

  const handleView = (rollNo) => {
    const encodedRoll = encodeURIComponent(rollNo);
    navigate(`/detailedinfo/${encodedRoll}`);
  };

  const filteredData = useMemo(() => {
    return students.filter(t => {
      return (
        (!filters.student_name || t.student_name?.toLowerCase().includes(filters.student_name.toLowerCase())) &&
        (!filters.roll_no || t.roll_no?.toString().includes(filters.roll_no.toString()))&&

        (!filters.class || t.class === filters.class) &&
        (!filters.section || t.section === filters.section)
      );
    });
  }, [students, filters.student_name, filters.roll_no]);
  const romanMapping = [
    { value: 1, label: 'I' },
    { value: 2, label: 'II' },
    { value: 3, label: 'III' },
    { value: 4, label: 'IV' },
    { value: 5, label: 'V' },
    { value: 6, label: 'VI' },
    { value: 7, label: 'VII' },
    { value: 8, label: 'VIII' },
    { value: 9, label: 'IX' },
    { value: 10, label: 'X' }
  ];
  
  return (
    <Container>
      <Header>
        <Title>Student Information</Title>
        <Wrapper>
          <Link to="/principal-dashboard">
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

      <FilterContainer>
        <input
          placeholder="Search by name..."
          onChange={e => handleFilterChange('student_name', e.target.value)}
        />
        <input
          placeholder="Search by Roll Number..."
          onChange={e => handleFilterChange('roll_no', e.target.value)}
        />
        <select onChange={e => handleFilterChange('class', e.target.value)}>
  <option value="">Select Class</option>
  {romanMapping.map(cls => (
    <option key={cls.value} value={cls.value}>
      {cls.label}
    </option>
  ))}
</select>
        <select onChange={e => handleFilterChange('section', e.target.value)}>
          <option value="">Select Section</option>
          {['A', 'B', 'C'].map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
        <SearchButton onClick={handleSearch}>
          <SearchIcon size={20} />
          SEARCH
        </SearchButton>
      </FilterContainer>

      <Table>
        <Thead>
          <Tr>
            <Th>Sl no</Th>
            <Th>Roll Number</Th>
            <Th>Student Name</Th>
            <Th>Class</Th>
            <Th>Section</Th>
            <Th>Gender</Th>
            <Th>D.O.B</Th>
            <Th>Details</Th>
          </Tr>
        </Thead>
        <tbody>
          {filteredData.map((student, index) => (
            <Tr key={student.rollNo}>
              <Td>{String(index + 1).padStart(2, '0')}</Td>
              <Td>{student.roll_no}</Td>
              <Td>{student.student_name}</Td>
              <Td>{student.class}</Td>
              <Td>{student.section}</Td>
              <Td>{student.gender}</Td>
              <Td>{student.dob ? student.dob.slice(0, 10) : ''}</Td>

              <Td style={{ color: 'hotpink', cursor: 'pointer' }} onClick={() => handleView(student.rollNo)}>View</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default StudentInfo;