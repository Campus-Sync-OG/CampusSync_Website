// File: HostelRegister.jsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS

const ERP_RED = '#cc2b2b';
const ERP_BLUE = '#1e6fb8';
const ERP_LIGHT = '#f5f7fb';

const Page = styled.div`
  min-height: 100vh;
  background: ${ERP_LIGHT};
  padding: 24px 12px;
  display: flex;
  justify-content: center;
  font-family: Inter, system-ui;
  color: #222;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 720px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 18px;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
`;

const Header = styled.div`
  background: ${ERP_BLUE};
  padding: 12px 14px;
  border-radius: 6px;
  color: white;
  font-weight: 700;
  margin-bottom: 14px;
`;

const H = styled.h2`
  margin: 0 0 8px 0;
  color: ${ERP_RED};
  font-size: 18px;
`;

const Button = styled.button`
  background: ${ERP_RED};
  color: white;
  border: none;
  padding: 12px 16px;
  width: 100%;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Field = styled.div`
  margin-bottom: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #dcdcdc;
`;

const Note = styled.p`
  font-size: 13px;
  color: #555;
`;

const FeeRow = styled.div`
  background: #f7f7f7;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export default function HostelRegister({ student = { name: "Student Name" } }) {
  const navigate = useNavigate();   // ✅ ADD THIS

  const [showForm, setShowForm] = useState(false);

  // form values
  const [sharing, setSharing] = useState("");
  const [payment, setPayment] = useState("");
  const [premium, setPremium] = useState(false);

  // fee logic
  const baseFee = {
    single: 8000,
    double: 5000,
    triple: 3500
  };
  const premiumExtra = 1500;

  const totalFee = useMemo(() => {
    if (!sharing) return 0;
    let fee = baseFee[sharing];
    if (premium) fee += premiumExtra;
    return fee;
  }, [sharing, premium]);

  const cautionFee = totalFee > 0 ? 2000 : 0;

  return (
    <Page>
      <Wrapper>
        <Card>

          <Header>HOSTEL</Header>

          <H>Hostel For {student.name}</H>
          <div style={{ marginBottom: 14, color: ERP_BLUE }}>
            Course Details : Master of Computer Applications-(2023-2025)
          </div>

          {/* STEP 1 → Only show Register button */}
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>REGISTER</Button>
          )}

          {/* STEP 2 → Show Form only after click */}
          {showForm && (
            <div style={{ marginTop: 16 }}>
              <Field>
                <Label>
                  <input
                    type="checkbox"
                    checked={premium}
                    onChange={e => setPremium(e.target.checked)}
                    style={{ marginRight: 6 }}
                  />
                  Premium Room
                </Label>
              </Field>

              <Field>
                <Label>Preferred Room Sharing *</Label>
                <Select value={sharing} onChange={e => setSharing(e.target.value)}>
                  <option value="">Select an Option</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </Select>
              </Field>

              <Field>
                <Label>Payment Type *</Label>
                <Select value={payment} onChange={e => setPayment(e.target.value)}>
                  <option value="">Select an Option</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </Select>
              </Field>

              <FeeRow>
                <strong>Total Fee: </strong> ₹ {totalFee}/-
              </FeeRow>
              <FeeRow>
                <strong>Caution Fee: </strong> ₹ {cautionFee}/-
              </FeeRow>

              <Note>* Caution fee not applicable for re-joiners.</Note>

              {/* ⭐ FINAL SUBMIT BUTTON (NOW WITH REDIRECT) */}
              <Button 
                onClick={() => {
                  alert("Submitted ✓");
                  navigate("/hostel-home");   // ✅ REDIRECT AFTER SUBMIT
                }}
              >
                Submit Registration
              </Button>
            </div>
          )}
        </Card>
      </Wrapper>
    </Page>
  );
}
