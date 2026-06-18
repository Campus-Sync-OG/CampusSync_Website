import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { principalApproveHostel } from "../api/ClientApi";

/* =========================
   STYLED COMPONENTS
========================= */

const Container = styled.div`
  min-height: 100vh;
  background: #f4f6fb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
`;

const Card = styled.div`
  background: white;
  width: 420px;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  text-align: center;
  color: #002087;
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
`;

const InfoItem = styled.div`
  background: #f8f9fd;
  padding: 12px 15px;
  border-radius: 8px;
`;

const Label = styled.div`
  font-size: 13px;
  color: #777;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;
`;

const ApproveButton = styled.button`
  flex: 1;
  background: #2ecc71;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #27ae60;
  }
`;

const RejectButton = styled.button`
  flex: 1;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const BackButton = styled.div`
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
  color: #555;

  &:hover {
    color: #000;
  }
`;

/* =========================
   COMPONENT
========================= */

const HostelApprovalPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { notif } = state || {};

    const details = notif?.message || {};
    const registration_id = details.registration_id;

    const [loading, setLoading] = useState(false);

    const handleDecision = async (decision) => {
        try {
            setLoading(true);
            await principalApproveHostel({ registration_id, decision });
            alert(decision === "approve" ? "Approved ✅" : "Rejected ❌");
            navigate(-1);
        } catch (err) {
            console.error("Approval failed:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Approval failed");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card>
                <Header>🏠 Hostel Application Approval</Header>

                <InfoGrid>
                    <InfoItem>
                        <Label>Admission No</Label>
                        <Value>{details.admission_no}</Value>
                    </InfoItem>

                    <InfoItem>
                        <Label>Preferred Sharing</Label>
                        <Value>{details.preferred_sharing}</Value>
                    </InfoItem>

                    <InfoItem>
                        <Label>Payment Type</Label>
                        <Value>{details.payment_type}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>Registration ID</Label>
                        <Value>{details.registration_id}</Value>
                    </InfoItem>
                </InfoGrid>

                <ButtonGroup>
                    <ApproveButton
                        disabled={loading}
                        onClick={() => handleDecision("approve")}
                    >
                        {loading ? "Processing..." : "Approve"}
                    </ApproveButton>

                    <RejectButton
                        disabled={loading}
                        onClick={() => handleDecision("reject")}
                    >
                        {loading ? "Processing..." : "Reject"}
                    </RejectButton>
                </ButtonGroup>

                <BackButton onClick={() => navigate(-1)}>⬅ Back</BackButton>
            </Card>
        </Container>
    );
};

export default HostelApprovalPage;
