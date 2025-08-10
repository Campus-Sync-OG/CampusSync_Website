import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { submitLeaveApplication } from "../api/ClientApi"; // Adjust path as needed
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const StudentLeaveApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = "Leave type is required";
    if (!formData.fromDate) newErrors.fromDate = "From date is required";
    if (!formData.toDate) newErrors.toDate = "To date is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const getAdmissionNo = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.unique_id || "";
  };
  const admission_no = getAdmissionNo();
  console.log("Admission No:", admission_no);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  // Date validation: End date cannot be earlier than start date
  const start = new Date(formData.fromDate);
  const end = new Date(formData.toDate);

  if (end < start) {
    alert("End date cannot be earlier than the start date!");
    return; // Stop submission
  }

  try {
    const payload = {
      admission_no, // adjust based on how you store admission_no
      reason: formData.reason,
      from_date: formData.fromDate,
      to_date: formData.toDate,
      leave_type: formData.leaveType,
    };

    const response = await submitLeaveApplication(payload);
    setSuccessMessage(response.message);
    alert(response.message);
    setFormData({
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
    });
    setErrors({});
  } catch (err) {
    console.error("Failed to submit leave application:", err);
    alert("Failed to submit leave application.");
  }
};


  return (
    <FormContainer>
      <HeaderWrapper>
        <Header>
          <Title>Student Leave Application</Title>
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

      {successMessage && <SuccessText>{successMessage}</SuccessText>}

      <StyledForm onSubmit={handleSubmit}>
        <Label>Leave Type</Label>
        <Select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
        >
          <option value="">Select Leave Type</option>
          <option value="Casual">Casual Leave</option>
          <option value="Sick">Sick Leave</option>
        </Select>
        {errors.leaveType && <ErrorText>{errors.leaveType}</ErrorText>}

        <Label>From Date</Label>
        <InputField
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
        />
        {errors.fromDate && <ErrorText>{errors.fromDate}</ErrorText>}

        <Label>To Date</Label>
        <InputField
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
        />
        {errors.toDate && <ErrorText>{errors.toDate}</ErrorText>}

        <Label>Reason</Label>
        <TextArea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows="4"
        />
        {errors.reason && <ErrorText>{errors.reason}</ErrorText>}

        <SubmitButton type="submit">Apply for Leave</SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default StudentLeaveApplication;


export const FormContainer = styled.div`
  padding: 0 15px;
  border-radius: 16px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  background: linear-gradient(90deg, #002087, #df0043);
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 20px;
  color: white;
`;

const Title = styled.h2`
  font-size: 26px;
  font-family: "Poppins";
  font-weight: 600;
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 2px;
  height: 25px;
  background-color: white;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 600;
  color: #34495e;
`;

export const InputField = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  max-width:550px;
`;

export const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

export const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  max-width:570px;
`;

export const SubmitButton = styled.button`
  margin-top: 25px;
  padding: 12px;
  background-color: #df0043;
  color: white;
  border: none;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #002087;
  }
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const SuccessText = styled.div`
  color: green;
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
`;

