import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generatePayroll, getPayrollsByMonth } from '../api/ClientApi';

const monthsTillNow = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const options = [];

  for (let y = currentYear; y >= currentYear - 1; y--) {
    for (let m = 11; m >= 0; m--) {
      if (y === currentYear && m > currentMonth) continue;
      const month = String(m + 1).padStart(2, '0'); // ensures "01" to "12"
      options.push(`${y}-${month}`);
    }
  }

  return options;
};


const PayrollGeneration = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedMonth) {
      alert('Please select a month');
      return;
    }

    try {
      setLoading(true);
     await generatePayroll(selectedMonth);
      alert('Payroll generated successfully');
      fetchPayrolls();
    } catch (err) {
      console.error(err);
      alert('Error generating payroll');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrolls = async () => {
    try {
      const data = await getPayrollsByMonth(selectedMonth);
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching payrolls:', err);
      setPayrolls([]);
    }
  };

  useEffect(() => {
    if (selectedMonth) fetchPayrolls();
  }, [selectedMonth]);

  return (
    <Container>
      <TopBar>
        <h2>Payroll Generator</h2>
        <div>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">-- Select Month --</option>
            {monthsTillNow().map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <GenerateBtn onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Payroll'}
          </GenerateBtn>
        </div>
      </TopBar>

      <TableWrapper>
        <TableContainer>
          <Table>
            <TheadWrapper>
              <tr>
                <Th>Employee ID</Th>
                <Th>Month</Th>
                <Th>Earnings</Th>
                <Th>Deductions</Th>
                <Th>Net Pay</Th>
                <Th>Status</Th>
              </tr>
            </TheadWrapper>
            <tbody>
              {payrolls.map((p, i) => (
                <tr key={i}>
                  <Td>{p.employee_id}</Td>
                  <Td>{p.month}</Td>
                  <Td>{p.earnings}</Td>
                  <Td>{p.deductions}</Td>
                  <Td>{p.net_pay}</Td>
                  <Td>{p.status}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </Container>
  );
};

export default PayrollGeneration;

// Styled Components (same as before)
const Container = styled.div`padding: 2rem;`;
const TopBar = styled.div`
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;
  select { padding: 0.5rem; font-size: 1rem; margin-right: 0.5rem; }
`;
const GenerateBtn = styled.button`
  background-color: #007bff; color: white; border: none; padding: 0.6rem 1.2rem;
  border-radius: 5px; cursor: pointer;
`;
const TableWrapper = styled.div`margin-top: 30px; width: 100%; overflow-x: auto;`;
const TableContainer = styled.div`max-height: 500px; overflow-y: auto;`;
const Table = styled.table`width: 100%; border-collapse: collapse; table-layout: fixed; border-radius: 20px;`;
const TheadWrapper = styled.thead`box-shadow: 0 8px 10px rgba(34, 22, 200, 0.1);`;
const Th = styled.th`
  background-color: #002087; color: white; font-family: Poppins; font-weight: 100;
  padding: 10px; border-bottom: 1px solid #ddd; position: sticky; top: 0; z-index: 10;
`;
const Td = styled.td`font-family: Poppins; padding: 10px; border-bottom: 1px solid #eee; text-align: center;`;
