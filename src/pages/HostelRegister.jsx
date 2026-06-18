import React, { useMemo, useState } from "react";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { applyHostel } from "../api/ClientApi";

/* =======================
   COLORS
======================= */
const ERP_RED = "#cc2b2b";
const ERP_BLUE = "#1e6fb8";
const ERP_LIGHT = "#f5f7fb";

/* =======================
   ENUM OPTIONS (MATCH BACKEND)
======================= */
const SHARING_OPTIONS = [
  "Single",
  "Double",
  "Triple",
  "3 Sharing",
  "4 Sharing",
];

const PAYMENT_OPTIONS = [
  "Online",
  "Offline",
  "Cash",
  "UPI",
  "Netbanking",
];

/* =======================
   STYLES
======================= */
const Page = styled.div`
  min-height: 100vh;
  background: ${ERP_LIGHT};
  display: flex;
  justify-content: center;
`;

const AppContainer = styled.div`
  width: 100%;
  padding: 0 15px;
`;

const HeaderWrapper = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icons = styled.div`
  width: 25px;
  cursor: pointer;

  img {
    width: 28px;
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background: white;
  margin: 0 10px;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 10px;
  padding: 22px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
`;

const H = styled.h2`
  color: ${ERP_RED};
  font-size: 18px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background: ${ERP_RED};
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const Field = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid #dcdcdc;
  margin-top: 6px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid #dcdcdc;
`;

const FeeRow = styled.div`
  background: #f7f7f7;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const Note = styled.p`
  font-size: 13px;
  color: #555;
`;

/* =======================
   COMPONENT
======================= */
export default function HostelRegister() {
  const navigate = useNavigate();

  // ✅ SAME LOGIC AS ASSIGNMENTS PAGE (WORKING)
  const userData = JSON.parse(localStorage.getItem("user"));
  const admission_no = userData?.unique_id;

  const [showForm, setShowForm] = useState(false);
  const [preferred_sharing, setPreferredSharing] = useState("");
  const [payment_type, setPaymentType] = useState("");
  const [premium_room, setPremiumRoom] = useState(false);
  const [is_rejoiner, setIsRejoiner] = useState(false);
  const [remarks, setRemarks] = useState("");

  /* =======================
     FEES
  ======================= */
  const baseFee = {
    Single: 8000,
    Double: 5000,
    Triple: 3500,
    "3 Sharing": 3000,
    "4 Sharing": 2500,
  };

  const total_fee = useMemo(() => {
    let fee = baseFee[preferred_sharing] || 0;
    if (premium_room) fee += 1500;
    return fee;
  }, [preferred_sharing, premium_room]);

  const caution_fee = is_rejoiner ? 0 : total_fee ? 2000 : 0;

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = async () => {
    const payload = {
      admission_no,        // 🔥 FIXED
      premium_room,
      preferred_sharing,
      payment_type,
      total_fee,
      caution_fee,
      is_rejoiner,
      remarks,
    };

    console.log("Submitting hostel payload:", payload);

    try {
      await applyHostel(payload);
      alert("Hostel application submitted successfully ✅");
      navigate("/hostel-home");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Submission failed");
    }
  };

  return (
    <Page>
      <AppContainer>
        <HeaderWrapper>
          <Header>
            <Title>Hostel Register</Title>
            <Wrapper>
              <Link to="/dashboard">
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
        </HeaderWrapper>

        <CardWrapper>
          <Card>
            <H>Hostel Registration</H>

            {!showForm && (
              <Button onClick={() => setShowForm(true)}>REGISTER</Button>
            )}

            {showForm && (
              <>
                <Field>
                  <Label>Preferred Sharing *</Label>
                  <Select
                    value={preferred_sharing}
                    onChange={(e) => setPreferredSharing(e.target.value)}
                  >
                    <option value="">Select</option>
                    {SHARING_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </Field>

                <Field>
                  <Label>Payment Type *</Label>
                  <Select
                    value={payment_type}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option value="">Select</option>
                    {PAYMENT_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                </Field>

                <Field>
                  <Label>
                    <input
                      type="checkbox"
                      checked={premium_room}
                      onChange={(e) => setPremiumRoom(e.target.checked)}
                      style={{ marginRight: 6 }}
                    />
                    Premium Room
                  </Label>
                </Field>

                <Field>
                  <Label>
                    <input
                      type="checkbox"
                      checked={is_rejoiner}
                      onChange={(e) => setIsRejoiner(e.target.checked)}
                      style={{ marginRight: 6 }}
                    />
                    Re-joiner
                  </Label>
                </Field>

                <FeeRow><strong>Total Fee:</strong> ₹ {total_fee}</FeeRow>
                <FeeRow><strong>Caution Fee:</strong> ₹ {caution_fee}</FeeRow>

                <Field>
                  <Label>Remarks</Label>
                  <TextArea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Field>

                <Note>* Caution fee not applicable for re-joiners</Note>

                <Button onClick={handleSubmit}>Submit Registration</Button>
              </>
            )}
          </Card>
        </CardWrapper>
      </AppContainer>
    </Page>
  );
}
