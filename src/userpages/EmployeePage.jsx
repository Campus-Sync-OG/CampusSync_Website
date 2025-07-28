import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllUsers, updateBaseSalary } from "../api/ClientApi";
import { FaEdit, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const EmployeePage = () => {
  const [users, setUsers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedSalary, setEditedSalary] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    getAllUsers().then((data) => {
      const filtered = data.filter((u) => u.role !== "student");
      setUsers(filtered);
    });
  }, []);

  const handleEditClick = (user) => {
    setEditingRow(user.unique_id);
    setEditedSalary(user.base_salary || "");
  };

  const handleSaveClick = async (unique_id) => {
    try {
      await updateBaseSalary(unique_id, editedSalary);
      const updatedUsers = users.map((u) =>
        u.unique_id === unique_id ? { ...u, base_salary: editedSalary } : u
      );
      setUsers(updatedUsers);
      setEditingRow(null);
      alert("Salary updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update salary");
    }
  };

  return (
    <PageContainer>
       <TopBar>
        <Title>Employee List</Title>
        <BackButton onClick={() => navigate(-1)}>
          Back
        </BackButton>
      </TopBar>
      <Table>
        <thead>
          <tr>
            <th>Unique ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Base Salary</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.unique_id}>
              <td>{user.unique_id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                {editingRow === user.unique_id ? (
                  <>
                    <Input
                      type="number"
                      value={editedSalary}
                      onChange={(e) => setEditedSalary(e.target.value)}
                    />
                    <IconButton onClick={() => handleSaveClick(user.unique_id)}>
                     save
                    </IconButton>
                  </>
                ) : (
                  <>
                    ₹ {user.base_salary || "-"}
                    <IconButton onClick={() => handleEditClick(user)}>
                      <FaEdit />
                    </IconButton>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default EmployeePage;

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  background: #fefefe;
`;


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 16px;
    border: 1px solid #ccc;
    text-align: left;
  }

   th { background-color: #002087; color: white; }
`;

const Input = styled.input`
  padding: 6px;
  width: 100px;
  border: 1px solid #aaa;
  border-radius: 4px;
  margin-right: 6px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: black;
  font-size: 16px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    color: #0056b3;
  }
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
`;

const BackButton = styled.button`
  background-color: #df0043;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;