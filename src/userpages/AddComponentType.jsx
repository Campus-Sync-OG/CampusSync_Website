import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  createComponentType,
  getComponentTypes,
} from '../api/ClientApi';
import { useNavigate } from 'react-router-dom';

const ComponentType = () => {
  const [showForm, setShowForm] = useState(false);
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'earning',
  });

  const fetchTypes = async () => {
    try {
      const res = await getComponentTypes();
      setTypes(res || []);
    } catch {
      alert('Failed to fetch component types');
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComponentType(formData);
      alert('Component type added');
      setFormData({ name: '', type: 'earning' });
      setShowForm(false);
      fetchTypes();
    } catch {
      alert('Error adding component type');
    }
  };

  return (
    <Container>
     <TopBar>
  <PageTitle>Component Types</PageTitle>
  <RightControls>
   
    <AddMoreBtn onClick={() => setShowForm(!showForm)}>
      {showForm ? 'Cancel' : '➕ Add More'}
    </AddMoreBtn>
     <BackBtn onClick={() => navigate(-1)}>🔙 Back</BackBtn>
  </RightControls>
</TopBar>


      {showForm && (
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
      )}

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
              {[...types].sort((a, b) => a.name.localeCompare(b.name)).map((t, i) => (
                <tr key={i}>
                  <Td>{t.name}</Td>
                  <Td>{t.type}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </TableWrapper>
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

const AddMoreBtn = styled.button`
  background-color: #002087;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-top: 1rem;
  gap: 1rem;

  input, select {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const SubmitBtn = styled.button`
  background: #df0043;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  width: 100px;
`;

const TableWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  overflow-x: auto;
`;

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;

  @media (max-width: 426px) {
    max-height: 200px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TheadWrapper = styled.thead`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Th = styled.th`
  background-color: #002087;
  color: white;
  font-family: Poppins;
  font-weight: 500;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
`;

const Td = styled.td`
  font-family: Poppins;
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
`;
const RightControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const BackBtn = styled.button`
  background-color: #df0043;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
`;
