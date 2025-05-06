import React, { useEffect, useState } from "react";
import { fetchAcademics, uploadAcademicsCSV } from "../api/ClientApi";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 10px;
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

const Container = styled.div`
  padding: 20px;
  background: white;
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

const Stitle = styled.div`
  font-size: 26px;
  color: #002087;
  margin: 20px 0;
  font-family: "Poppins";
`;


const TeacherAcademics = () => {
  const [academicData, setAcademicData] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a file first.");
      return;
    }
    try {
      const result = await uploadAcademicsCSV(csvFile);
      console.log("Upload success:", result);
      alert("CSV uploaded successfully!");
      // You can refresh the academic data here if needed
    } catch (error) {
      console.error("Failed to upload CSV:", error);
      alert("Failed to upload CSV!");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    const loadAcademics = async () => {
      try {
        const data = await fetchAcademics();
        setAcademicData(data);
      } catch (error) {
        console.error("Failed to load academics:", error);
      }
    };

    loadAcademics();
  }, []);
  return (
    <Container>
      <Header>
        <Title>Academics</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
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

      <Stitle>Academic Scores</Stitle>

      <FilterBar>
        <input type="text" placeholder="Search by name..." />
        <input type="text" placeholder="Search by Roll Number..." />
        <input type="text" placeholder="Search by Subject Name..." />
        <select>
          <option>Select Class</option>
          <option>III</option>
          <option>IV</option>
          <option>X</option>
        </select>
        <select>
          <option>Select Section</option>
          <option>A</option>
          <option>B</option>
        </select>
        <select>
          <option>Assessment Type</option>
          <option>Formative</option>
          <option>Summative</option>
        </select>
        <button>SEARCH</button>
        <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>
          Upload CSV File:
        </label>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          onClick={handleFileUpload}
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            background: "#df0043",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </div>


      </FilterBar>

      <Table>
        <thead>
          <tr>
            <th>Sl no</th>
            <th>Roll Number</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Assessment Name</th>
            <th>Grades</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {academicData.map((item, index) => (
            <tr key={index}>
              <td>{String(index + 1).padStart(2, "0")}</td>
              <td>{item.admission_no}</td>
              <td>{item.student_name}</td>
              <td>{item.class}</td>
              <td>{item.section}</td>
              <td>{item.exam_format}</td>
              <td>{item.class_grade}</td>
              <td>
                <button
                  style={{
                    padding: "6px 12px",
                    background: "#002087",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      
    </Container>
  );
};

export default TeacherAcademics;
