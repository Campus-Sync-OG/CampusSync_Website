import React, { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const Container = styled.div`
  padding: 0 1.2rem;
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
  background: linear-gradient(90deg, rgb(3, 27, 106), #002087b0, #df0043);
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
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 25px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 0px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
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

const data = [
  {
    slno: "01",
    roll_no: "02/05/VB1",
    name: "Sumith Thakur",
    class: "III",
    section: "B",
    assessment_type: "formative assessment",
    grades: "9 cgpa ",
  },
  {
    slno: "02",
    roll_no: "02/05/VB1",
    name: "Sumith ",
    class: "III",
    section: "B",
    assessment_type: "formative assessment",
    grades: "9 cgpa ",
  },
  {
    slno: "03",
    roll_no: "02/05/VB1",
    name: "Sum",
    class: "III",
    section: "B",
    assessment_type: "formative assessment",
    grades: "9 cgpa ",
  },
  {
    slno: "04",
    roll_no: "02/05/VB1",
    name: "Sumith Thak",
    class: "III",
    section: "B",
    assessment_type: "formative assessment",
    grades: "9 cgpa ",
  },
  {
    slno: "05",
    roll_no: "02/05/VB1",
    name: "Sumi",
    class: "III",
    section: "B",
    assessment_type: "formative assessment",
    grades: "9 cgpa ",
  },
];

const PrincipalAcademics = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    roll_no: "",
    class: "",
    section: "",
    assessment_type: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter((t) => {
      return (
        (filters.name === "" ||
          t.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.roll_no === "" ||
          t.roll_no.toLowerCase().includes(filters.roll_no.toLowerCase())) &&
        (filters.class === "" || t.class === filters.class) &&
        (filters.section === "" || t.section === filters.section) &&
        (filters.assessment_type === "" ||
          t.assessment_type === filters.assessment_type)
      );
    });
  }, [filters]);

  return (
    <Container>
      <Header>
        <Title>Academics</Title>
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
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
        <input
          placeholder="Search by roll no..."
          onChange={(e) => handleFilterChange("roll_no", e.target.value)}
        />
        <select onChange={(e) => handleFilterChange("class", e.target.value)}>
          <option value="">Select Class</option>

          <option value="X">X</option>
          <option value="IX">IX</option>
          <option value="VIII">VIII</option>
          <option value="VII">VII</option>
          <option value="VI">VI</option>
          <option value="V">V</option>
          <option value="IV">IV</option>
          <option value="III">III</option>
          <option value="II">II</option>
          <option value="I">I</option>

          {/* Add more classes here */}
        </select>
        <select onChange={(e) => handleFilterChange("section", e.target.value)}>
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          {/* Add more sections here */}
        </select>
        <select onChange={(e) => handleFilterChange("role", e.target.value)}>
          <option value="">Assessment Type</option>
          <option value="Formative Assessment">Formative Assessment</option>
          <option value="Summative Assessment">Summative Assessment</option>
        </select>
        <SearchButton>
          <SearchIcon size={20} />
          SEARCH
        </SearchButton>
      </FilterContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Sl no</Th>
            <Th>Roll number</Th>
            <Th>Student Name</Th>
            <Th>Class</Th>
            <Th>Section</Th>
            <Th>Assessment Name </Th>
            <Th>Grades</Th>
          </Tr>
        </Thead>
        <tbody>
          {filteredData.map((t, index) => (
            <Tr key={t.roll_no}>
              <Td>{String(index + 1).padStart(2, "0")}</Td>
              <Td>{t.roll_no}</Td>
              <Td>{t.name}</Td>
              <Td>{t.class}</Td>
              <Td>{t.section}</Td>
              <Td>{t.assessment_type}</Td>
              <Td>{t.grades}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PrincipalAcademics;
