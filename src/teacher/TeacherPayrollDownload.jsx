import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
const user = JSON.parse(localStorage.getItem("user"));
const teacherName = user?.name || "";
const TeacherPayrollPDF = () => {
  const { state } = useLocation();
  const record = state?.payroll;

  if (!record) return <p>No payroll record found.</p>;

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18).text('Payroll Receipt', 70, 15);

    doc.setFontSize(12);
    doc.text(`Employee ID: ${record.employee_id}`, 20, 30);
    doc.text(`Name: ${teacherName || 'N/A'}`, 20, 38);
    doc.text(`Month: ${record.month}`, 20, 46);
    doc.text(`Base Salary: ₹${record.base_salary}`, 20, 54);
    doc.text(`Net Pay: ₹${record.net_pay}`, 20, 62);
    doc.text(`Status: ${record.status}`, 20, 70);

    autoTable(doc, {
      startY: 80,
      head: [['Type', 'Component', 'Amount']],
      body: [
        ...record.earnings_breakdown.map(e => ['Earning', e.name, `₹${e.amount}`]),
        ...record.deductions_breakdown.map(d => ['Deduction', d.name, `₹${d.amount}`])
      ],
    });

    doc.save(`Payroll_${record.month}_${record.employee_id}.pdf`);
  };

  return (
    <Wrapper>
      <ReceiptBox>
        <h2>Payroll Receipt</h2>
        <p><strong>Employee ID:</strong> {record.employee_id}</p>
        <p><strong>Name:</strong> {record.employee_name || 'N/A'}</p>
        <p><strong>Month:</strong> {record.month}</p>
       
        <p><strong>Net Pay:</strong> ₹{record.net_pay}</p>
        <p><strong>Status:</strong> {record.status}</p>

        <hr />

        <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Component</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {record.earnings_breakdown.map((e, i) => (
              <tr key={`e-${i}`}>
                <td>Earning</td>
                <td>{e.name}</td>
                <td>₹{e.amount}</td>
              </tr>
            ))}
            {record.deductions_breakdown.map((d, i) => (
              <tr key={`d-${i}`}>
                <td>Deduction</td>
                <td>{d.name}</td>
                <td>₹{d.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <DownloadButton onClick={handleDownload}>📄 Download PDF</DownloadButton>
      </ReceiptBox>
    </Wrapper>
  );
};

export default TeacherPayrollPDF;

// Styled Components
const Wrapper = styled.div`
  padding: 2rem;
  background: #f4f4f4;
  min-height: 100vh;
`;

const ReceiptBox = styled.div`
  background: white;
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  th, td {
    padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #002087;
    color: white;
  }
`;

const DownloadButton = styled.button`
  margin-top: 1.5rem;
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
`;
