import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { Link } from "react-router-dom";
import { getFeesByAdmissionNo,fetchStudentByAdmissionNo } from "../api/ClientApi";
import { useNavigate } from "react-router-dom"; 
import jsPDF from "jspdf";

const StudentFees = () => {
  const [feesData, setFeesData] = useState([]);
  const [admission_no, setAdmissionNo] = useState(null);
const [receipts, setReceipts] = useState([]);
const [studentName, setStudentName] = useState("");
const [studentClass, setStudentClass] = useState("");
const [studentSection, setStudentSection] = useState("");
 const navigate = useNavigate();

  // Load admission number from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
    }
  }, []);

  // Fetch fees data
  useEffect(() => {
    const fetchFees = async () => {
      if (admission_no) {
        console.log("Fetching fees for admission_no:", admission_no); // Log admission_no
        try {
          const data = await getFeesByAdmissionNo(admission_no);
          setFeesData(data.data);  // Store the fetched fees in state
        } catch (error) {
          console.error("Failed to fetch fees:", error);
          alert("Failed to fetch fees data.");
        }
      } else {
        console.log("No admission number found");
      }
    };
  
    fetchFees();
  }, [admission_no]);
  useEffect(() => {
    if (admission_no) {
      fetchStudentByAdmissionNo(admission_no)
        .then((data) => {
          setStudentName(data.student_name || "N/A");
          console.log("Student Name:", data.student_name);
          setStudentClass(data.class || "N/A");
          setStudentSection(data.section || "N/A");
        })
        .catch((err) => {
          console.error("Error fetching student info:", err);
        });
    }
  }, [admission_no]);

  const handleViewReceipt = (receipt) => {
    navigate("/student-receipt", { state: { receipt } });
  };
  

  const handleDownloadReceipt = (receipt) => {
    const doc = new jsPDF();
  
    // Get logged-in user details
    
  
    // Header Title
    doc.setFontSize(18);
    doc.text("Fees Receipt", 80, 20);
  
    // Student Information
     doc.setFontSize(12);
  let y = 35; // Y position
  doc.text(`Student Name: ${studentName}`, 14, y);
  y += 8;
  doc.text(`Admission No: ${admission_no}`, 14, y);
  y += 8;
  doc.text(`Class: ${studentClass}`, 14, y);
  y += 8;
  doc.text(`Section: ${studentSection}`, 14, y);
  
    // Receipt Details Title
    y += 15;
    doc.setFontSize(14);
    doc.text("Receipt Details", 14, y);
    y += 10;
  
    // Draw table manually
    const startX = 14;
    const cellWidth = 38;
    const rowHeight = 10;
  
    const headers = ["Sl No", "Date", "Receipt No", "Amount Paid", "Pay Method"];
    const data = [
      [
        "1",
        new Date(receipt.pay_date).toLocaleDateString(),
        receipt.receipt_no,
        receipt.paid_amount.toString(),
        receipt.pay_method
      ]
    ];
  
    // Draw table header
    headers.forEach((header, i) => {
      doc.rect(startX + i * cellWidth, y, cellWidth, rowHeight); // Rectangle border
      doc.text(header, startX + i * cellWidth + 2, y + 7); // Text inside cell
    });
  
    // Draw table body
    y += rowHeight;
    data.forEach(row => {
      row.forEach((text, i) => {
        doc.rect(startX + i * cellWidth, y, cellWidth, rowHeight);
        doc.text(text.toString(), startX + i * cellWidth + 2, y + 7);
      });
    });
  
    // Save PDF
    doc.save(`Receipt_${receipt.receipt_no}.pdf`);
  };

  return (
    <PageContainer>
      <HeaderBar>
        <HeaderTitle>Fees</HeaderTitle>
        <Link to="/dashboard">
          <Icons>
            <img src={home} alt="home" />
          </Icons>
        </Link>
        <Link to="/dashboard">
          <Icons2>
            <img src={back} alt="back" />
          </Icons2>
        </Link>
      </HeaderBar>

      <SectionTitle>Fees Receipt Information</SectionTitle>

      <Table>
        <thead>
          <tr>
            <Th>Sl no</Th>
            <Th>Date</Th>
            <Th>Receipt Number</Th>
            <Th>Status</Th>
            <Th>Amount Paid</Th>
            <Th>Payment Method</Th>
            <Th> View Fees</Th>
            <Th>Download Receipt</Th>
            
          </tr>
        </thead>
        <tbody>
          {feesData.length === 0 ? (
            <Tr>
              <Td colSpan="7">No fees data available.</Td>
            </Tr>
          ) : (
            feesData.map((r, idx) => (
              <Tr key={r.receipt_no}>
                <Td>{String(idx + 1).padStart(2, '0')}</Td>
                <Td>{new Date(r.pay_date).toLocaleDateString()}</Td>
                <Td>{r.receipt_no}</Td>
                <Td>{r.status}</Td>
                <Td>{r.paid_amount}</Td>
                <Td>{r.pay_method}</Td>
                <Td>
                  <a
                    onClick={() => handleViewReceipt(r)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  >
                    View
                  </a>
                </Td>
                <Td>
  <DownloadLink onClick={() => handleDownloadReceipt(r)}>
    Download
  </DownloadLink>
</Td>

              </Tr>
            ))
          )}
        </tbody>
      </Table>

      <Note>
        <strong>Note:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Note>
    </PageContainer>
  );
};

export default StudentFees;




/* ───────────────────────────────── styled-components ───────────────────────────────── */

const PageContainer = styled.div`
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
`;

const HeaderBar = styled.div`
  background: linear-gradient(90deg, #1c1c9c 0%, #d2005a 100%);
  border-radius: 8px 8px 8px 8px;
  padding: 0.8rem 1rem ;
  display: flex;
  align-items: center;
  color: white;
  width: 100%;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  flex: 1;
`;

const SectionTitle = styled.h3`
  margin: 1.5rem 0 1rem;
  color: #1a237e;
`;

const SearchInput = styled.input`
  flex: 1 1 200px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  flex: 0 1 150px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
`;

const SearchButton = styled.button`
  flex: 0 1 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5ch;
  background: #d2005a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const Th = styled.th`
  background: #001d88;
  color: white;
  padding: 0.75rem;
  text-align: left;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const DownloadLink = styled.a`
  color: #d2005a;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const Note = styled.p`
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #d2005a;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
   align-items: center; /* Ensures icons and divider are vertically aligned */

  img {
  position: relative;
    width: 18px;
    height: 18px;
    right: 14px;
    top: 3px;
    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const Icons2 = styled.div`
  position: relative;
 width: 1px; /* Thickness of the white line */
  height: 20px; /* Adjust to match the size of icons */
  background-color: white; 
  right: 10px;
  align-items: center; /* Ensures icons and divider are vertically aligned */
  img {
    position: relative;
    width: 18px;
    height: 18px;
    left:5px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
      
    }
  }

  @media (max-width: 768px) {
    flex: none;
  }
`;

