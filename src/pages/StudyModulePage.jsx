import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchSubjectsByExam, fetchTopicsByExamAndSubject, fetchPDFUrlById } from '../api/ClientApi'; // Adjust path as needed

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
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);

    const examOptions = ['JEE', 'NEET', 'CET'];

    useEffect(() => {
        if (selectedExam) {
            fetchSubjectsByExam(selectedExam)
                .then(setSubjects)
                .catch((err) => console.error('Failed to fetch subjects:', err));
            setSelectedSubject('');
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedExam]);

    useEffect(() => {
        if (selectedExam && selectedSubject) {
            fetchTopicsByExamAndSubject(selectedExam, selectedSubject)
                .then(setTopics)
                .catch((err) => console.error('Failed to fetch topics:', err));
        } else {
            setTopics([]);
        }
    }, [selectedExam, selectedSubject]);

    const handleViewPDF = async (topicName) => {
        try {
            const res = await fetchPDFUrlById(topicName); // calls `/modules/download/:topicName`
            if (res.url) {
                window.open(res.url, '_blank'); // ✅ Opens the PDF in a new tab
            } else {
                alert('PDF URL not found');
            }
        } catch (err) {
            console.error('Failed to fetch PDF URL', err);
            alert('Failed to open PDF');
        }
    };

    return (
        <Container>
            <Title>Study Module Browser</Title>

            <Section>
                <SectionTitle>Select Exam</SectionTitle>
                <ButtonGrid>
                    {examOptions.map((exam) => (
                        <Button
                            key={exam}
                            className={selectedExam === exam ? 'selected' : ''}
                            onClick={() => setSelectedExam(exam)}
                        >
                            {exam}
                        </Button>
                    ))}
                </ButtonGrid>
            </Section>

            {subjects.length > 0 && (
                <Section>
                    <SectionTitle>Select Subject</SectionTitle>
                    <ButtonGrid>
                        {subjects.map((subject) => (
                            <Button
                                key={subject}
                                className={selectedSubject === subject ? 'selected' : ''}
                                onClick={() => setSelectedSubject(subject)}
                            >
                                {subject}
                            </Button>
                        ))}
                    </ButtonGrid>
                </Section>
            )}

            {topics.length > 0 ? (
                <Section>
                    <SectionTitle>Topics</SectionTitle>
                    {topics.map((topic, index) => (
                        <TopicCard key={index}>
                            <TopicTitle>{topic.topicName}</TopicTitle>
                            <PDFButton onClick={() => handleViewPDF(topic.topicName)}>
                                View PDF
                            </PDFButton>
                            <PDFButton
                                href={topic.pdfUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download PDF
                            </PDFButton>
                        </TopicCard>
                    ))}
                </Section>
            ) : (
                selectedExam &&
                selectedSubject && (
                    <p style={{ textAlign: 'center', color: 'gray' }}>
                        No topics available for this selection.
                    </p>
                )
            )}
        </Container>
    );
};

export default StudyModuleBrowser;