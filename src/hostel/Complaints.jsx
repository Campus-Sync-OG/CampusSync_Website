import React, { useState, useEffect } from "react";
import styled from "styled-components";

/* --- Styled UI --- */
const Container = styled.div`
  padding: 22px;
  font-family: "Roboto", sans-serif;
  background: #fafafa;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #002087;
  text-align: center;
  margin-top: 12px;
  margin-bottom: 18px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  background: white;
  padding: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th {
    background: #002087;
    color: white;
    padding: 12px;
    font-size: 15px;
  }

  td {
    padding: 12px;
    text-align: center;
    border-bottom: 2px solid #eee;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  tr:hover td {
    background: #ffe6ea;
  }
`;

const EmptyText = styled.p`
  text-align: center;
  margin-top: 35px;
  font-size: 16px;
  font-weight: 700;
  color: #df0043;
`;

/* --- Dummy complaints DB to simulate student complaints --- */
const dummyComplaints = [
  {
    id: 1,
    admission: "A001",
    name: "Gnana Dev",
    class: "10",
    section: "A",
    message: "Water problem in hostel room",
    date: "2025-11-28",
  },
  {
    id: 2,
    admission: "A003",
    name: "Sneha Raj",
    class: "9",
    section: "A",
    message: "Fan not working",
    date: "2025-11-29",
  },
  {
    id: 3,
    admission: "A004",
    name: "Arjun Mehta",
    class: "8",
    section: "C",
    message: "Food quality is bad",
    date: "2025-11-27",
  },
];

/* --- Component --- */
const Complaints = () => {
  const [complaints, setComplaints] = useState([]);

  /* Simulated fetch, replace with real API later */
  const fetchComplaints = async () => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));
    setComplaints(dummyComplaints);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <Container>
      <Title>📢 Student Complaints</Title>

      {complaints.length === 0 ? (
        <EmptyText>No complaints available from students</EmptyText>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Complaint</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.admission}</td>
                  <td>{c.name}</td>
                  <td>{c.class}</td>
                  <td>{c.section}</td>
                  <td>{c.message}</td>
                  <td>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};

export default Complaints;
