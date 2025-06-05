import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import {
  getClassAttendance,
  downloadAttendanceCSV,
  getAllClassSections,
} from "../api/ClientApi";

// Utility to format date to YYYY/MM/DD
const formatDateToYMD = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
};

const TeacherAttendanceDownload = () => {
  const navigate = useNavigate();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedClassSection, setSelectedClassSection] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        const uniqueClasses = Array.from(new Set(data.map(item => item.className)))
          .map(cls => ({ className: cls }));
        const uniqueSections = Array.from(new Set(data.map(item => item.section_name)))
          .map(sec => ({ section_name: sec }));
        setClassSections(uniqueClasses);
        setSelectedClassSection(uniqueSections);
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };
    fetchClassSections();
  }, []);

  const handleFetch = async () => {
    if (!selectedClass || !selectedDate) {
      setError("Please select Class, Section, and Date.");
      setAttendanceData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setAttendanceData(null);

    try {
      const formattedDate = formatDateToYMD(selectedDate);
      const data = await getClassAttendance(selectedClass, selectedSection, formattedDate);
      console.log("Fetched Attendance Data:", data);
      setAttendanceData(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedClass || !selectedSection || !selectedDate) {
      setError("Please select Class, Section, and Date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedDate = formatDateToYMD(selectedDate);

      const response = await downloadAttendanceCSV(
        selectedClass,
        selectedSection,
        formattedDate
      );

      // 🟢 Success case — download file
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "attendance_report.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      // 🔴 Handle error if file is not downloaded
      if (
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type === "application/json"
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorMsg = JSON.parse(reader.result);
            console.error("Server Error:", errorMsg.message);
            alert(errorMsg.message);
          } catch (jsonErr) {
            alert(`Download failed. Error: ${reader.result}`);
          }
        };
        reader.readAsText(error.response.data);
      } else {
        console.error("Unexpected Error:", error);
        alert("Something went wrong while downloading the file.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Attendance Report</HeaderTitle>
        <IconsContainer>
          <ImageIcon src={homeIcon} alt="Home" onClick={() => navigate("/teacher-dashboard")} />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </Header>

      <Content>
        <FormSection>
          <Label>
            Select Class:
            <Select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection("");
                setAttendanceData(null);
                setError(null);
              }}
            >
              <option value="">-- Select Class --</option>
              {classSections.map((cls) => (
                <option key={cls.className} value={cls.className}>{cls.className}</option>
              ))}
            </Select>
          </Label>

          <Label>
            Select Section:
            <Select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setAttendanceData(null);
                setError(null);
              }}
              disabled={!selectedClass}
            >
              <option value="">-- Select Section --</option>
              {selectedClassSection.map((sec) => (
                <option key={sec.section_name} value={sec.section_name}>{sec.section_name}</option>
              ))}
            </Select>
          </Label>

          <Label>
            Select Date:
            <InputDate
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setAttendanceData(null);
                setError(null);
              }}
            />
          </Label>

          <FetchButton onClick={handleFetch} disabled={loading}>
            {loading ? "Loading..." : "Fetch Report"}
          </FetchButton>
        </FormSection>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        {attendanceData && (
          <>
            <Summary>
              <p>Total Students : {attendanceData.summary.total_students}</p>
              <p>
                <Green>Present : {attendanceData.summary.present}</Green>{" "}
                <Red>Absent : {attendanceData.summary.absent}</Red>
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
                  {Array.isArray(attendanceData.data) && attendanceData.data.length > 0 ? (
                    attendanceData.data.map((student, index) => (
                      <tr key={index}>
                        <td>{student.admission_no}</td>
                        <td>{student.student_name}</td>
                        <td>
                          <StatusLabel present={student.status === "Present"}>
                            {student.status}
                          </StatusLabel>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center", color: "gray" }}>
                        No attendance details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </StyledTable>
              <DownloadButton onClick={handleDownload} disabled={loading}>
                📥 Download Report
              </DownloadButton>
            </TableSection>
          </>
        )}
      </Content>
    </Container>
  );
};

export default TeacherAttendanceDownload;

// Styled components declarations (you can keep your existing ones)

const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 15px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  margin: 0;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ImageIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background-color: #ccc;
  margin: 0 10px;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const FormSection = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  margin-bottom: 10px;
  min-width: 150px;
`;

const Select = styled.select`
  padding: 6px;
  margin-top: 5px;
`;

const InputDate = styled.input`
  padding: 6px;
  margin-top: 5px;
`;

const FetchButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  margin-top: 22px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  &:disabled {
    background-color: #a0c8ff;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  margin-top: 15px;
`;

const PageTitle = styled.h3`
  margin-top: 30px;
  margin-bottom: 10px;
`;

const SubmittedNote = styled.p`
  font-size: 0.9em;
  color: gray;
`;

const SubInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubjectLine = styled.div`
  font-size: 1.1em;
`;

const DetailGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Detail = styled.div`
  font-size: 0.9em;
`;

const DownloadButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:disabled {
    background-color: #98d5a9;
    cursor: not-allowed;
  }
`;

const Summary = styled.div`
  margin-top: 20px;
  font-size: 1em;
`;

const Green = styled.span`
  color: green;
  font-weight: bold;
`;

const Red = styled.span`
  color: red;
  font-weight: bold;
`;

const TableSection = styled.div`
  margin-top: 25px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const StatusLabel = styled.span`
  color: ${(props) => (props.present ? "green" : "red")};
  font-weight: bold;
`;

