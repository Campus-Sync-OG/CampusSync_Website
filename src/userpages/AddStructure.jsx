import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createSalaryStructure, getSalaryStructures } from '../api/ClientApi';

const AddStructure = () => {
  const [structureData, setStructureData] = useState({
    name: '',
    base_salary: '',
    is_default: false,
    
  });

  const [viewMode, setViewMode] = useState(false);
  const [structures, setStructures] = useState([]);

  useEffect(() => {
    if (viewMode) {
      getSalaryStructures()
        .then(setStructures)
        .catch(() => alert('Failed to fetch structures'));
    }
  }, [viewMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSalaryStructure(structureData);
      alert('Structure added');
      setStructureData({ name: '', base_salary: '', is_default: false, school_id: '' });
    } catch {
      alert('Failed to add structure');
    }
  };

  return (
    <Container>
      <Header>
        <h2>Add Salary Structure</h2>
        <ViewButton onClick={() => setViewMode(!viewMode)}>
          {viewMode ? ' Add New' : ' View All'}
        </ViewButton>
      </Header>

     {!viewMode ? (
  <Form onSubmit={handleSubmit}>
    <label>Name</label>
    <input
      value={structureData.name}
      onChange={(e) => setStructureData({ ...structureData, name: e.target.value })}
      required
    />
    <label>Base Salary</label>
    <input
      type="number"
      value={structureData.base_salary}
      onChange={(e) => setStructureData({ ...structureData, base_salary: e.target.value })}
      required
    />
    <label>
      <input
        type="checkbox"
        checked={structureData.is_default}
        onChange={(e) => setStructureData({ ...structureData, is_default: e.target.checked })}
      />
      {' '}Is Default?
    </label>
    <SubmitBtn type="submit">Save</SubmitBtn>
  </Form>
) : (
  <TableWrapper>
    <TableContainer>
      <Table>
        <TheadWrapper>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Base Salary</Th>
            <Th>Default</Th>
          </tr>
        </TheadWrapper>
        <tbody>
          {structures.map((s) => (
            <tr key={s.id}>
              <Td>{s.id}</Td>
              <Td>{s.name}</Td>
              <Td>{s.base_salary}</Td>
              <Td>{s.is_default ? 'Yes' : 'No'}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  </TableWrapper>
)}

   
    </Container>
  );
};

export default AddStructure;
const Container = styled.div`

  margin: 3rem auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewButton = styled.button`
  background:rgb(24, 4, 173);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  color:white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  gap: 1rem;
  input{
  max-width:300px;
  }
`;

const SubmitBtn = styled.button`
  padding: 0.75rem;
  background-color:#df0043;
  color: white;
  border: none;
  border-radius: 5px;
  max-width:100px;
`;
const TableWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  overflow-x: auto;
`;

const TableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  @media (max-width: 426px) {
    max-height: 200px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-radius: 20px;
`;

const TheadWrapper = styled.thead`
  box-shadow: 0 8px 10px rgba(34, 22, 200, 0.1);
`;

const Th = styled.th`
  background-color: #002087;
  color: white;
  font-family: Poppins;
  font-weight: 100;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Td = styled.td`
  font-family: Poppins;
  padding: 10px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  text-align: center;
`;
