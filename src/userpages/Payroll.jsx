import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { FaPlus } from 'react-icons/fa';
import { getAllPayrolls, getAllUsers } from '../api/ClientApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

const PayrollSetup = () => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [totalPayroll, setTotalPayroll] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [showEmployees, setShowEmployees] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const res = await getAllPayrolls();
        if (res && res.length) {
          setTransactions(res); 

         

          const total = res.reduce((sum, tx) => sum + (parseFloat(tx.net_pay) || 0), 0);
          setTotalPayroll(total);

          const uniqueEmployeeIds = new Set(res.map(tx => tx.employee_id));
          setEmployeeCount(uniqueEmployeeIds.size);
        }
      } catch (error) {
        console.error("Failed to load payrolls:", error);
      }
    };

    fetchPayrolls();
  }, []);

  const visibleTransactions = viewAll ? transactions : transactions.slice(0, 5);
const getLastThreeMonthsData = (transactions) => {
  const grouped = {};

  transactions.forEach((tx) => {
    const month = tx.month; // use this directly from DB
    grouped[month] = (grouped[month] || 0) + parseFloat(tx.net_pay || 0);
  });

  const chartData = Object.entries(grouped).map(([month, total]) => ({
    month,
    label: dayjs(month).format("MMM YYYY"),
    value: total,
  }));

  // Sort properly by month value
  return chartData
    .sort((a, b) => new Date(a.month) - new Date(b.month))
    .slice(-3);
};

const handleEmployeeClick = () => {
    
    navigate('/admin-employee'); // or your exact route path
  };

  return (
    <Container>
      <Header>
        <Title>Payroll Management</Title>
        <Wrapper>
          <Icons onClick={() => navigate("/admin-dashboard")}>
            <img src={home} alt="home" />
          </Icons>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <TopBar>
        <TopLeft>
          <Summary>
            <h3>Total Payroll</h3>
            <Total>₹{totalPayroll.toLocaleString()}</Total>
          </Summary>

           <Summary style={{ cursor: "pointer" }} onClick={handleEmployeeClick}>
      <h3>Total Employees</h3>
      <Total>{employeeCount}</Total>
    </Summary>

          <ChartContainer>
            <h4>Monthly Payroll</h4>
           
             <ResponsiveContainer width="100%" height={200}>
  <BarChart
  data={getLastThreeMonthsData(transactions)}
  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="label" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill="#708090" name="Net Pay" />
</BarChart>

            </ResponsiveContainer>
          </ChartContainer>
        </TopLeft>

        <DropdownWrapper>
          <AddButton onClick={() => setShowActions(prev => !prev)}>
            <FaPlus size={18} />
          </AddButton>
          {showActions && (
            <Dropdown ref={dropdownRef}>
              <DropdownItem onClick={() => navigate('/admin-componentvalue')}>Add Component Value</DropdownItem>
              <DropdownItem onClick={() => navigate('/admin-componenttype')}>Add Component Type</DropdownItem>
              <DropdownItem onClick={() => navigate('/admin-payrollgeneration')}>Payroll</DropdownItem>
            </Dropdown>
          )}
        </DropdownWrapper>
      </TopBar>

      <SectionTitle>Payroll Transactions</SectionTitle>
      <TransactionWrapper>
        <TransactionTable>
          <thead>
            <tr>
              <th>Month</th>
              <th>Employee ID</th>
              <th>Net Pay</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.map((tx, index) => (
              <tr key={index}>
                <td>{dayjs(tx.month).format("MMM YYYY")}</td>
                <td>{tx.employee_id}</td>
                <td>₹{parseFloat(tx.net_pay).toLocaleString()}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </TransactionTable>

        {transactions.length > 5 && (
          <ViewAllButton onClick={() => setViewAll(prev => !prev)}>
            {viewAll ? "View Less" : "View All"}
          </ViewAllButton>
        )}
      </TransactionWrapper>

      {showEmployees && (
        <>
          <SectionTitle>Employee List</SectionTitle>
          <TransactionWrapper>
            <TransactionTable>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Base Salary</th>
                </tr>
              </thead>
              <tbody>
                {employeeList.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.emp_id || emp.id}</td>
                    <td>{emp.emp_name || emp.name}</td>
                    <td>{emp.role}</td>
                    <td>₹{emp.base_salary ? parseFloat(emp.base_salary).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </TransactionTable>
          </TransactionWrapper>
        </>
      )}
    </Container>
  );
};

export default PayrollSetup;


// Styled Components
const Container = styled.div` padding: 2rem; `;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 22px 20px; border-radius: 10px; color: white;
`;
const Title = styled.h2` font-size: 26px; font-weight: 600; font-family: "Poppins"; margin: 0; `;
const Wrapper = styled.div` display: flex; align-items: center; gap: 10px; `;
const Divider = styled.div` width: 2px; height: 25px; background-color: white; `;
const Icons = styled.div`
  width: 25px; height: 25px; cursor: pointer;
  img { width: 25px; height: 25px; }
`;

const TopBar = styled.div`
  display: flex; 
  justify-content: space-between;
   align-items: flex-start;
    margin-top: 2rem;
`;

const Summary = styled.div`
  background: #f0f4ff; padding: 1.5rem; border-radius: 12px; width: 60%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  max-height:150px;
`;

const Total = styled.div` font-size: 2rem; font-weight: bold; margin-top: 10px; `;

const AddButton = styled.button`
  background-color: #002087; color: white; border: none;
  border-radius: 50%; padding: 10px; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const DropdownWrapper = styled.div` position: relative; `;
const Dropdown = styled.div`
  position: absolute; top: 40px; right: 0;
  background-color: white; border: 1px solid #ddd;
  border-radius: 6px; padding: 0.5rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 180px; z-index: 10;
`;

const DropdownItem = styled.button`
  width: 100%; padding: 0.6rem 1rem; background: none;
  border: none; text-align: left; font-size: 0.95rem;
  cursor: pointer; border-radius: 4px;
  &:hover { background-color: #f2f4ff; }
`;

const SectionTitle = styled.h3`
  margin-top: 3rem;
  font-family: "Poppins";
`;


const TopLeft = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex: 1;
  max-height:200px;
`;

const ChartContainer = styled.div`
  background: #ffffff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  flex-grow: 1;

  h4 {
    margin-bottom: 0.5rem;
    font-family: "Poppins";
    font-weight: 600;
  }
`;
const TransactionWrapper = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1rem;
`;
const TransactionTable = styled.table`
  width: 100%; border-collapse: collapse;
  th, td {
    border: 1px solid #ccc;
    padding: 12px;
    font-family: "Poppins";
    text-align: center;
  }
  th { background-color: #002087; color: white; }
  tbody tr:nth-child(even) { background-color: #f9f9f9; }
`;
const ViewAllButton = styled.button`
  margin-top: 1rem;
  background-color: #002087;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
const EmployeeCount = styled.div`
  margin-top: 8px;
  color: #002087;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
