// src/pages/TeacherBulkMarksEntry.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import {
  getAllClassSections,
  getAllSubjects,
  getStudentsByClassAndSection,
  uploadAcademicsCSV,
  submitMarksForApproval,
  fetchNotificationsForCurrentUser,
} from "../api/ClientApi";

/* ---------- Styles (same as your original) ---------- */
const Container = styled.div` padding: 0 15px; `;
const Title = styled.h2` font-size: 26px; font-weight: 600; font-family: "Poppins"; `;
const FormRow = styled.div` display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; `;
const Select = styled.select` padding: 10px; font-size: 16px; width: 150px; `;
const Input = styled.input` padding: 10px; font-size: 16px; width: 200px; `;
const Button = styled.button`
  padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: rgb(57, 0, 179);
  color: white; border: none; border-radius: 4px;
  &:hover { background-color: rgb(179, 0, 0); }
`;
const Table = styled.table` width: 100%; border-collapse: collapse; margin-top: 20px; `;
const Th = styled.th` padding: 10px; text-align: left; border: 1px solid #ddd; background-color: #f2f2f2; `;
const Td = styled.td` padding: 10px; border: 1px solid #ddd; `;
const MarkInput = styled(Input)` width: 100px; `;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043); padding: 1px 20px; color: white; border-radius: 8px;
`;
const Wrapper = styled.div` display: flex; align-items: center; `;
const Icons = styled.div` cursor: pointer; margin: 0 10px; img { width: 30px; height: 30px; } `;
const Divider = styled.div` width: 2px; height: 30px; background-color: white; `;
const StatusBadge = styled.div`
  display:inline-block;padding:6px 10px;border-radius:8px;margin-left:12px;
  background: ${p => p.status === "approved" ? "#2e7d32" : p.status === "rejected" ? "#e53935" : "#ff9800"};
  color: white;font-weight:600;
