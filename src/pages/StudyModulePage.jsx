import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import {
  fetchSubjectsByExam,
  fetchTopicsByExamAndSubject,
  fetchPDFUrl, fetchSubTopics,
} from "../api/ClientApi"; // Adjust path as needed

const Container = styled.div`
  padding: 0 15px;
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

const PageTitle = styled.h2`
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

const PDFButton = styled.button`
  margin-right: 10px;
  margin-top: 10px;
  background: #10b981;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #059669;
  }
`;

const DownloadLink = styled.a`
  margin-top: 10px;
  background: #3b82f6;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: #2563eb;
  }
`;

const StudyModuleBrowser = () => {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedTopic, setSelectedTopic] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
    const [subtopics, setSubTopics] = useState([]);
    const [pdfUrlToView, setPdfUrlToView] = useState('');

  const examOptions = ["JEE", "NEET", "CET"];

  useEffect(() => {
    if (selectedExam) {
      fetchSubjectsByExam(selectedExam)
        .then(setSubjects)
        .catch((err) => console.error("Failed to fetch subjects:", err));
      setSelectedSubject("");
            setTopics([]);
            setSelectedTopic('');
            setSubTopics([]);
            setPdfUrlToView('');
    } else {
      setSubjects([]);
      setSelectedSubject("");
            setTopics([]);
            setSelectedTopic('');
            setSubTopics([]);
            setPdfUrlToView('');
    }
  }, [selectedExam]);

  useEffect(() => {
    if (selectedExam && selectedSubject) {
      fetchTopicsByExamAndSubject(selectedExam, selectedSubject)
        .then(setTopics)
        .catch((err) => console.error("Failed to fetch topics:", err));
            setSelectedTopic('');
            setSubTopics([]);
            setPdfUrlToView('');
    } else {
      setTopics([]);
            setSelectedTopic('');
            setSubTopics([]);
            setPdfUrlToView('');
    }
  }, [selectedExam, selectedSubject]);

    useEffect(() => {
        if (selectedExam && selectedSubject && selectedTopic) {
            fetchSubTopics(selectedExam, selectedSubject, selectedTopic)
                .then(setSubTopics)
                .catch((err) => console.error('Failed to fetch subtopics:', err));
            setPdfUrlToView('');
        } else {
            setSubTopics([]);
            setPdfUrlToView('');
        }
    }, [selectedExam, selectedSubject, selectedTopic]);

    const handleViewPDF = (url) => {
        setPdfUrlToView(url);
    };

  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <PageTitle>Study Module Browser</PageTitle>
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

      <Section>
        <SectionTitle>Select Exam</SectionTitle>
        <ButtonGrid>
          {examOptions.map((exam) => (
            <Button
              key={exam}
              className={selectedExam === exam ? "selected" : ""}
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
                className={selectedSubject === subject ? "selected" : ""}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </ButtonGrid>
        </Section>
      )}

            {topics.length > 0 && (
                <Section>
                    <SectionTitle>Select Topic</SectionTitle>
                    <ButtonGrid>
                        {topics.map((topic) => (
                            <Button
                                key={topic}
                                className={selectedTopic === topic ? 'selected' : ''}
                                onClick={() => setSelectedTopic(topic)}
                            >
                                {topic}
                            </Button>
                        ))}
                    </ButtonGrid>
                </Section>
            )}

            {subtopics.length > 0 ? (
                <Section>
                    <SectionTitle>Subtopics</SectionTitle>
                    {subtopics.map((sub, index) => (
                        <TopicCard key={index}>
                            <TopicTitle>{sub.subtitles}</TopicTitle>

                            <PDFButton onClick={() => handleViewPDF(sub.pdfUrl)}>
                                View PDF
                            </PDFButton>

                            <DownloadLink
                                href={sub.pdfUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download PDF
                            </DownloadLink>
                        </TopicCard>
                    ))}
                </Section>
            ) : (
                selectedExam && selectedSubject && selectedTopic && (
                    <p style={{ textAlign: 'center', color: 'gray' }}>
                        No subtopics available for this selection.
                    </p>
                )
            )}

            {pdfUrlToView && (
                <Section>
                    <SectionTitle>PDF Viewer</SectionTitle>
                    <div style={{ height: '600px', border: '1px solid #ccc' }}>
                        <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrlToView)}&embedded=true`}
                            title="PDF Viewer"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button onClick={() => setPdfUrlToView('')}>Close PDF</Button>
                    </div>
                </Section>
            )}
        </Container>
    );
};

export default StudyModuleBrowser;
