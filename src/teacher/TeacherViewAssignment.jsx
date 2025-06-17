import React, { useEffect, useState } from "react";
import { getStudentAssignmentsByTeacher, getAllClassSections, getAllSubjects } from "../api/ClientApi";
import styled from "styled-components";

const TeacherViewAssignment = () => {
    const [classList, setClassList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    const emp_id = JSON.parse(localStorage.getItem("user"))?.unique_id;

    const handleDownload = (url, title) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = title || "assignment.pdf"; // Default name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    useEffect(() => {
        getAllClassSections().then((data) => {
            const uniqueClasses = [...new Set(data.map((d) => d.className))];
            const uniqueSections = [...new Set(data.map((d) => d.section_name))];
            setClassList(uniqueClasses);
            setSectionList(uniqueSections);
        });

        getAllSubjects().then((data) => {
            const subs = data.subjects.map((s) => s.subject_name);
            setSubjectList([...new Set(subs)]);
        });
    }, []);

    const fetchAssignments = async () => {
        try {
            const data = await getStudentAssignmentsByTeacher({
                emp_id,
                class_name: selectedClass,
                section: selectedSection,
                subject: selectedSubject,
            });
            setAssignments(data);
        } catch (err) {
            console.error("Error fetching assignments", err);
            alert("Failed to fetch student assignments.");
        }
    };

    return (
        <Container>
            <h2>View Student Assignments</h2>
            <FilterBar>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    <option value="">Select Class</option>
                    {classList.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
                </select>

                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                    <option value="">Select Section</option>
                    {sectionList.map((sec, i) => <option key={i} value={sec}>{sec}</option>)}
                </select>

                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjectList.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                </select>

                <button onClick={fetchAssignments}>Fetch Assignments</button>
            </FilterBar>

            <AssignmentTable>
                <thead>
                    <tr>
                        <th>Admission No</th>
                        <th>Student Name</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Attachment</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((a, idx) => (
                        <tr key={idx}>
                            <td>{a.admission_no}</td>
                            <td>{a.student_name}</td>
                            <td>{a.title}</td>
                            <td>{new Date(a.Date).toLocaleDateString()}</td>
                            <td>
                                <td>
                                    <ViewButton onClick={() => setPreviewUrl(a.attachment)}>View</ViewButton>
                                    <DownloadButton onClick={() => handleDownload(a.attachment, a.title)}>Download</DownloadButton>
                                </td>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </AssignmentTable>

            {previewUrl && (
                <PDFViewer>
                    <h3 style={{ textAlign: "center" }}>PDF Viewer</h3>
                    <div style={{ height: '600px', border: '1px solid #ccc' }}>
                        <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                            title="PDF Viewer"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button onClick={() => setPreviewUrl("")}>Close PDF</button>
                    </div>
                </PDFViewer>
            )}

        </Container>
    );
};

export default TeacherViewAssignment;

// Styles
const Container = styled.div`padding: 20px; max-width: 1000px; margin: auto;`;
const FilterBar = styled.div`display: flex; gap: 10px; margin-bottom: 20px;`;
const AssignmentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
`;
const PDFViewer = styled.div`margin-top: 20px; border: 1px solid #ccc;`;

const ViewButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 6px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const DownloadButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #1e7e34;
  }
`;

