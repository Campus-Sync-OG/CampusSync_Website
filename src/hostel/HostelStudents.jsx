import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 22px;
  font-family: "Roboto", sans-serif;
  background: #f9f9f9;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 800;
  color: #002087;
  text-align: center;
  margin-bottom: 18px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  background: white;
  padding: 10px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;

  th {
    background: #002087;
    color: #fff;
    padding: 13px;
    font-size: 15px;
    font-weight: 700;
  }

  td {
    padding: 12px;
    border-bottom: 2px solid #eee;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  tr:hover td {
    background: #ffe6ea;
  }
`;

const ActionButton = styled.button`
  background: #df0043;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.3s;

  &:hover {
    background: #002087;
  }
`;

const dummyHostelStudents = [
  { id: 1, admission: "A001", name: "Gnana Dev", class: "10", section: "A", roomType: "2-sharing", roomNo: "2-101", bedsFilled: "1/2" },
  { id: 2, admission: "A002", name: "Rohan Kumar", class: "10", section: "B", roomType: "3-sharing", roomNo: "3-203", bedsFilled: "2/3" },
  { id: 3, admission: "A003", name: "Sneha Raj", class: "9", section: "A", roomType: "4-sharing", roomNo: "4-303", bedsFilled: "1/4" },
  { id: 4, admission: "A004", name: "Arjun Mehta", class: "8", section: "C", roomType: "2-sharing", roomNo: "2-102", bedsFilled: "2/2" }
];

const HostelStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostelStudents = async () => {
      await new Promise((res) => setTimeout(res, 500));
      setStudents(dummyHostelStudents);
    };
    fetchHostelStudents();
  }, []);

  return (
    <Container>
      <Title>👨‍🎓 Hostel Students List</Title>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Admission No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Room Type</th>
              <th>Room No</th>
              <th>Beds Filled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.admission}</td>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.section}</td>
                <td>{student.roomType}</td>
                <td>{student.roomNo}</td>
                <td>{student.bedsFilled}</td>
                <td>
                  <ActionButton
                    onClick={() => {
                      navigate("/hostel-room-availability");
                    }}
                  >
                    Change Room
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default HostelStudents;
