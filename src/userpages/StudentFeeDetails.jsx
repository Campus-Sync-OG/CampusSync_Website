import React, { useState } from 'react';
import { getStudentFeeDetails } from '../api/ClientApi'; // Adjust the import path as necessary

const StudentFeeDetails = () => {
  const [admissionNo, setAdmissionNo] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');

  const fetchFeeDetails = async () => {
    try {
      const data = await getStudentFeeDetails(admissionNo);
      // Ensure empty arrays if missing
      setStudentData({
        ...data,
        fees: data.fees || [],
        history: data.history || []
      });
      setError('');
    } catch (err) {
      setStudentData(null);
      setError(err.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Fee Details</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter Admission No"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={fetchFeeDetails}>Fetch Details</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {studentData && studentData.fees.length > 0 && (
        <>
          <h4>Fee Summary</h4>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Fee Type</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {studentData.fees.map((fee, idx) => (
                <tr key={idx}>
                  <td>{fee.type}</td>
                  <td>{fee.total}</td>
                  <td>{fee.paid}</td>
                  <td>{fee.total - fee.paid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {studentData && studentData.history.length > 0 && (
        <>
          <h4 style={{ marginTop: '20px' }}>Payment History</h4>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Fee Type</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Receipt No</th>
              </tr>
            </thead>
            <tbody>
              {studentData.history.map((h, idx) => (
                <tr key={idx}>
                  <td>{h.date}</td>
                  <td>{h.fee_type}</td>
                  <td>{h.pay_method}</td>
                  <td>{h.paid_amount}</td>
                  <td>{h.receipt_no || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StudentFeeDetails;
