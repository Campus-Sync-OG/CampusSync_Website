import React, { useState, useEffect } from "react";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { useNavigate } from "react-router-dom";
import { fetchAssignedSubjects } from "../api/ClientApi";

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  border-radius: 15px;
  padding: 20px;
  color: white;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Icon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  margin-top: 20px;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #002087;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f7f9fc;
  }
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
`;

const TableData = styled.td`
  padding: 15px;
  text-align: left;
`;

const TeacherSubjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emp_id, setEmpId] = useState(null);

  // Step 1: Get emp_id from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setEmpId(userData.unique_id);
    } else {
      setError("Teacher data not found.");
      setLoading(false);
    }
  }, []);

  // Step 2: Fetch subjects from API

  useEffect(() => {
    const fetchData = async () => {
      if (!emp_id) return;

      setLoading(true);
      try {
        const response = await fetchAssignedSubjects(emp_id);
        console.log("API Response:", response);

        // Check if response is an array
        if (Array.isArray(response)) {
          setSubjects(response);
          setError(null);
        } else {
          setSubjects([]);
          setError("No subjects found or invalid response format");
        }
      } catch (err) {
        setSubjects([]);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emp_id]);

  useEffect(() => {
    console.log("Subjects: ", subjects);  // Check if subjects are correctly being set
  }, [subjects]);

  return (
    <Container>
      <Header>
        <Title>Subject</Title>
        <IconGroup>
          <Icon src={home} alt="Home" onClick={() => navigate("/teacher-dashboard")} />
          <div style={{ width: "1px", height: "25px", background: "white" }} />
          <Icon src={back} alt="Back" onClick={() => navigate(-1)} />
        </IconGroup>
      </Header>

      <TableWrapper>
        <StyledTable>
          <TableHead>
            <tr>
              <TableHeader>Sl no</TableHeader>
              <TableHeader>Subject Name</TableHeader>
              <TableHeader>Class</TableHeader>
              <TableHeader>Section</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {loading ? (
              <tr>
                <TableData colSpan="4">Loading...</TableData>
              </tr>
            ) : subjects.length === 0 ? (
              <tr>
                <TableData colSpan="4">No subjects assigned yet.</TableData>
              </tr>
            ) : (
              subjects.map((row, index) => (
                <TableRow key={row.id || index}> {/* Use row.id to uniquely identify each row */}
                  <TableData>{index + 1}</TableData> {/* Sl no */}
                  <TableData>
                    {(row.subjects || "N/A").replace(/[{}]/g, "")}
                  </TableData>


                  <TableData>{row.class_name || "N/A"}</TableData>
                  <TableData>{row.section || "N/A"}</TableData>
                </TableRow>
              ))
            )}
          </tbody>

        </StyledTable>
      </TableWrapper>
    </Container>
  );
};

export default TeacherSubjects;
