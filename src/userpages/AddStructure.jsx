import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createSalaryStructure, getSalaryStructures } from '../api/ClientApi';

const AddStructure = () => {
  const navigate = useNavigate();
  const [structures, setStructures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [structureData, setStructureData] = useState({
    name: '',
    base_salary: ''
  });

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      const data = await getSalaryStructures();
      setStructures(data);
    } catch (err) {
      alert('Failed to fetch structures');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSalaryStructure({
        ...structureData,
        is_default: false
      });
      setStructureData({ name: '', base_salary: '' });
      setShowForm(false);
      fetchStructures();
    } catch {
      alert('Failed to add structure');
    }
  };

  return (
    <Container>
      <Header>
        <h2>Salary Structures</h2>
        <BackButton onClick={() => navigate(-1)}>Back</BackButton>
      </Header>

      {!showForm && (
        <AddButton onClick={() => setShowForm(true)}>Add More</AddButton>
      )}

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <label>Name</label>
            <input
              type="text"
              value={structureData.name}
              onChange={(e) => setStructureData({ ...structureData, name: e.target.value })}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <label>Base Salary</label>
            <input
              type="number"
              value={structureData.base_salary}
              onChange={(e) => setStructureData({ ...structureData, base_salary: e.target.value })}
              required
            />
          </InputWrapper>
          <SubmitBtn type="submit">Save</SubmitBtn>
        </Form>
      )}

      <TableWrapper>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Base Salary</Th>
                <Th>Default</Th>
              </tr>
            </thead>
            <tbody>
            {[...structures].sort((a, b) => a.id - b.id).map((s) => (
                <tr key={s.id}>
                  <Td>{s.id}</Td>
                  <Td>{s.name}</Td>
                  <Td>₹{s.base_salary}</Td>
                  <Td>{s.is_default ? 'Yes' : 'No'}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </Container>
  );
};

export default AddStructure;

// Styled Components

const Container = styled.div`
  margin: 3rem auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: #df0043;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
`;

const AddButton = styled.button`
  background: #002087;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  margin: 1rem 0;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  label {
    font-weight: 500;
    margin-bottom: 0.3rem;
  }
  input {
    padding: 0.5rem;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const SubmitBtn = styled.button`
  padding: 0.75rem 1.2rem;
  background-color: #002087;
  color: white;
  border: none;
  border-radius: 5px;
  height: fit-content;
  align-self: end;
`;

const TableWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  overflow-x: auto;
`;

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #002087;
  color: white;
  font-family: Poppins;
  padding: 10px;
  text-align: center;
`;

const Td = styled.td`
  font-family: Poppins;
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
`;
