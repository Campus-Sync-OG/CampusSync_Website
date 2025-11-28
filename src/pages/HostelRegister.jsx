// File: HostelRegister.jsx
import React, { useMemo, useState } from "react";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
const ERP_RED = "#cc2b2b";
const ERP_BLUE = "#1e6fb8";
const ERP_LIGHT = "#f5f7fb";

const Page = styled.div`
  min-height: 100vh;
  background: ${ERP_LIGHT};
  padding: 2px 2px;
  display: flex;
  justify-content: center;
  font-family: Inter, system-ui;
  color: #222;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  background: linear-gradient(90deg, #002087, #df0043);
  border-radius: 10px;
`;

const Wrapper = styled.div`
  width: 9%;
  max-width: 720px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 18px;
  margin-top: 50px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    width: 30px;
    height: 25px;
  }
`;

const Icons2 = styled.div`
  display: flex;
  align-items: center;

  img {
    position: relative;
    width: 27px;
    height: 25px;
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 20px;
  color: white;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
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

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0 15px;
`;

export default function HostelRegister({ student = { name: "Student Name" } }) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // form values
  const [sharing, setSharing] = useState("");
  const [payment, setPayment] = useState("");
  const [premium, setPremium] = useState(false);

  // fee logic
  const baseFee = {
    single: 8000,
    double: 5000,
    triple: 3500,
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
      <AppContainer>
        <HeaderWrapper>
          <Header>
            <Title>Hostel Register</Title>
            <Wrapper style={{ display: "flex" }}>
              <Link to="/dashboard">
                <Icons>
                  <img src={home} alt="home" />
                </Icons>
              </Link>
              <Divider />
              <Icons2 onClick={() => navigate(-1)}>
                <img src={back} alt="back" />
              </Icons2>
            </Wrapper>
          </Header>
        </HeaderWrapper>

        {/* ✅ CARD CENTER WRAPPED HERE */}
        <Wrapper
          style={{
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card>
            <H>Hostel For {student.name}</H>
            <div style={{ marginBottom: 14, color: ERP_BLUE }}>
              Course Details : Master of Computer Applications-(2023-2025)
            </div>

            {!showForm && (
              <Button onClick={() => setShowForm(true)}>REGISTER</Button>
            )}

            {showForm && (
              <div style={{ marginTop: 16 }}>
                <Field>
                  <Label>
                    <input
                      type="checkbox"
                      checked={premium}
                      onChange={(e) => setPremium(e.target.checked)}
                      style={{ marginRight: 6 }}
                    />
                    Premium Room
                  </Label>
                </Field>

                <Field>
                  <Label>Preferred Room Sharing *</Label>
                  <Select
                    value={sharing}
                    onChange={(e) => setSharing(e.target.value)}
                  >
                    <option value="">Select an Option</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </Select>
                </Field>

                <Field>
                  <Label>Payment Type *</Label>
                  <Select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                  >
                    <option value="">Select an Option</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </Select>
                </Field>

                <FeeRow>
                  <strong>Total Fee: </strong>₹ {totalFee}/-
                </FeeRow>
                <FeeRow>
                  <strong>Caution Fee: </strong>₹ {cautionFee}/-
                </FeeRow>

                <Note>* Caution fee not applicable for re-joiners.</Note>

                <Button
                  onClick={() => {
                    alert("Submitted ✓");
                    navigate("/hostel-home");
                  }}
                >
                  Submit Registration
                </Button>
              </div>
            )}
          </Card>
        </Wrapper>
      </AppContainer>
    </Page>
  );
}
