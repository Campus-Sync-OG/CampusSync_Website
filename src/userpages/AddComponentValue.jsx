import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  createSalaryComponent,
  getSalaryComponents,
  getSalaryStructures,
  getComponentTypes,
} from '../api/ClientApi'; // Adjust the import path

const ComponentValue = () => {
  const [viewMode, setViewMode] = useState(false);
  const [components, setComponents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [componentTypes, setComponentTypes] = useState([]);
  const [selectedStructureId, setSelectedStructureId] = useState('');

  const [componentValues, setComponentValues] = useState({});

  useEffect(() => {
    getSalaryStructures().then(setStructures);
    getComponentTypes().then(setComponentTypes);
  }, []);

  useEffect(() => {
    if (viewMode) {
      getSalaryComponents().then(setComponents);
    }
  }, [viewMode]);

  const handleInputChange = (typeId, field, value) => {
    setComponentValues(prev => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        [field]: field === 'is_percentage' ? value.target.checked : value.target.value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStructureId) return alert("Please select a Structure");

  const componentsToSubmit = componentTypes.map(type => ({
  name: type.name,
 
  amount: parseFloat(componentValues[type.id]?.amount || 0), // ✅ ensure it's a number
  is_percentage: componentValues[type.id]?.is_percentage || false
}));

    try {
      await createSalaryComponent({ structure_id: selectedStructureId, components: componentsToSubmit });
      alert("Component values saved successfully.");
      setComponentValues({});
    } catch (err) {
      alert("Error saving components");
    }
  };

  return (
    <Container>
      <TopBar>
        <PageTitle>Add Component Values</PageTitle>
        <ViewBtn onClick={() => setViewMode(!viewMode)}>
          {viewMode ? '➕ Add' : '👁️ View'}
        </ViewBtn>
      </TopBar>

      {!viewMode ? (
        <Form onSubmit={handleSubmit}>
          <label>Select Structure</label>
          <select value={selectedStructureId} onChange={e => setSelectedStructureId(e.target.value)} required>
            <option value="">-- Select --</option>
            {structures.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <ComponentTypeList>
            {componentTypes.map((type) => (
              <ComponentRow key={type.id}>
                <strong>{type.name} ({type.type})</strong>
                <input
                  type="number"
                  placeholder="Amount"
                  value={componentValues[type.id]?.amount || ''}
                  onChange={e => handleInputChange(type.id, 'amount', e)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={componentValues[type.id]?.is_percentage || false}
                    onChange={e => handleInputChange(type.id, 'is_percentage', e)}
                  />
                  %
                </label>
              </ComponentRow>
            ))}
          </ComponentTypeList>

          <SubmitBtn type="submit">Save Component Values</SubmitBtn>
        </Form>
      ) : (
        <TableWrapper>
          <TableContainer>
            <Table>
              <TheadWrapper>
                <tr>
                  <Th>Structure ID</Th>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                  <Th>%</Th>
                </tr>
              </TheadWrapper>
              <tbody>
  {components.map((comp, idx) =>
    comp.component_values.map((item, i) => (
      <tr key={`${idx}-${i}`}>
        <Td>{comp.structure_id}</Td>
        <Td>{item.name}</Td>
        <Td>{item.type}</Td>
        <Td>{item.amount}</Td>
        <Td>{item.is_percentage ? 'Yes' : 'No'}</Td>
      </tr>
    ))
  )}
</tbody>
            </Table>
          </TableContainer>
        </TableWrapper>
      )}
    </Container>
  );
};

export default ComponentValue;
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
  max-width: 600px;
  margin-top: 1rem;
  gap: 1rem;

  input, select {
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

const ComponentTypeList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 10px;
`;

const ComponentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
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
