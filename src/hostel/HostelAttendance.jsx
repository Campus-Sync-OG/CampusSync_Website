import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchHostelStudentsForWarden,saveHostelAttendance} from "../api/ClientApi";

/* ================= STYLES ================= */

const Container = styled.div`
  padding: 22px;
  font-family: "Roboto", sans-serif;
  background: #fafafa;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #002087;
  text-align: center;
  margin-bottom: 18px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const CountBox = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #333;
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-width: 140px;
  text-align: center;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  background: white;
  padding: 10px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;

  th {
    background: #002087;
    color: white;
    padding: 12px;
    font-size: 15px;
  }

  td {
    padding: 12px;
    border-bottom: 2px solid #eee;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  tr:hover td {
    background: #ffe6ea;
  }
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 2px solid #002087;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: #002087;
  cursor: pointer;

  &:focus {
    border-color: #df0043;
    color: #df0043;
  }
`;

const SaveButton = styled.button`
  margin-top: 22px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 11px 20px;
  background: #df0043;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #002087;
  }
`;

/* ================= COMPONENT ================= */

const HostelAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchHostelStudentsForWarden();

        const formatted = data.map((item) => ({
          id: item.allotment_id,
          admission_no: item.student.admission_no,
          name: item.student.student_name,
          class: item.student.class,
          section: item.student.section,
        }));

        const initialAttendance = {};
        formatted.forEach((stu) => {
          initialAttendance[stu.admission_no] = "Present";
        });

        setStudents(formatted);
        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Failed to load hostel students:", err);
      }
    };

    loadStudents();
  }, []);

  const handleChange = (admission_no, status) => {
    setAttendance((prev) => ({ ...prev, [admission_no]: status }));
  };

  const presentCount = Object.values(attendance).filter(
    (v) => v === "Present"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (v) => v === "Absent"
  ).length;

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        date: new Date().toISOString().split("T")[0],
        attendance: Object.keys(attendance).map((admission_no) => ({
          admission_no,
          status: attendance[admission_no],
          note: "",
        })),
      };

      await saveHostelAttendance(payload);

      alert("✅ Attendance saved successfully");
    } catch (err) {
      console.error("Attendance save failed:", err);
      alert("❌ Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Title>📘 Hostel Attendance Register</Title>

      <TopBar>
        <CountBox>✅ Present: {presentCount}</CountBox>
        <CountBox>❌ Absent: {absentCount}</CountBox>
      </TopBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Admission No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.admission_no}</td>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.section}</td>
                <td>
                  <Select
                    value={attendance[student.admission_no]}
                    onChange={(e) =>
                      handleChange(student.admission_no, e.target.value)
                    }
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <SaveButton onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "💾 Save Attendance"}
      </SaveButton>
    </Container>
  );
};

export default HostelAttendance;
