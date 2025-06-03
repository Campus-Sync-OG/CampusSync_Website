import React, { useState } from "react";
import styled from "styled-components";

const StudentLeaveApplication = () => {
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

const handleSubmit = async (e) => {
  e.preventDefault();
 

 
};
  return (
    <FormContainer>
      <FormTitle>Student Leave Application</FormTitle>
      <StyledForm onSubmit={handleSubmit}>
        <Label>Leave Type</Label>
        <Select name="leaveType" value={formData.leaveType} onChange={handleChange}>
          <option value="">Select Leave Type</option>
          <option value="Casual">Casual Leave</option>
          <option value="Sick">Sick Leave</option>
          
        </Select>
        {errors.leaveType && <ErrorText>{errors.leaveType}</ErrorText>}

        <Label>From Date</Label>
        <InputField type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} />
        {errors.fromDate && <ErrorText>{errors.fromDate}</ErrorText>}

        <Label>To Date</Label>
        <InputField type="date" name="toDate" value={formData.toDate} onChange={handleChange} />
        {errors.toDate && <ErrorText>{errors.toDate}</ErrorText>}

        <Label>Reason</Label>
        <TextArea name="reason" value={formData.reason} onChange={handleChange} rows="4" />
        {errors.reason && <ErrorText>{errors.reason}</ErrorText>}

        <SubmitButton type="submit">Apply for Leave</SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default StudentLeaveApplication;


export const FormContainer = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`;

export const FormTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
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
  background-color: #2ecc71;
  color: white;
  border: none;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

