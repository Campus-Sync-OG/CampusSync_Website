import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { fetchAllLeaves, reviewLeave } from "../api/ClientApi"; // Adjust the import path as necessary

// Sample mock leave applications
const mockLeaves = [
  {
    id: 1,
    teacherName: "Anita Sharma",
    leaveType: "Sick",
    fromDate: "2025-06-01",
    toDate: "2025-06-03",
    reason:
      "I am writing to formally request a sick leave from [start date] to [end date] due to a sudden illness. I have been experiencing symptoms such as high fever, fatigue, and body aches, which require rest and medical attention. My doctor has advised me to take a few days off to recover fully and avoid spreading any potential infection. I will ensure that my responsibilities are managed during my absence and will make up for any missed work once I return. I kindly request your understanding and approval of my leave application.",
    status: "Pending",
  },
  {
    id: 2,
    teacherName: "Ravi Kumar",
    leaveType: "Casual",
    fromDate: "2025-06-05",
    toDate: "2025-06-06",
    reason: "Personal work",
    status: "Pending",
  },
];

const PrincipalLeavePanel = () => {
  const navigate = useNavigate();
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
    <>
      <Header>
        <Title>Leave Applications</Title>
        <Wrapper>
          <Link to="/principal-dashboard">
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

      <PanelContainer>
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
                <p>
                  <strong>Type:</strong> {leave.leaveType}
                </p>
                <p>
                  <strong>From:</strong> {leave.fromDate}
                </p>
                <p>
                  <strong>To:</strong> {leave.toDate}
                </p>
                <p>
                  <strong>Reason:</strong> {leave.reason}
                </p>
              </LeaveInfo>
              {leave.status === "Pending" && (
                <ActionButtons>
                  <ApproveButton
                    onClick={() => handleAction(leave.id, "Approved")}
                  >
                    Approve
                  </ApproveButton>
                  <RejectButton
                    onClick={() => handleAction(leave.id, "Rejected")}
                  >
                    Reject
                  </RejectButton>
                </ActionButtons>
              )}
            </LeaveCard>
          ))
        )}
      </PanelContainer>
    </>
  );
};

export default PrincipalLeavePanel;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
  font-family: "Poppins";
  font-size: 20px;
  margin: 5px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Icons = styled.div`
  cursor: pointer;
  margin: 0 10px;

  img {
    width: 30px;
    height: 30px;
  }
`;

export const Divider = styled.div`
  width: 2px;
  height: 30px;
  background-color: white;
`;

// Page content styles
export const PanelContainer = styled.div`
  overflow-y: auto;
  height: 70vh;

  /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for Internet Explorer and Edge */
  -ms-overflow-style: none;
`;

export const PanelTitle = styled.h2`
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
  background-color: #002087;
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
  background-color: #df0043;
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