`;

/* ---------- Component ---------- */
const TeacherBulkMarksEntry = () => {
  const navigate = useNavigate();

  // form state
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examFormat, setExamFormat] = useState("");
  const [academicYear] = useState("2024-25");
  const [examDate, setExamDate] = useState("");
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  // lookups
  const [classSections, setClassSections] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState([]);
  const [subjectList, setSelectedSubjects] = useState([]);

  // submission / polling state
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | pending | approved | rejected
  const [reviewComments, setReviewComments] = useState(null);
  const [polling, setPolling] = useState(false);
  const pollingRef = useRef(null);
  const lastSubmissionMetaRef = useRef(null); // { notificationId, subject, class_grade, section, exam_format }

  // load class/section list
  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        const uniqueClasses = Array.from(new Set(data.map((item) => item.className))).map((cls) => ({ className: cls }));
        const uniqueSections = Array.from(new Set(data.map((item) => item.section_name))).map((sec) => ({ section_name: sec }));
        setClassSections(uniqueClasses);
        setSelectedClassSection(uniqueSections);
      } catch (err) {
        console.error("Failed to fetch class sections:", err);
      }
    };
    fetchClassSections();
  }, []);

  // load subjects
  useEffect(() => {
    getAllSubjects()
      .then((data) => {
        const allSubjects = data.subjects?.map((s) => s.subject_name) || [];
        setSelectedSubjects([...new Set(allSubjects)]);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // fetch students and create canonical marks objects
  const fetchStudents = async () => {
    if (!selectedClass || !selectedSection || !selectedSubject) {
      alert("Please select class, section, and subject.");
      return;
    }
    try {
      const studentsList = await getStudentsByClassAndSection(selectedClass, selectedSection);
      setStudents(studentsList || []);

      const initialMarks = (studentsList || []).map((s) => ({
        admission_no: s.admission_no,
        roll_no: s.roll_no,
        student_name: s.student_name,
        // canonical single-subject field used by backend
        subject: selectedSubject,
        marks_obtained: "",
        total_marks: "",
        academic_year: academicYear,
        exam_format: examFormat,
        class_grade: selectedClass,
        section: selectedSection,
        exam_date: examDate,
        emp_id: JSON.parse(localStorage.getItem("user"))?.unique_id,
      }));
      setMarksData(initialMarks);
    } catch (err) {
      alert("Failed to fetch students.");
      console.error(err);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...marksData];
    updated[index][field] = value;
    setMarksData(updated);
  };

  // start polling teacher notifications to see principal's review outcome
  const startPollingForReview = (meta) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetchNotificationsForCurrentUser();
        const list = Array.isArray(res) ? res : (res.notifications || res.data || res);
        if (!Array.isArray(list)) return;

        const found = list.find((n) => {
          try {
            const parsed = typeof n.message === "string" ? JSON.parse(n.message) : n.message;
            if (!parsed || parsed.type !== "marks_review") return false;
            // best match by submission_ref_notification_id
            if (parsed.submission_ref_notification_id && meta.notificationId) {
              return String(parsed.submission_ref_notification_id) === String(meta.notificationId);
            }
            // fallback: match by submission_summary or submission fields
            if (parsed.submission_summary) {
              const s = parsed.submission_summary;
              return s.subject === meta.subject && s.class_grade === meta.class_grade && s.section === meta.section && s.exam_format === meta.exam_format;
            }
            if (parsed.submission) {
              const s = parsed.submission;
              return s.subject === meta.subject && s.class_grade === meta.class_grade && s.section === meta.section && s.exam_format === meta.exam_format;
            }
          } catch (e) {
            return false;
          }
          return false;
        });

        if (found) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setPolling(false);
          const parsed = typeof found.message === "string" ? JSON.parse(found.message) : found.message;
          setSubmissionStatus(parsed.status || "approved");
          setReviewComments(parsed.comments || parsed.review_comments || null);
        }
      } catch (err) {
        console.error("Polling notifications error:", err);
      }
    }, 3000);

    setPolling(true);
  };

  const manualCheckStatus = () => {
    if (!lastSubmissionMetaRef.current) {
      alert("No recent submission to check.");
      return;
    }
    startPollingForReview(lastSubmissionMetaRef.current);
  };

  // normalized submit handler
  const handleSubmit = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const emp_id = loggedInUser?.unique_id;
    if (!emp_id) return alert("Employee ID not found. Please login again.");

    // validate top-level required fields
    if (!selectedClass || !selectedSection || !selectedSubject || !examFormat || !examDate) {
      return alert("All fields (Class, Section, Subject, Format, Date) are required.");
    }

    // Normalize marks entries: ensure subject key exists and convert numeric fields
    const normalizedMarks = marksData.map((m) => ({
      admission_no: m.admission_no,
      roll_no: m.roll_no,
      student_name: m.student_name,
      subject: selectedSubject,
      marks_obtained: m.marks_obtained === "" ? null : Number(m.marks_obtained),
      total_marks: m.total_marks === "" ? null : Number(m.total_marks),
      academic_year: academicYear,
      exam_format: examFormat,
      class_grade: selectedClass,
      section: selectedSection,
      exam_date: examDate,
    }));

    // Build final payload expected by backend
    const dataToSubmit = {
      class_grade: selectedClass,
      section: selectedSection,
      // IMPORTANT: backend expects `subject` (singular)
      subject: selectedSubject,
      exam_format: examFormat,
      academic_year: academicYear,
      exam_date: examDate,
      emp_id,
      marks: normalizedMarks,
    };

    // log payload for debugging (open browser console to inspect)
    console.log("Submitting marks payload:", dataToSubmit);

    try {
      const res = await submitMarksForApproval(dataToSubmit);
      // expected res: { success: true, message: 'Submitted', notificationIds: [...], notificationId: X }
      setSubmissionStatus("pending");
      setReviewComments(null);

      const notificationId = res?.notificationId || (Array.isArray(res?.notificationIds) ? res.notificationIds[0] : null);
      lastSubmissionMetaRef.current = {
        notificationId,
        subject: selectedSubject,
        class_grade: selectedClass,
        section: selectedSection,
        exam_format: examFormat,
      };

      // start polling for principal review
      startPollingForReview(lastSubmissionMetaRef.current);

      alert("Marks submitted for principal approval.");
      console.log("submitMarksForApproval response:", res);
    } catch (err) {
      console.error("submitMarksForApproval error:", err);
      alert("Failed to submit marks for approval.");
    }
  };

  const handleFileChange = (e) => setCsvFile(e.target.files[0]);
  const handleCSVUpload = async () => {
    if (!csvFile) return alert("Please select a CSV file.");
    try {
      await uploadAcademicsCSV(csvFile);
      alert("CSV uploaded successfully.");
    } catch (err) {
      console.error("CSV upload error:", err);
      alert("CSV upload failed.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Academics</Title>
        <Wrapper>
          <Link to="/teacher-dashboard"><Icons><img src={home} alt="home" /></Icons></Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}><img src={back} alt="back" /></Icons>
        </Wrapper>
      </Header>

      <Title>Bulk Marks Entry</Title>

      <FormRow>
        <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classSections.map((cls, index) => <option key={index} value={cls.className}>{cls.className}</option>)}
        </Select>

        <Select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
          <option value="">Select Section</option>
          {selectedClassSection.map((sec, index) => <option key={index} value={sec.section_name}>{sec.section_name}</option>)}
        </Select>

        <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjectList.map((sub, index) => <option key={index} value={sub}>{sub}</option>)}
        </Select>

        <Select value={examFormat} onChange={(e) => setExamFormat(e.target.value)}>
          <option value="">Select Format</option>
          <option value="FA2">FA2</option>
          <option value="Summative">Summative</option>
        </Select>

        <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
        <Button onClick={fetchStudents}>Load Students</Button>
      </FormRow>

      {students.length > 0 && (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Sl No</Th>
                <Th>Admission No</Th>
                <Th>Roll No</Th>
                <Th>Student Name</Th>
                <Th>Subject</Th>
                <Th>Marks Obtained</Th>
                <Th>Total Marks</Th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.admission_no}>
                  <Td>{i + 1}</Td>
                  <Td>{s.admission_no}</Td>
                  <Td>{s.roll_no}</Td>
                  <Td>{s.student_name}</Td>
                  <Td>{selectedSubject}</Td>
                  <Td>
                    <MarkInput
                      type="number"
                      value={marksData[i]?.marks_obtained || ""}
                      onChange={(e) => handleInputChange(i, "marks_obtained", e.target.value)}
                    />
                  </Td>
                  <Td>
                    <MarkInput
                      type="number"
                      value={marksData[i]?.total_marks || ""}
                      onChange={(e) => handleInputChange(i, "total_marks", e.target.value)}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <Button onClick={handleSubmit} disabled={submissionStatus === "pending"}>Submit Marks</Button>
            {submissionStatus && <StatusBadge status={submissionStatus}>{submissionStatus.toUpperCase()}</StatusBadge>}
            {submissionStatus && submissionStatus !== "pending" && reviewComments && (
              <div style={{ marginLeft: 12, color: submissionStatus === "approved" ? "#2e7d32" : "#e53935" }}>
                {submissionStatus === "approved" ? "Approved: " : "Rejected: "} {reviewComments}
              </div>
            )}
            <Button onClick={manualCheckStatus} style={{ background: "#0069c0" }}>Check status</Button>
            {polling && <div style={{ marginLeft: 8, color: "#666" }}>Waiting for principal reply…</div>}
          </div>
        </>
      )}

      <div style={{ marginTop: "30px" }}>
        <Input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={handleCSVUpload}>Upload CSV</Button>
      </div>
    </Container>
  );
};

export default TeacherBulkMarksEntry;
