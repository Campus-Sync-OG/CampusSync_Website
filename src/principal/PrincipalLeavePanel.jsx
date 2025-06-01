import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAllLeaves, reviewLeave } from "../api/ClientApi";
// Sample mock leave applications


const PrincipalLeavePanel = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaves from backend
  const getLeaves = async () => {
    try {
      const response = await fetchAllLeaves();
      const formatted = response.data.map((leave) => ({
        id: leave.id,
        teacherName: leave.teacher.name,
        leaveType: leave.leave_type,
        fromDate: leave.from_date,
        toDate: leave.to_date,
        reason: leave.reason,
        status: leave.status,
      }));
      setLeaves(formatted);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaves();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await reviewLeave(id, action);
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === id ? { ...leave, status: action } : leave
        )
      );
    } catch (error) {
      console.error(`Error updating leave ${id} to ${action}:`, error);
    }
  };
  return (
    <PanelContainer>
      <Title>Leave Applications</Title>
      {leaves.length === 0 ? (
        <NoData>No leave applications found.</NoData>
      ) : (
        leaves.map((leave) => (
          <LeaveCard key={leave.id}>
            <CardHeader>
              <h3>{leave.teacherName}</h3>
              <StatusBadge status={leave.status}>{leave.status}</StatusBadge>
            </CardHeader>
            <LeaveInfo>
              <p><strong>Type:</strong> {leave.leaveType}</p>
              <p><strong>From:</strong> {leave.fromDate}</p>
              <p><strong>To:</strong> {leave.toDate}</p>
              <p><strong>Reason:</strong> {leave.reason}</p>
            </LeaveInfo>
            {leave.status === "Pending" && (
              <ActionButtons>
                <ApproveButton onClick={() => handleAction(leave.id, "Approved")}>
                  Approve
                </ApproveButton>
                <RejectButton onClick={() => handleAction(leave.id, "Rejected")}>
                  Reject
                </RejectButton>
              </ActionButtons>
            )}
          </LeaveCard>
        ))
      )}
    </PanelContainer>
  );
};

export default PrincipalLeavePanel;

export const PanelContainer = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
`;

export const LeaveCard = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) =>
    status === "Approved"
      ? "#2ecc71"
      : status === "Rejected"
      ? "#e74c3c"
      : "#f1c40f"};
`;

export const LeaveInfo = styled.div`
  margin-top: 15px;
  line-height: 1.6;
  font-size: 15px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const ApproveButton = styled.button`
  background-color: #2ecc71;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #27ae60;
  }
`;

export const RejectButton = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #c0392b;
  }
`;

export const NoData = styled.p`
  text-align: center;
  font-size: 16px;
  color: #777;
  margin-top: 40px;
`;
