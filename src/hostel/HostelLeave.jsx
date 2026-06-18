import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  fetchHostelLeaveRequests,
  updateHostelLeaveStatus,
} from "../api/ClientApi";

/* Layout */
const Container = styled.div`
  padding: 24px;
  font-family: "Poppins", sans-serif;
  background: #f5f7fb;
  min-height: 100vh;
`;

/* Page title */
const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #002087;
  text-align: center;
  margin-bottom: 20px;
`;

/* Modern Table card */
const TableCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0, 33, 135, 0.1);
  overflow-x: auto;
`;

/* Styled table */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  thead tr {
    background: #002087;
    color: white;
    font-size: 14px;
    text-transform: uppercase;
  }

  th,
  td {
    padding: 12px;
    text-align: center;
    font-weight: 600;
    font-size: 13px;
  }

  td {
    border-bottom: 2px solid #eef2fa;
    color: #333;
  }

  tbody tr:hover {
    background: #ffe6ea;
    transition: 0.3s;
  }
`;

/* Status badge */
const Badge = styled.span`
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background: ${(props) =>
    props.status === "Approved"
      ? "green"
      : props.status === "Rejected"
      ? "#df0043"
      : "orange"};
`;

/* Action buttons */
const Btn = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  margin: 0 4px;
  background: ${(props) => (props.type === "approve" ? "green" : "#df0043")};
  color: white;
  &:hover {
    opacity: 0.8;
  }
`;

/* Leave data dummy */


const HostelLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const res = await fetchHostelLeaveRequests();
      setLeaveRequests(res.data || []);
    } catch {
      alert("Failed to load leave requests");
    }
  };

  const handleStatusChange = async (leave_id, status) => {
    try {
      await updateHostelLeaveStatus(leave_id, status);
      setLeaveRequests((prev) =>
        prev.map((l) =>
          l.leave_id === leave_id ? { ...l, status } : l
        )
      );
      alert(`Leave ${status}`);
    } catch {
      alert("Error updating leave");
    }
  };

  return (
    <Container>
      <Title>Hostel Leave Requests</Title>

      <Table>
        <thead>
          <tr>
            <th>Admission</th>
            <th>Name</th>
            <th>Class</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaveRequests.map((req) => (
            <tr key={req.leave_id}>
              <td>{req.admission_no}</td>
              <td>{req.student?.student_name}</td>
              <td>{req.student?.class}</td>
              <td>{req.start_date?.slice(0, 10)}</td>
              <td>{req.end_date?.slice(0, 10)}</td>
              <td>{req.reason}</td>
              <td>
                <Badge status={req.status}>{req.status}</Badge>
              </td>
              <td>
                {req.status === "Pending" ? (
                  <>
                    <Btn onClick={() => handleStatusChange(req.leave_id, "Approved")}>
                      Approve
                    </Btn>
                    <Btn danger onClick={() => handleStatusChange(req.leave_id, "Rejected")}>
                      Reject
                    </Btn>
                  </>
                ) : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default HostelLeave;

