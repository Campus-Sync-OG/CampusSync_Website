import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { fetchFilteredSubjects } from "../api/ClientApi";

// Styled Components
const Container = styled.div`
  padding: 0 15px;
  background: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 600;
  margin: 0;
  font-family: "Poppins";
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

const Stitle = styled.div`
  font-size: 26px;
  color: #002087;
  margin: 20px 0;
  font-family: "Poppins";
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;

  input,
  select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
  }

  button {
    background-color: #df0043;
    color: white;
    padding: 10px 20px;
    border: none;
    font-weight: bold;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    text-align: center;
    vertical-align: middle;
  }

  th {
    background: #002087;
    color: white;
  }

  tr:nth-child(even) {
    background: #f9f9f9;
  }
`;

const AdminSubject = () => {
  const [filters, setFilters] = useState({
    emp_name: "",
    emp_id: "",
    class: "",
    section: "",
    role: "",
  });

  const [subjectData, setSubjectData] = useState([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin-addsubject");
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const rawData = await fetchFilteredSubjects(filters);
      const transformed = rawData.map((item) => ({
        emp_id: item.employeeID,
        emp_name: item.teacherName,
        class_name: item.class,
        section: item.section,
       subjects: item.subjects || [],

        role: item.role || "",
      }));
      setSubjectData(transformed);
    } catch (error) {
      console.error("Error fetching subjects", error);
    }
  };

  useEffect(() => {
    handleSearch(); // fetch initial data
  }, []);

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Assigned Subjects</Title>
        <Wrapper>
          <Icons onClick={() => navigate("/admin-dashboard")}>
            <img src={home} alt="home" />
          </Icons>
          <Divider />
          <Icons onClick={handleBack}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <Stitle>Assigned Subjects</Stitle>

      {/* Filter Bar */}
      <FilterBar>
        <input
          type="text"
          name="emp_name"
          placeholder="Search by name..."
          value={filters.emp_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="emp_id"
          placeholder="Search by Employee ID..."
          value={filters.emp_id}
          onChange={handleInputChange}
        />
        <select name="class" value={filters.class} onChange={handleInputChange}>
          <option value="">Select Class</option>
          {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"].map(
            (cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            )
          )}
        </select>
        <select
          name="section"
          value={filters.section}
          onChange={handleInputChange}
        >
          <option value="">Select Section</option>
          {["A", "B", "C", "D"].map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
        <select name="role" value={filters.role} onChange={handleInputChange}>
          <option value="">Role</option>
          <option value="classTeacher">classTeacher</option>
          <option value="subjectTeacher">subjectTeacher</option>
        </select>
        <button onClick={handleSearch}>SEARCH</button>
      </FilterBar>

      {/* Data Table */}
      <Table>
        <thead>
          <tr>
            <th>Sl no</th>
            <th>Employee ID</th>
            <th>Teacher Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Subjects</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {subjectData.map((item, index) => (
            <tr key={index}>
              <td>{String(index + 1).padStart(2, "0")}</td>
              <td>{item.emp_id}</td>
              <td>{item.emp_name}</td>
              <td>{item.class_name}</td>
              <td>{item.section}</td>
              <td>{item.subjects}</td> {/* ← Correct way */}

              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#df0043",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Add Subject
      </button>
    </Container>
  );
};

export default AdminSubject;
