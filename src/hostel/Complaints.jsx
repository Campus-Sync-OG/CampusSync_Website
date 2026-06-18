import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  fetchHostelComplaints,
  reviewHostelComplaint,
} from "../api/ClientApi";

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
  min-width: 700px;

  th {
    background: #002087;
    color: white;
    padding: 12px;
    font-size: 14px;
  }

  td {
    padding: 12px;
    text-align: center;
    border-bottom: 2px solid #eee;
    font-size: 13px;
    font-weight: 600;
    color: #333;
  }

  tr:hover td {
    background: #ffe6ea;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 10px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  background: ${({ status }) =>
    status === "Resolved"
      ? "green"
      : status === "Rejected"
      ? "#df0043"
      : status === "In Review"
      ? "#ff9800"
      : "#888"};
`;

const Button = styled.button`
  padding: 6px 10px;
  margin: 2px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  color: white;
  background: ${({ type }) =>
    type === "approve"
      ? "green"
      : type === "reject"
      ? "#df0043"
      : "#ff9800"};
`;

const EmptyText = styled.p`
  text-align: center;
  margin-top: 35px;
  font-size: 16px;
  font-weight: 700;
  color: #df0043;
`;

/* --- Component --- */
const Complaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await fetchHostelComplaints();
      setComplaints(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load complaints");
    }
  };

  const handleReview = async (id, status) => {
    try {
      await reviewHostelComplaint(id, {
        status,
        response_message: `Complaint ${status}`,
        responded_by: "warden", // replace with logged user id
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === id ? { ...c, status } : c
        )
      );

      alert(`Complaint ${status}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update complaint");
    }
  };

  return (
    <Container>
      <Title>📢 Hostel Complaints</Title>

      {complaints.length === 0 ? (
        <EmptyText>No complaints available</EmptyText>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Admission</th>
                <th>Name</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => (
                <tr key={c.complaint_id}>
                  <td>{c.admission_no}</td>
                  <td>{c.student?.student_name}</td>
                  <td>
                    {c.student?.class_name} {c.student?.section_name}
                  </td>
                  <td>{c.subject}</td>
                  <td>{c.description}</td>
                  <td>
                    <StatusBadge status={c.status}>
                      {c.status}
                    </StatusBadge>
                  </td>
                  <td>
                    {c.status === "Pending" && (
                      <>
                        <Button
                          type="review"
                          onClick={() =>
                            handleReview(c.complaint_id, "In Review")
                          }
                        >
                          Review
                        </Button>
                        <Button
                          type="approve"
                          onClick={() =>
                            handleReview(c.complaint_id, "Resolved")
                          }
                        >
                          Resolve
                        </Button>
                        <Button
                          type="reject"
                          onClick={() =>
                            handleReview(c.complaint_id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {c.status !== "Pending" && "--"}
                  </td>
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
