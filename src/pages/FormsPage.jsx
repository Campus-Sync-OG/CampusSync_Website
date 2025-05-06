import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { submitFeedback } from "../api/ClientApi";

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 80vh; /* Set max height for scroll */
  overflow-y: auto; /* Enable vertical scroll */

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(to right, #002f86, #d30046);
  border-radius: 8px 8px 0 0;
`;

const Title = styled.h2`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 15px;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Section = styled.div`
  padding: 20px;
`;

const Subtitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
`;

const RadioInput = styled.input`
  margin-right: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  resize: none;
`;

const Button = styled.button`
  background: #d30046;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #b0003a;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHead = styled.thead`
  background: #002f86;
  color: white;
`;

const TableRow = styled.tr`
  border-top: 1px solid #ddd;
`;

const TableHeader = styled.th`
  padding: 12px;
  font-weight: bold;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  color: ${(props) => (props.status === "Not Filled" ? "red" : "#555")};
`;

const ExternalLink = styled.a`
  color: red;
  text-decoration: underline;
  font-weight: bold;
`;
const ErrorText = styled.p`
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
`;


const SuccessText = styled.p`
  color: green;
`;


export default function FeedbackForm() {
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const tableData = [
    { id: 1, title: "Annual day 2024 experience feedback", link: "www.forms.a23.com", status: "Not Filled" },
    { id: 2, title: "Dance Club membership form", link: "www.forms.a23.com", status: "Filled" },
    { id: 3, title: "National olympiad participation", link: "www.forms.a23.com", status: "Filled" },
  ];

  const handleSubmit = async () => {
    if (feedbackText.trim() === "") return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const payload = { message: feedbackText };

      await submitFeedback(payload);

      setSuccessMsg("Feedback submitted successfully!");
      setFeedbackText("");  // Reset the feedback text after submission
    } catch (error) {
      setErrorMsg("Failed to submit feedback. Please try again.");
      console.error("Feedback Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Forms/Feedback</Title>
        <IconWrapper>
          <Link to="/dashboard">
            <IconImage src={home} alt="home" />
          </Link>
          <Link to="/dashboard">
            <IconImage src={back} alt="back" />
          </Link>
        </IconWrapper>
      </Header>

      <Section>
        <Subtitle>Describe your feedback *</Subtitle>
        <TextArea
          placeholder="Type your feedback here..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          disabled={submitting}
        />
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>

        {successMsg && <SuccessText>{successMsg}</SuccessText>}
        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
      </Section>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Sl no</TableHeader>
            <TableHeader>Form Title</TableHeader>
            <TableHeader>Link</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {tableData.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>
                <ExternalLink href={`http://${row.link}`} target="_blank">
                  {row.link}
                </ExternalLink>
              </TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}