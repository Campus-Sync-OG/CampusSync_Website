import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { fetchAllCertificateRequests, updateCertificateStatus } from "../api/ClientApi"; // Adjust path

const CertificatePanel = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch certificate requests from backend
 const getCertificates = async () => {
  try {
    const response = await fetchAllCertificateRequests();
    const data = Array.isArray(response) ? response : response.data || [];

    const formatted = data.map((cert) => ({
      id: cert.id,
      studentName: cert.student?.student_name || "Unknown",
      admissionNo: cert.student?.admission_no || "N/A",
      certificateType: cert.certificate_type,
      requestDate: new Date(cert.createdAt).toLocaleDateString(),
      status: cert.status,
      reason: cert.reason || "N/A",
    }));

    setCertificates(formatted);
  } catch (error) {
    console.error("Error fetching certificates:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getCertificates();
  }, []);
const handleAction = async (id, action) => {
  try {
    await updateCertificateStatus(id, action);
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === id ? { ...cert, status: action } : cert
      )
    );
  } catch (error) {
    console.error(`Error updating certificate ${id} to ${action}:`, error);
  }
};

  return (
    <PanelContainer>
      <Header>
        <Title>Certificate Requests</Title>
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

      {loading ? (
  <NoData>Loading...</NoData>
) : certificates.length === 0 ? (
  <NoData>No certificate requests found.</NoData>
) : (
  certificates.map((cert) => (
    <LeaveCard key={cert.id}>
      <CardHeader>
        <h3>{cert.studentName}</h3>
        {/* Show status badge only if status is set */}
        {cert.status && (
          <StatusBadge status={cert.status}>{cert.status}</StatusBadge>
        )}
      </CardHeader>

      <LeaveInfo>
        <p><strong>Admission No:</strong> {cert.admissionNo}</p>
        <p><strong>Type:</strong> {cert.certificateType}</p>
        <p><strong>Date:</strong> {cert.requestDate}</p>
        <p><strong>Reason:</strong> {cert.reason}</p>
      </LeaveInfo>

      {/* Show Approve/Reject buttons only if no decision yet */}
      {cert.status === "pending" && (
  <ActionButtons>
    <ApproveButton
      onClick={() => {
        handleAction(cert.id, "approved");
        alert("Request approved");
      }}
    >
      Approve
    </ApproveButton>
    <RejectButton
      onClick={() => {
        handleAction(cert.id, "rejected");
        alert("Request rejected");
      }}
    >
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

export default CertificatePanel;

/* ----- Styled Components (same as leave panel) ----- */
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 5px 20px;
  border-radius: 10px;
  color: white;
  font-family: "Poppins";
  margin: 5px;
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
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

export const PanelContainer = styled.div`
  overflow-y: auto;
  padding: 0 1.2rem;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
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
    status === "approved"
      ? "#4caf50"
      : status === "rejected"
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
