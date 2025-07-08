import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSubjects, deleteSubject } from "../api/ClientApi"; // 🆕 Import delete function
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const SubjectListView = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getAllSubjects();
      const subjectArray = Array.isArray(data) ? data : data?.subjects || [];
      setSubjects(subjectArray);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await deleteSubject(id);
      setSubjects(subjects.filter((s) => s.id !== id)); // 🧹 Remove from UI
      alert("Subject deleted successfully.");
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Subjects List</Title>
        <IconGroup>
          <Icon src={homeIcon} alt="home" onClick={() => navigate("/admin-dashboard")} />
          <Divider />
          <Icon src={backIcon} alt="back" onClick={() => navigate(-1)} />
        </IconGroup>
      </Header>

      {loading ? (
        <Loading>Loading subjects...</Loading>
      ) : (
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Subject Name</th>
                <th>Subject ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="4">No subjects found.</td>
                </tr>
              ) : (
                subjects.map((subject, index) => (
                  <tr key={subject.id || index}>
                    <td>{index + 1}</td>
                    <td>{subject.subject_name}</td>
                    <td>{subject.id}</td>
                    <td>
                      <DeleteButton onClick={() => handleDelete(subject.id)}>
                        Remove
                      </DeleteButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </Container>
  );
};

export default SubjectListView;


const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 20px;
  color: white;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-family: Poppins;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: white;
`;

const TableContainer = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
  }
`;

const Loading = styled.p`
  padding: 20px;
  text-align: center;
  font-weight: bold;
`;
const DeleteButton = styled.button`
  background-color: #df0043;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #b00036;
  }
`;


