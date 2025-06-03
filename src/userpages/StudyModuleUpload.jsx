import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Card = styled.div`
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  background-color: #fff;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Field = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  padding: 12px;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const FileName = styled.p`
  font-size: 14px;
  color: #555;
  margin-top: 8px;
`;

const StudyModuleUpload = () => {
  const [formData, setFormData] = useState({
    examType: "",
    subject: "",
    topicName: "",
    pdfFile: null,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, pdfFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("examType", formData.examType);
    data.append("subject", formData.subject);
    data.append("topicName", formData.topicName);
    data.append("pdf", formData.pdfFile);

    console.log("Submitting study module:", formData);
    // axios.post('/api/study-modules', data)
  };

  return (
    <Container>
      <Card>
        <form onSubmit={handleSubmit}>
          <Title>Upload Study Module</Title>

          <Field>
            <Label>Exam Type</Label>
            <Select value={formData.examType} onChange={(e) => handleChange("examType", e.target.value)}>
              <option value="">Select exam type</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="CET">CET</option>
            </Select>
          </Field>

          <Field>
            <Label>Subject</Label>
            <Select value={formData.subject} onChange={(e) => handleChange("subject", e.target.value)}>
              <option value="">Select subject</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </Select>
          </Field>

          <Field>
            <Label>Topic Name</Label>
            <Input
              type="text"
              placeholder="Enter topic name"
              value={formData.topicName}
              onChange={(e) => handleChange("topicName", e.target.value)}
            />
          </Field>

          <Field>
            <Label>Upload PDF</Label>
            <Input type="file" accept="application/pdf" onChange={handleFileChange} />
            {formData.pdfFile && <FileName>Selected: {formData.pdfFile.name}</FileName>}
          </Field>

          <Button type="submit">Upload Module</Button>
        </form>
      </Card>
    </Container>
  );
};

export default StudyModuleUpload;
