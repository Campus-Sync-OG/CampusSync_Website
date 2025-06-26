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
                <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    <option value="">Select Class</option>
                    {classList.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
                </Select>

                <Select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                    <option value="">Select Section</option>
                    {sectionList.map((sec, i) => <option key={i} value={sec}>{sec}</option>)}
                </Select>

                <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjectList.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                </Select>

                <FetchButton onClick={fetchAssignments}>Fetch Assignments</FetchButton>
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
const Container = styled.div`
  padding: 30px;
  max-width: 1100px;
  margin: auto;
  font-family: "Segoe UI", sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
`;

const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  min-width: 160px;
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  &:focus {
    border-color:rgb(13, 0, 255);
    outline: none;
  }
`;

const FetchButton = styled.button`
  padding: 10px 20px;
  background-color:  #d9534f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px hsla(0, 0.00%, 0.00%, 0.51);
  &:hover {
    background-color: red;
  }
`;

const AssignmentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  th {
    background-color:#002087;
    color: white;
    padding: 12px;
    font-weight: 600;
    text-align: center;
  }
  td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #e9ecef;
  }
  tr:hover {
    background-color: #f1f3f5;
  }
`;

const PDFViewer = styled.div`
  margin-top: 30px;
  border: 1px solid #dee2e6;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
`;

const ViewButton = styled.button`
  background-color: #00166b;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color:  #c9302c;
  }
`;

const DownloadButton = styled.button`
  background-color:   #c9302c;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #00166b;
  }
`;


