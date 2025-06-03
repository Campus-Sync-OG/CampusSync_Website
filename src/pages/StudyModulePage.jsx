import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 10px 18px;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &.selected {
    background-color: #1e40af;
  }
`;

const TopicCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  background: #f9fafb;
`;

const TopicTitle = styled.p`
  font-weight: 500;
  font-size: 16px;
`;

const PDFButton = styled.a`
  margin-top: 10px;
  display: inline-block;
  background: #10b981;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    background: #059669;
  }
`;

const StudyModuleBrowser = () => {
  const [examTypes, setExamTypes] = useState(["JEE", "NEET", "CET"]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Mock subject fetch based on selected exam type
  useEffect(() => {
    if (!selectedExam) return;
    // Replace this with an API call
    const data = {
      JEE: ["Physics", "Chemistry", "Mathematics"],
      NEET: ["Biology", "Physics", "Chemistry"],
      CET: ["Maths", "Electronics"],
    };
    setSubjects(data[selectedExam] || []);
    setSelectedSubject("");
    setTopics([]);
  }, [selectedExam]);

  // Mock topic fetch based on selected subject
  useEffect(() => {
    if (!selectedSubject) return;
    // Replace with an API call
    const mockTopics = {
      Physics: [
        { name: "Kinematics", pdfUrl: "/pdfs/kinematics.pdf" },
        { name: "Dynamics", pdfUrl: "/pdfs/dynamics.pdf" },
      ],
      Chemistry: [
        { name: "Organic Chemistry", pdfUrl: "/pdfs/organic.pdf" },
        { name: "Inorganic Chemistry", pdfUrl: "/pdfs/inorganic.pdf" },
      ],
      Biology: [{ name: "Cell Biology", pdfUrl: "/pdfs/cell.pdf" }],
    };
    setTopics(mockTopics[selectedSubject] || []);
  }, [selectedSubject]);

  return (
    <Container>
      <Title>Study Modules</Title>

      {/* Exam Type Selection */}
      <Section>
        <SectionTitle>Select Exam Type</SectionTitle>
        <ButtonGrid>
          {examTypes.map((exam) => (
            <Button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={selectedExam === exam ? "selected" : ""}
            >
              {exam}
            </Button>
          ))}
        </ButtonGrid>
      </Section>

      {/* Subject Selection */}
      {selectedExam && (
        <Section>
          <SectionTitle>Select Subject</SectionTitle>
          <ButtonGrid>
            {subjects.map((subj) => (
              <Button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={selectedSubject === subj ? "selected" : ""}
              >
                {subj}
              </Button>
            ))}
          </ButtonGrid>
        </Section>
      )}

      {/* Topics */}
      {selectedSubject && (
        <Section>
          <SectionTitle>Available Topics</SectionTitle>
          {topics.length > 0 ? (
            topics.map((topic) => (
              <TopicCard key={topic.name}>
                <TopicTitle>{topic.name}</TopicTitle>
                <PDFButton href={topic.pdfUrl} target="_blank" rel="noopener noreferrer">
                  View / Download PDF
                </PDFButton>
              </TopicCard>
            ))
          ) : (
            <p>No topics available.</p>
          )}
        </Section>
      )}
    </Container>
  );
};

export default StudyModuleBrowser;
