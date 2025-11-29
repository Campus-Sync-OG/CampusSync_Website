import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
const StatusBadge = styled.span`
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
const ActionButton = styled.button`
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
const dummyLeaveData = [
  {
    id: 1,
    admission: "A001",
    name: "Gnana Dev",
    class: "10",
    section: "A",
    from: "2025-11-25",
    to: "2025-11-27",
    reason: "Medical leave",
    status: "Pending",
  },
  {
    id: 2,
    admission: "A002",
    name: "Rohan Kumar",
    class: "10",
    section: "B",
    from: "2025-11-26",
    to: "2025-11-28",
    reason: "Fever",
    status: "Pending",
  },
  {
    id: 3,
    admission: "A003",
    name: "Sneha Raj",
    class: "9",
    section: "A",
    from: "2025-11-20",
    to: "2025-11-21",
    reason: "Family function",
    status: "Approved",
  },
];

const HostelLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      await new Promise((res) => setTimeout(res, 400));
      setLeaveRequests(dummyLeaveData);
    };
    fetchLeaveData();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.toLowerCase();

    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
    alert(`✅ Leave ${newStatus} successfully!`);
  };

  return (
    <Container>
      <Title>📅 Hostel Leave Requests</Title>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Admission No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Leave From</th>
              <th>Leave To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.admission}</td>
                <td>{req.name}</td>
                <td>{req.class}</td>
                <td>{req.section}</td>
                <td>{req.from}</td>
                <td>{req.to}</td>
                <td>{req.reason}</td>
                <td>
                  <StatusBadge status={req.status}>{req.status}</StatusBadge>
                </td>

                {/* Action only for pending rooms */}
                <td>
                  {req.status === "Pending" ? (
                    <>
                      <ActionButton
                        type="approve"
                        onClick={() => handleStatusChange(req.id, "Approved")}
                      >
                        ✔ Approve
                      </ActionButton>
                      <ActionButton
                        type="reject"
                        onClick={() => handleStatusChange(req.id, "Rejected")}
                      >
                        ✖ Reject
                      </ActionButton>
                    </>
                  ) : (
                    <span>--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
};

export default HostelLeave;
