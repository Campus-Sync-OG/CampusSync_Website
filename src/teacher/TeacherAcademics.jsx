import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import {
  getAllClassSections,
  getAllSubjects,
  getStudentsByClassAndSection,
  uploadAcademicsCSV,
  giveMarks,
} from "../api/ClientApi";

// Styled Components
const Container = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  width: 150px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: rgb(57, 0, 179);
  color: white;
  border: none;
  border-radius: 4px;
  &:hover {
    background-color: rgb(179, 0, 0);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  background-color: #f2f2f2;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const MarkInput = styled(Input)`
  width: 100px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background:  linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 10px 20px;
  color: white;
  border-radius: 8px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icons = styled.div`
  cursor: pointer;
  margin: 0 10px;
  img {
    width: 30px;
    height: 30px;
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 30px;
  background-color: white;
`;

const TeacherBulkMarksEntry = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examFormat, setExamFormat] = useState("");
  const [academicYear] = useState("2024-25");
  const [examDate, setExamDate] = useState("");
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  const [classSections, setClassSections] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState([]);
  const [subjectList, setSelectedSubjects] = useState([]);

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

  useEffect(() => {
    getAllSubjects()
      .then((data) => {
        const allSubjects = data.subjects?.map((s) => s.subject_name) || [];
        const uniqueSubjects = [...new Set(allSubjects)];
        setSelectedSubjects(uniqueSubjects);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  const fetchStudents = async () => {
    if (!selectedClass || !selectedSection || !selectedSubject) {
      alert("Please select class, section, and subject.");
      return;
    }

    try {
      const studentsList = await getStudentsByClassAndSection(
        selectedClass,
        selectedSection
      );
      setStudents(studentsList || []);

      const initialMarks = studentsList.map((s) => ({
        admission_no: s.admission_no,
        roll_no: s.roll_no,
        student_name: s.student_name,
        subjects: selectedSubject, // ✅ Make sure this is set
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
  console.log("Marks Data:", marksData);
  console.log("Students:", students);
  const handleInputChange = (index, field, value) => {
    const updated = [...marksData];
    updated[index][field] = value;
    setMarksData(updated);
  };

  const handleSubmit = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const emp_id = loggedInUser?.unique_id;

    if (!emp_id) return alert("Employee ID not found. Please login again.");
    if (
      !selectedClass ||
      !selectedSection ||
      !selectedSubject ||
      !examFormat ||
      !examDate
    ) {
      return alert(
        "All fields (Class, Section, Subject, Format, Date) are required."
      );
    }

    const updatedMarksData = marksData.map((entry) => ({
      ...entry,
      subject: selectedSubject, // ✅ Enforce subject in each entry
    }));

    const dataToSubmit = {
      class_grade: selectedClass,
      section: selectedSection,
      exam_format: examFormat,
      academic_year: academicYear,
      exam_date: examDate,
      emp_id: emp_id,
      subjects: selectedSubject,
      marks: updatedMarksData,
    };

    try {
      const response = await giveMarks(emp_id, dataToSubmit);
      alert("Marks successfully submitted!");
      console.log(response);
    } catch (error) {
      alert("Failed to submit marks.");
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file.");
      return;
    }
    try {
      await uploadAcademicsCSV(csvFile);
      alert("CSV file uploaded successfully.");
    } catch (error) {
      alert("Error uploading CSV.");
      console.error(error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Academics</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
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

      <Title>Bulk Marks Entry</Title>

      <FormRow>
        <Select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classSections.map((cls, index) => (
            <option key={index} value={cls.className}>
              {cls.className}
            </option>
          ))}
        </Select>

        <Select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="">Select Section</option>
          {selectedClassSection.map((sec, index) => (
            <option key={index} value={sec.section_name}>
              {sec.section_name}
            </option>
          ))}
        </Select>

        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjectList.map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </Select>

        <Select
          value={examFormat}
          onChange={(e) => setExamFormat(e.target.value)}
        >
          <option value="">Select Format</option>
          <option value="FA2">FA2</option>
          <option value="Summative">Summative</option>
        </Select>

        <Input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />
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
              {students.map((s, index) => (
                <tr key={s.admission_no}>
                  <Td>{index + 1}</Td>
                  <Td>{s.admission_no}</Td>
                  <Td>{s.roll_no}</Td>
                  <Td>{s.student_name}</Td>
                  <Td>{selectedSubject}</Td>
                  <Td>
                    <MarkInput
                      type="number"
                      value={marksData[index]?.marks_obtained || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "marks_obtained",
                          e.target.value
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <MarkInput
                      type="number"
                      value={marksData[index]?.total_marks || ""}
                      onChange={(e) =>
                        handleInputChange(index, "total_marks", e.target.value)
                      }
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button onClick={handleSubmit}>Submit Marks</Button>
        </>
      )}

      {/* CSV Upload */}
      <div style={{ marginTop: "30px" }}>
        <Input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={handleCSVUpload}>Upload CSV</Button>
      </div>
    </Container>
  );
};

export default TeacherBulkMarksEntry;
