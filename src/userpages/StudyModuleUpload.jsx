import React, { useState } from "react";
import styled from "styled-components";
import { uploadStudyModule } from "../api/ClientApi"; // API function to handle module upload

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

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, pdfFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.examType || !formData.subject || !formData.topicName || !formData.pdfFile) {
      alert("Please fill all fields and select a PDF file.");
      return;
    }

    const data = new FormData();
    data.append("examName", formData.examType);
    data.append("subjectName", formData.subject);
    data.append("topicName", formData.topicName);
    data.append("pdf", formData.pdfFile);

    try {
      setUploading(true);
      const response = await uploadStudyModule(data);
      setSuccess("Study module uploaded successfully!");
      console.log("Uploaded module:", response);
      setFormData({
        examType: "",
        subject: "",
        topicName: "",
        pdfFile: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setSuccess("Failed to upload module. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Card>
        <form onSubmit={handleSubmit}>
          <Title>Upload Study Module</Title>

          <Field>
            <Label>Exam Type</Label>
            <Select
              value={formData.examType}
              onChange={(e) => handleChange("examType", e.target.value)}
            >
              <option value="">Select exam type</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="CET">CET</option>
            </Select>
          </Field>

          <Field>
            <Label>Subject</Label>
            <Select
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
            >
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
            {formData.pdfFile && (
              <FileName>Selected: {formData.pdfFile.name}</FileName>
            )}
          </Field>

          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Module"}
          </Button>

          {success && <p style={{ marginTop: "10px" }}>{success}</p>}
        </form>
      </Card>
    </Container>
  );
};

export default StudyModuleUpload;