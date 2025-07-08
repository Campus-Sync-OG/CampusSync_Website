import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getClassPerformance } from "../api/ClientApi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { FaSearch } from "react-icons/fa";

const PrincipalAcademics = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name: "",
    roll_no: "",
    class: "",
    section: "",
    assessment_type: "",
  });

  const [academicData, setAcademicData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAcademics = async (classGrade, section) => {
    try {
      setLoading(true);
      const data = await getClassPerformance(classGrade, section);
      setAcademicData(data || []);
    } catch (error) {
      setAcademicData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (filters.class && filters.section) {
      setShowGraph(false); // Reset chart visibility on new search
      fetchAcademics(filters.class, filters.section);
    } else {
      alert("Please select both Class and Section.");
    }
  };

  useEffect(() => {
    const filtered = academicData
      .filter((t) => {
        return (
          (filters.name === "" || t.student_name.toLowerCase().includes(filters.name.toLowerCase())) &&
          (filters.roll_no === "" || t.admission_no.toLowerCase().includes(filters.roll_no.toLowerCase())) &&
          (filters.class === "" || t.class_grade === filters.class) &&
          (filters.section === "" || t.section === filters.section) &&
          (filters.assessment_type === "" || t.exam_format === filters.assessment_type)
        );
      })
      .sort((a, b) => b.percentage - a.percentage);

    setFilteredData(filtered);
  }, [filters, academicData]);

  return (
    <Container>
      <Header>
        <Title>Academics</Title>
        <Wrapper>
          <Link to="/principal-dashboard">
            <Icons><img src={home} alt="home" /></Icons>
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}><img src={back} alt="back" /></Icons>
        </Wrapper>
      </Header>

      <FilterContainer>
        <input placeholder="Search by name..." onChange={(e) => handleFilterChange("name", e.target.value)} />
        <input placeholder="Search by roll no..." onChange={(e) => handleFilterChange("roll_no", e.target.value)} />
        <select onChange={(e) => handleFilterChange("class", e.target.value)}>
          <option value="">Select Class</option>
          {["10", "IX", "VIII", "VII", "VI", "V", "IV", "III", "II", "I"].map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        <select onChange={(e) => handleFilterChange("section", e.target.value)}>
          <option value="">Select Section</option>
          {["A", "B", "C"].map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
        <select onChange={(e) => handleFilterChange("assessment_type", e.target.value)}>
          <option value="">Assessment Type</option>
          <option value="FA2">Formative Assessment</option>
          <option value="Summative Assessment">Summative Assessment</option>
        </select>
        <SearchButton onClick={handleSearch}>
          <FaSearch /> SEARCH
        </SearchButton>
        {filteredData.length > 0 && (
          <GraphButton onClick={() => setShowGraph(true)}>
            📊 Show Graph
          </GraphButton>
        )}
      </FilterContainer>

      {/* 📊 Performance Chart */}
      {showGraph && filteredData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="student_name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="percentage" fill="#1e88e5" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* 📋 Academic Table */}
      <Table>
        <Thead>
          <Tr>
            <Th>Sl no</Th>
            <Th>Roll number</Th>
            <Th>Student Name</Th>
            <Th>Class</Th>
            <Th>Section</Th>
            <Th>Assessment Name</Th>
            <Th>Percentage</Th>
          </Tr>
        </Thead>
        <tbody>
          {filteredData.map((t, index) => (
            <Tr key={t.admission_no}>
              <Td>{String(index + 1).padStart(2, "0")}</Td>
              <Td>{t.admission_no}</Td>
              <Td>{t.student_name}</Td>
              <Td>{t.class_grade}</Td>
              <Td>{t.section}</Td>
              <Td>{t.exam_format}</Td>
              <Td>{t.percentage}%</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PrincipalAcademics;

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

const GraphButton = styled.button`
  background-color: #0069c0;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;
