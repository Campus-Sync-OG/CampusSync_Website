import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  createSalaryComponent,
  getComponentTypes,
  getAllUsers,
  getSalaryComponents
} from '../api/ClientApi';
import { useNavigate } from 'react-router-dom';

const ComponentValueSetup = () => {
  const [componentTypes, setComponentTypes] = useState([]);
  const [role, setRole] = useState('');
  const [formValues, setFormValues] = useState({});
  const [roles, setRoles] = useState([]);
  
  const [savedValues, setSavedValues] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchComponentTypes();
    fetchRoles();
    fetchSavedComponents();
  }, []);

  const fetchComponentTypes = async () => {
    const types = await getComponentTypes();
    setComponentTypes(types || []);
  };

  const fetchRoles = async () => {
    const allUsers = await getAllUsers();
    const roleSet = [...new Set(allUsers.map((u) => u.role))].filter((r) => r !== 'student');
    setRoles(roleSet);
  };

  const fetchSavedComponents = async () => {
  try {
    const all = await getSalaryComponents(); 
   // should be array
    const grouped = {};

    all?.forEach((entry) => {
      if (entry.role && Array.isArray(entry.component_values)) {
        grouped[entry.role] = entry.component_values;
      }
    });

    setSavedValues(grouped);
  } catch (err) {
    console.error(' Failed to fetch saved components:', err);
  }
};


  const handleChange = (name, field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: field === 'is_percentage' ? value === 'true' : value,
      },
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!role) {
    alert('Please select a role');
    return;
  }

  const component_values = Object.entries(formValues).map(([name, obj]) => ({
    name,
    amount: parseFloat(obj.amount || 0),
    is_percentage: obj.is_percentage || false,
  }));

  if (component_values.length === 0) {
    alert('Please enter at least one component value.');
    return;
  }

  const payload = {
    role,
    component_values,
  };

  try {
    console.log(' Submitting Payload:', payload);
    await createSalaryComponent(payload);
    alert(' Components saved successfully');
    setFormValues({});
    setRole('');
    fetchSavedComponents();
  } catch (error) {
    console.error(' Submission failed:', error.response?.data || error.message);
    alert(' Failed to save components. Check console for details.');
  }
};


  return (
    <Container>
      <TopBar>
        <PageTitle>Component Values Setup</PageTitle>
        <BackButton onClick={() => navigate(-1)}> Back</BackButton>
      </TopBar>

      <Form onSubmit={handleSubmit}>
        <label>Select Role</label>
        <SmallSelect value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">-- Choose Role --</option>
          {roles.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </SmallSelect>

        <ComponentGrid>
          {componentTypes.map((comp, i) => (
            <ComponentCard key={i}>
              <span>{comp.name}</span>
              <AmountInput
                type="number"
                placeholder="Amount"
                value={formValues[comp.name]?.amount || ''}
                onChange={(e) => handleChange(comp.name, 'amount', e.target.value)}
                required
              />
              <SmallSelect
                value={formValues[comp.name]?.is_percentage ? 'true' : 'false'}
                onChange={(e) => handleChange(comp.name, 'is_percentage', e.target.value)}
              >
                <option value="false">₹</option>
                <option value="true">%</option>
              </SmallSelect>
            </ComponentCard>
          ))}
        </ComponentGrid>

        <SubmitBtn type="submit"> Save</SubmitBtn>
      </Form>

      <TableWrapper>
        <h3>Saved Component Values</h3>
        <TableContainer>
          <Table>
            <TheadWrapper>
              <tr>
                <Th>Role</Th>
                {componentTypes.map((c, i) => (
                  <Th key={i}>{c.name}</Th>
                ))}
              </tr>
            </TheadWrapper>
            <tbody>
              {roles.map((r, i) => (
                <tr key={i}>
                  <Td>{r}</Td>
                  {componentTypes.map((c, j) => {
                   const item = savedValues[r]?.find(
  (v) => v.name.trim().toLowerCase() === c.name.trim().toLowerCase()
);
                    return (
                      <Td key={j}>
                        {item ? `${item.amount}${item.is_percentage ? '%' : '₹'}` : '—'}
                      </Td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </Container>
  );
};

export default ComponentValueSetup;
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
  margin-top: 10px;
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
