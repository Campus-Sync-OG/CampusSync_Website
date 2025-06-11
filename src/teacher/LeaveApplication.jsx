import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { applyTeacherLeave } from "../api/ClientApi"; // Update with actual path

const LeaveApplication = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      fromDate: today,
      toDate: tomorrow,
    }));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = "Leave type is required";
    if (!formData.fromDate) newErrors.fromDate = "From date is required";
    if (!formData.toDate) newErrors.toDate = "To date is required";
    if (formData.fromDate && formData.toDate && formData.toDate < formData.fromDate) {
      newErrors.toDate = "To date cannot be before From date";
    }
    if (!formData.reason) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validate()) return;

    const payload = {
      from_date: formData.fromDate,
      to_date: formData.toDate,
      reason: formData.reason,
      leave_type: formData.leaveType,
    };

    try {
      const response = await applyTeacherLeave(payload);
      if (response.success) {
        setSuccessMessage("Leave applied successfully.");
        setFormData({ leaveType: "", fromDate: "", toDate: "", reason: "" });
      } else {
        setSuccessMessage("Something went wrong while applying for leave.");
      }
    } catch (err) {
      console.error("Error submitting leave:", err);
      setSuccessMessage("Something went wrong while applying for leave.");
    }
  };

  return (
    <>
      <Header>
        <Title>Teacher Leave Application</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
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

      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <Label>Leave Type</Label>
          <Select name="leaveType" value={formData.leaveType} onChange={handleChange}>
            <option value="">Select Leave Type</option>
            <option value="Casual">Casual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Earned">Earned Leave</option>
            <option value="Maternity">Maternity Leave</option>
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
          {successMessage && <SuccessText>{successMessage}</SuccessText>}
        </StyledForm>
      </FormContainer>
    </>
  );
};

export default LeaveApplication;

// Styled Components

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 5px 18px;
  color: white;
  border-radius: 10px;
  margin: 0 15px;
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

export const FormContainer = styled.div`
  padding: 0 15px;
  border-radius: 10px;
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
`;

export const SubmitButton = styled.button`
  margin-top: 25px;
  padding: 12px;
  background-color: #002087;
  color: white;
  border: none;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #df0043;
  }
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

export const SuccessText = styled.p`
  color: green;
  font-size: 15px;
  margin-top: 10px;
`;
