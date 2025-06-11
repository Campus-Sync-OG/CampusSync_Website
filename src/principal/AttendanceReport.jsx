import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getAllClassSections,
  getClassAttendance,
  getAttendancePercentage,
  downloadAttendanceCSV,
  updateAttendancePercentage,
} from "../api/ClientApi"; // make sure this has updateAttendancePercentage
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

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
  const [reportType, setReportType] = useState("date");
  const [updatedPercentages, setUpdatedPercentages] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        const uniqueClasses = Array.from(
          new Set(data.map((item) => item.className))
        ).map((cls) => ({ className: cls }));
        const uniqueSections = Array.from(
          new Set(data.map((item) => item.section_name))
        ).map((sec) => ({ section_name: sec }));
        setClassSections(uniqueClasses);
        setSelectedClassSection(uniqueSections);
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };
    fetchClassSections();
  }, []);

  const formatDateToYMD = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const handleFetch = async () => {
    if (!selectedClass || !selectedSection) {
      setError("Please select Class and Section.");
      setAttendanceData(null);
      return;
    }

    if (reportType === "date" && !selectedDate) {
      setError("Please select a Date.");
      setAttendanceData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setAttendanceData(null);

    try {
      let data;
      if (reportType === "date") {
        const formattedDate = formatDateToYMD(selectedDate);
        data = await getClassAttendance(
          selectedClass,
          selectedSection,
          formattedDate
        );
      } else {
        data = await getAttendancePercentage(selectedClass, selectedSection);
      }

      setAttendanceData(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedClass || !selectedDate) {
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

  const handlePercentageChange = (admission_no, value) => {
    setUpdatedPercentages((prev) => ({ ...prev, [admission_no]: value }));
  };

  const handleUpdatePercentages = async () => {
    try {
      setUpdating(true);

      const updates = attendanceData.data.map(async (student) => {
        let { admission_no, percentage, present_days, total_days } = student;

        if (percentage === undefined || percentage === null) {
          const calculated = Math.round(
            (present_days / (total_days || 1)) * 100
          );

          // Call backend to save
          return updateAttendancePercentage(admission_no, calculated);
        }
      });

      await Promise.all(updates);
      alert("All percentages updated successfully.");
    } catch (err) {
      console.error("Failed to update percentages:", err);
      alert("Failed to update percentages.");
    } finally {
      setUpdating(false);
    }
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
                <option key={cls.className} value={cls.className}>
                  {cls.className}
                </option>
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
                <option key={sec.section_name} value={sec.section_name}>
                  {sec.section_name}
                </option>
              ))}
            </Select>
          </Label>

          <Label>
            Report Type:
            <Select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setAttendanceData(null);
                setError(null);
              }}
            >
              <option value="date">Date-wise</option>
              <option value="all">All</option>
            </Select>
          </Label>

          {reportType === "date" && (
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
          )}

          <FetchButton onClick={handleFetch} disabled={loading}>
            {loading ? "Loading..." : "Fetch Report"}
          </FetchButton>
        </FormSection>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        {attendanceData && (
          <>
            {attendanceData.summary && (
              <Summary>
                <p>Total Students : {attendanceData.summary.total_students}</p>
                {reportType === "date" && (
                  <p>
                    <Green>Present : {attendanceData.summary.present}</Green>{" "}
                    <Red>Absent : {attendanceData.summary.absent}</Red>
                  </p>
                )}
              </Summary>
            )}

            <TableSection>
              <h3>Attendance Details</h3>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Attendance</th>
                    {reportType === "all" && <th>Percentage</th>}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(attendanceData.data) &&
                  attendanceData.data.length > 0 ? (
                    attendanceData.data.map((student, index) => (
                      <tr key={index}>
                        <td>{student.admission_no}</td>
                        <td>{student.student_name}</td>
                        <td>
                          <StatusLabel present={student.status === "Present"}>
                            {student.status}
                          </StatusLabel>
                        </td>
                        {reportType === "all" && (
                          <td>
                            <input
                              type="number"
                              value={
                                updatedPercentages[student.admission_no] ||
                                student.percentage ||
                                0
                              }
                              onChange={(e) =>
                                handlePercentageChange(
                                  student.admission_no,
                                  e.target.value
                                )
                              }
                              style={{ width: "60px" }}
                            />
                            %
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={reportType === "all" ? 4 : 3}
                        style={{ textAlign: "center", color: "gray" }}
                      >
                        No attendance details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </StyledTable>
              {reportType === "date" && (
                <DownloadButton onClick={handleDownload} disabled={loading}>
                  📥 Download Report
                </DownloadButton>
              )}
              {reportType === "all" && (
                <DownloadButton
                  onClick={handleUpdatePercentages}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "✅ Update Percentages"}
                </DownloadButton>
              )}
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
  padding: 0 10px;
  max-width: 100%;
`;
const Content = styled.div`
  margin-top: 20px;
`;
const FormSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;
const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
`;

const Select = styled.select`
  margin-top: 5px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
`;

const InputDate = styled.input`
  margin-top: 5px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
`;

const FetchButton = styled.button`
  padding: 8px 16px;
  background-color: #002087;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  margin-top: 22px;
  cursor: pointer;

  &:disabled {
    background-color: #7f8fa6;
    cursor: not-allowed;
  }
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
  margin-top: 10px;

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
