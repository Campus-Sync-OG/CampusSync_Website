import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  createComponentType,
  getComponentTypes,
} from '../api/ClientApi'; // Adjust import path if needed

const ComponentType = () => {
  const [viewMode, setViewMode] = useState(false);
  const [types, setTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'earning',
  });

  useEffect(() => {
    if (viewMode) {
      getComponentTypes().then(setTypes);
    }
  }, [viewMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComponentType(formData);
      alert('Component type added');
      setFormData({ name: '', type: 'earning' });
    } catch (err) {
      alert('Error adding component type');
    }
  };

  return (
    <Container>
      <TopBar>
        <PageTitle>Add Component Type</PageTitle>
        <ViewBtn onClick={() => setViewMode(!viewMode)}>
          {viewMode ? '➕ Add' : '👁️ View'}
        </ViewBtn>
      </TopBar>

      {!viewMode ? (
        <Form onSubmit={handleSubmit}>
          <label>Component Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="earning">Earning</option>
            <option value="deduction">Deduction</option>
          </select>

          <SubmitBtn type="submit">Save</SubmitBtn>
        </Form>
      ) : (
        <TableWrapper>
          <TableContainer>
            <Table>
              <TheadWrapper>
                <tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                </tr>
              </TheadWrapper>
              <tbody>
                {types.map((t, i) => (
                  <tr key={i}>
                    <Td>{t.name}</Td>
                    <Td>{t.type}</Td>
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

export default ComponentType;
const Container = styled.div`
  padding: 2rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h2`
  font-family: Poppins;
`;

const ViewBtn = styled.button`
  background-color: #ffc107;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin-top: 1rem;
  gap: 1rem;

  input,
  select {
    padding: 0.5rem;
    font-size: 1rem;
  }
`;

const SubmitBtn = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
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
`;

const Td = styled.td`
  font-family: Poppins;
  padding: 10px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  text-align: center;
`;
