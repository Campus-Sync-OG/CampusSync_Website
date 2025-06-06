import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const attendanceData = {
  subject: "Social Science",
  class: "Class 9, Sec-A",
  date: "03 Jan 2023",
  status: "Completed",
  submittedOn: "12:24 AM | 23 December 2024",
  total: 40,
  present: 34,
  absent: 6,
  students: Array(10)
    .fill({
      id: "TIPSGRM1012223",
      name: "Anubhav Dubey",
      attendance: "Present",
    })
    .map((s, i) => (i === 2 || i === 5 ? { ...s, attendance: "Absent" } : s)),
};

const TeacherAttendanceDownload = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const header = [
      `Subject: ${attendanceData.subject}`,
      `Class: ${attendanceData.class}`,
      `Date: ${attendanceData.date}`,
      `Status: ${attendanceData.status}`,
      `Total Students: ${attendanceData.total}`,
      `Present: ${attendanceData.present}`,
      `Absent: ${attendanceData.absent}`,
      "", // empty line for spacing
      "Student ID,Student Name,Attendance",
    ];

    const rows = attendanceData.students.map((student) =>
      [student.id, student.name, student.attendance].join(",")
    );

    const csvContent = [...header, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Attendance Report</HeaderTitle>
        <IconsContainer>
          <ImageIcon
            src={homeIcon}
            alt="Home"
            onClick={() => navigate("/teacher-dashboard")}
          />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </Header>

      <Content>
        <PageTitle>Attendance Report</PageTitle>
        <SubmittedNote>
          Report Submitted on {attendanceData.submittedOn}
        </SubmittedNote>

        <SubInfo>
          <SubjectLine>
            <strong>{attendanceData.subject}</strong>
          </SubjectLine>
          <DetailGroup>
            <Detail>{attendanceData.class}</Detail>
            <Detail>{attendanceData.date}</Detail>
            <Detail>
              Status: <span>{attendanceData.status}</span>
            </Detail>
            <DownloadButton onClick={handleDownload}>
              📥 Download Report
            </DownloadButton>
          </DetailGroup>
        </SubInfo>

        <Summary>
          <p>Total Students : {attendanceData.total}</p>
          <p>
            <Green>Present : {attendanceData.present}</Green>{" "}
            <Red>Absent : {attendanceData.absent}</Red>
          </p>
        </Summary>

        <TableSection>
          <h3>Attendance Details</h3>
          <StyledTable>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.students.map((student, index) => (
                <tr key={index}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>
                    <StatusLabel present={student.attendance === "Present"}>
                      {student.attendance}
                    </StatusLabel>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableSection>
      </Content>
    </Container>
  );
};

export default TeacherAttendanceDownload;

/* Styled Components */
const Container = styled.div`
  padding: 0 10px;
  max-width: 100%;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 20px;
  border-radius: 10px;
`;

const HeaderTitle = styled.h2`
  color: white;
  font-size: 26px;
  font-family: "Poppins";
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background: white;
  margin: 0 10px;
`;

const ImageIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 20px;
  font-family: Poppins;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SubmittedNote = styled.p`
  font-size: 14px;
  color: #00c18c;
  margin-bottom: 20px;
`;

const SubInfo = styled.div`
  margin-bottom: 20px;
`;

const SubjectLine = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const DetailGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
`;

const Detail = styled.span`
  background: #f2f2f2;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
`;

const DownloadButton = styled.button`
  background-color: #00c18c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
`;

const Summary = styled.div`
  font-size: 16px;
  margin: 20px 0;
`;

const Green = styled.span`
  color: green;
  margin-right: 20px;
`;

const Red = styled.span`
  color: red;
`;

const TableSection = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
`;

const StatusLabel = styled.span`
  background-color: ${(props) => (props.present ? "#d0f5e8" : "#ffd6d6")};
  color: ${(props) => (props.present ? "green" : "red")};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
`;
