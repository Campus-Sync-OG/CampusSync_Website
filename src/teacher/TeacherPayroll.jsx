import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getTeacherPayroll } from "../api/ClientApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png"
import { useNavigate } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));
const empId = user?.unique_id || "";
const teacherName = user?.name || "";

const TeacherPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeacherPayroll(empId);
        console.log("Fetched payrolls:", data);
        setPayrolls(data);
      } catch (err) {
        console.error("Error fetching payrolls", err);
      }
    };

    fetchData();
  }, [empId]);

  const filteredPayrolls = selectedMonth
    ? payrolls.filter((p) => p.month.startsWith(selectedMonth))
    : payrolls;

  return (
    <Container>
      <Header>
        <Title>My Payroll Records</Title>
        <IconGroup>
          <Icon
            src={home}
            alt="Home"
            onClick={() => navigate("/teacher-dashboard")}
          />
          <div style={{ width: "1px", height: "25px", background: "white" }} />
          <Icon src={back} alt="Back" onClick={() => navigate(-1)} />
        </IconGroup>
      </Header>
      <TopBar>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {Array.from(new Set(payrolls.map((p) => p.month.slice(0, 7)))).map(
            (m) => (
              <option key={m} value={m}>
                {m}
              </option>
            )
          )}
        </select>
      </TopBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Month</Th>
              <Th>Base</Th>
              <Th>Earnings</Th>
              <Th>Deductions</Th>
              <Th>Net Pay</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length === 0 ? (
              <tr>
                <Td colSpan="7">No payroll records found</Td>
              </tr>
            ) : (
              filteredPayrolls.map((p, i) => (
                <tr key={i}>
                  <Td>{p.month}</Td>
                  <Td>₹{p.base_salary}</Td>
                  <Td>₹{p.earnings}</Td>
                  <Td>₹{p.deductions}</Td>
                  <Td>₹{p.net_pay}</Td>
                  <Td>{p.status}</Td>
                  <Td>
                    <button
                      onClick={() =>
                        navigate("/payroll-pdf", {
                          state: {
                            payroll: { ...p, employee_name: teacherName },
                          },
                        })
                      }
                    >
                      View
                    </button>{" "}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default TeacherPayroll;

// Styled Components
const Container = styled.div`
  padding: 0.5rem 2rem;
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  select {
    padding: 0.5rem;
    font-size: 1rem;
  }
`;
const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background: #002087;
  color: white;
  padding: 10px;
`;
const Td = styled.td`
  padding: 10px;
  text-align: center;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #df0043);
  border-radius: 10px;
  padding: 1px 20px;
  color: white;
  margin-bottom:20px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
  
`;
const IconGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Icon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;