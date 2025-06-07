import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const ReceiptContainer = styled.div`
  padding: 20px;
 
  margin: auto;
`;


const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 0px;
  width:96%;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StudentDetails = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: left;

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #d6003b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ReceiptPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [receipt, setReceipt] = useState(state?.receipt || null);

  useEffect(() => {
    if (!receipt) {
      navigate("/principal-fees");
    }
  }, [receipt, navigate]);

  return (
    <ReceiptContainer>
      <Header>
        <Title>Fee Details</Title>
        
      </Header>
      {receipt ? (
        <>
          <StudentDetails>
            <h3>Student Details</h3>
            <p><strong>Student Name:</strong> {receipt.student?.student_name}</p>
            <p><strong>Admission:</strong> {receipt.student?.admission_no}</p>
            <p><strong>Class:</strong> {receipt.class_name}</p>
            <p><strong>Section:</strong> {receipt.section_name}</p>
          </StudentDetails>

          <Table>
            <thead>
              <tr>
                <th>Sl no</th>
                <th>Date</th>
                <th>Receipt Number</th>
                <th>Amount Paid</th>
                <th>Payment Method</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{new Date(receipt.pay_date).toLocaleDateString()}</td>
                <td>{receipt.receipt_no}</td>
                <td>{receipt.paid_amount}</td>
                <td>{receipt.pay_method}</td>
                <td>{receipt.feestype}</td>
                
              </tr>
            </tbody>
          </Table>

          <BackButton onClick={() => navigate("/principal-fees")}>
            Back to Fees
          </BackButton>
        </>
      ) : (
        <p>Receipt not found.</p>
      )}
    </ReceiptContainer>
  );
};

export default ReceiptPage;
