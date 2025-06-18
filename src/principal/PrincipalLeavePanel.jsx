import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { fetchAllLeaves, reviewLeave } from "../api/ClientApi"; // Adjust the import path as necessary

// Sample mock leave applications

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
  font-family: "Poppins";
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
  font-family: "Poppins";
`;

export const LeaveCard = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  background: #f0f4ff;
  border-radius: 20px;
  padding: 20px;
  margin: 20px 15px;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #ffffff;
  }
`;

export const CardHeader = styled.div`
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-family: "Poppins";

  h3 {
    font-size: 22px;
    font-weight: 700;
    color: #283593;
    margin: 0;
  }
`;

export const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) =>
    status === "Approved"
      ? "#4caf50"
      : status === "Rejected"
      ? "#f44336"
      : "#ffb300"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const LeaveInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 10px;
  font-size: 20px;
  margin-top: 10px;
  color: #333;
  font-family: "Poppins";

  p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: "Poppins";

    strong {
      color: #002087;
      font-weight: 600;
      min-width: 65px;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionButtons = styled.div`
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

export const ApproveButton = styled.button`
  background-color: #002087;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: #26a69a;
  }
`;

export const RejectButton = styled.button`
  background-color: #df0043;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: #b71c1c;
  }
`;

export const NoData = styled.p`
  text-align: center;
  font-size: 16px;
  color: #777;
  margin-top: 40px;
`;
