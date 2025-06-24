import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getClassLeaves} from "../api/ClientApi"; // adjust paths

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: auto;
`;

const Heading = styled.h2`
  text-align: center;
  color: #002087;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
`;

const Thead = styled.thead`
  background-color: #002087;
  color: white;
`;

const Th = styled.th`
  padding: 6px;
`;

const Td = styled.td`
  padding: 6px;
`;

const Tr = styled.tr`
  background-color: #f5f5f5;
`;

const Button = styled.button`
  padding: 4px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 3px;
  color: white;
  background-color: ${props => props.status === "Approved" ? "#28a745" : props.status === "Rejected" ? "#dc3545" : "#6c757d"};
  cursor: pointer;
`;

const TeacherLeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);
   const getEmp = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.unique_id || "";
  };


  const loadLeaves = async () => {
    try {
       const emp_id = getEmp();
      console.log("emp_id from localStorage:", emp_id);
      if (!emp_id) {
        alert("emp_id not found in localStorage");
        return;
      }
      console.log("Fetching leaves for emp_id:", emp_id);
      const data = await getClassLeaves(emp_id);
      setLeaves(data.leaves || []);
    } catch (err) {
      console.error("Error loading leaves", err);
      alert("Failed to load leave applications");
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <Container>
      <Heading>Leave Applications Assigned To You</Heading>

      {leaves.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#888" }}>
          No leave applications available.
        </p>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Admission No</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
            </tr>
          </Thead>
          <tbody>
            {leaves.map(leave => (
              <Tr key={leave.id}>
                <Td>{leave.admission_no}</Td>
                <Td>{new Date(leave.from_date).toLocaleDateString()}</Td>
                <Td>{new Date(leave.to_date).toLocaleDateString()}</Td>
                <Td>{leave.reason}</Td>
                <Td>{leave.status}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TeacherLeaveApprovals;
