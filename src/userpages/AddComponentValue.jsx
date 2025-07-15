import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  createSalaryComponent,
  getSalaryComponents,
  getSalaryStructures,
  getComponentTypes,
} from '../api/ClientApi';
import { useNavigate } from 'react-router-dom';

const ComponentValue = () => {
  const [components, setComponents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [componentTypes, setComponentTypes] = useState([]);
  const [selectedStructureId, setSelectedStructureId] = useState('');
  const [componentValues, setComponentValues] = useState({});
  const [structureMap, setStructureMap] = useState({});
const navigate = useNavigate();
  useEffect(() => {
    getSalaryStructures().then(data => {
      setStructures(data);
      const map = {};
      data.forEach(item => {
        map[item.id] = item.name;
      });
      setStructureMap(map);
    });

    getComponentTypes().then(setComponentTypes);
    getSalaryComponents().then(setComponents);
  }, []);

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
      amount: parseFloat(componentValues[type.id]?.amount || 0),
      is_percentage: componentValues[type.id]?.is_percentage || false
    }));

    try {
      await createSalaryComponent({
        structure_id: selectedStructureId,
        components: componentsToSubmit
      });
      alert("Component values saved successfully.");
      setComponentValues({});
      getSalaryComponents().then(setComponents); // refresh table
    } catch (err) {
      alert("Error saving components");
    }
  };
  const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const componentChunks = chunkArray(componentTypes, 3);

  return (
    <Container>
      <TopBar>
        <PageTitle>Add Component Values</PageTitle>
         
           <BackButton onClick={() => navigate(-1)}>Back</BackButton>
          
       
      </TopBar>

      <Form onSubmit={handleSubmit}>
        <label>Select Structure</label>
       <SmallSelect
  value={selectedStructureId}
  onChange={(e) => setSelectedStructureId(e.target.value)}
  required
>
  <option value="">-- Select --</option>
  {structures.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</SmallSelect>


       <ComponentGrid>
  {componentTypes.map((type) => (
    <ComponentCard key={type.id}>
      <strong>{type.name} ({type.type})</strong>
      <AmountInput
        type="number"
        placeholder="Amount"
        value={componentValues[type.id]?.amount || ''}
        onChange={(e) => handleInputChange(type.id, 'amount', e)}
      />
      <CheckboxLabel>
        <input
          type="checkbox"
          checked={componentValues[type.id]?.is_percentage || false}
          onChange={(e) => handleInputChange(type.id, 'is_percentage', e)}
        />
        %
      </CheckboxLabel>
    </ComponentCard>
  ))}
</ComponentGrid>


        <SubmitBtn type="submit">Save </SubmitBtn>
      </Form>

      {/* Table shown always */}
      <TableWrapper>
        <TableContainer>
          <Table>
            <TheadWrapper>
              <tr>
                <Th>Structure</Th>
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
                    <Td>{structureMap[comp.structure_id] || comp.structure_id}</Td>
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
    </Container>
  );
};

export default ComponentValue;

// Styled components below (same as before)

const Container = styled.div` padding: 2rem; `;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h2` font-family: Poppins; `;



const BackButton = styled.button`
  background: #df0043;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
`;





const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin-top: 1rem;
  gap: 1rem;

  select, input {
    padding: 0.4rem;
    font-size: 0.85rem;
    border-radius: 4px;
  }
`;

const ComponentTypeList = styled.div`
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 8px;
  scrollbar-width: thin;

  /* For WebKit (Chrome, Edge, Safari) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }
`;


const SubmitBtn = styled.button`
  background: #9e0505ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  max-width: 100px;
`;
const SmallSelect = styled.select`
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
  max-width: 200px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-family: Poppins;
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
const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 10px;
  max-height: 250px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ComponentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f8f9ff;
  border: 1px solid #ccc;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const AmountInput = styled.input`
  flex: 1;
  padding: 0.3rem;
  font-size: 0.85rem;
  width: 70px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
`;
