import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import { fetchStudentByAdmissionNo} from "../api/ClientApi";

const StudentReceipt = () => {
  const { state } = useLocation();
  const receipt = state?.receipt;

  const [studentInfo, setStudentInfo] = useState({
    student_name: "",
    class: "",
    section: "",
    admission_no: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const admission_no = userData?.unique_id;

    if (admission_no) {
      fetchStudentByAdmissionNo(admission_no)
        .then((data) => {
          setStudentInfo({
            student_name: data.student_name || "N/A",
            class: data.class || "N/A",
            section: data.section || "N/A",
            admission_no: data.admission_no || admission_no,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch student details:", err);
        });
    }
  }, []);

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Fees Receipt", 80, 20);

    let y = 35;
    doc.setFontSize(12);
    doc.text(`Student Name: ${studentInfo.student_name}`, 14, y);
    y += 8;
    doc.text(`Admission No: ${studentInfo.admission_no}`, 14, y);
    y += 8;
    doc.text(`Class: ${studentInfo.class}`, 14, y);
    y += 8;
    doc.text(`Section: ${studentInfo.section}`, 14, y);

    y += 15;
    doc.setFontSize(14);
    doc.text("Receipt Details", 14, y);
    y += 10;

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
        receipt.pay_method,
      ]
    ];

    headers.forEach((header, i) => {
      doc.rect(startX + i * cellWidth, y, cellWidth, rowHeight);
      doc.text(header, startX + i * cellWidth + 2, y + 7);
    });

    y += rowHeight;
    data.forEach(row => {
      row.forEach((text, i) => {
        doc.rect(startX + i * cellWidth, y, cellWidth, rowHeight);
        doc.text(text.toString(), startX + i * cellWidth + 2, y + 7);
      });
    });

    doc.save(`Receipt_${receipt.receipt_no}.pdf`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Fees Receipt</h2>

      <div style={styles.section}>
        <h3 style={styles.subheading}>Student Information</h3>
        <p><strong>Name:</strong> {studentInfo.student_name}</p>
        <p><strong>Admission No:</strong> {studentInfo.admission_no}</p>
        <p><strong>Class:</strong> {studentInfo.class}</p>
        <p><strong>Section:</strong> {studentInfo.section}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subheading}>Payment Information</h3>
        <p><strong>Receipt No:</strong> {receipt.receipt_no}</p>
        <p><strong>Date:</strong> {new Date(receipt.pay_date).toLocaleDateString()}</p>
        <p><strong>Amount Paid:</strong> ₹{receipt.paid_amount}</p>
        <p><strong>Payment Method:</strong> {receipt.pay_method}</p>
        <p><strong>Status:</strong> {receipt.status}</p>
      </div>

      <button style={styles.button} onClick={handleDownloadReceipt}>
        Download Receipt as PDF
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#2e2e2e",
  },
  subheading: {
    fontSize: "18px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "6px",
    marginBottom: "10px",
    color: "#444",
  },
  section: {
    marginBottom: "25px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    display: "block",
    margin: "0 auto",
  },
};

export default StudentReceipt;
