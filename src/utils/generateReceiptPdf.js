import html2pdf from "html2pdf.js";
import { fetchStudentByAdmissionNo } from "../api/ClientApi";

export const generateReceiptPdf = async (receipt) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admission_no = user?.unique_id;

  if (!admission_no || !receipt) return alert("Missing data.");

  const student = await fetchStudentByAdmissionNo(admission_no);
  const {
    student_name = "N/A",
    class: class_name = "N/A",
    section: section_name = "N/A",
  } = student;

  const html = `
    <div style="font-family: 'Segoe UI'; padding: 30px; max-width: 800px; margin: auto; background: #fff; border-radius: 12px;">
      <div style="text-align: center; border-bottom: 2px solid #d1eaff; margin-bottom: 30px;">
        <h1 style="color: #1e88e5;">XYZ Public School</h1>
        <h2 style="color: #4caf50;">Fee Payment Receipt</h2>
      </div>
      <div style="display: flex; justify-content: space-between; background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <div><strong>Admission No:</strong><br>${admission_no}</div>
        <div><strong>Class:</strong><br>${class_name}</div>
        <div><strong>Section:</strong><br>${section_name}</div>
      </div>
      <div style="margin-top: 20px; font-size: 16px; line-height: 2;">
        <div><strong>Receipt No:</strong> ${receipt.receipt_no}</div>
        <div><strong>Name:</strong> ${student_name}</div>
        <div><strong>Fee Type:</strong> ${receipt.feestype}</div>
        <div><strong>Amount Paid:</strong> ₹${receipt.paid_amount}</div>
        <div><strong>Payment Date:</strong> ${new Date(receipt.pay_date).toLocaleDateString()}</div>
        <div><strong>Status:</strong> ${receipt.status}</div>
        ${receipt.payment_notes ? `<div style="background: #fff9c4; padding: 10px; border-left: 5px solid #ffeb3b;">Notes: ${receipt.payment_notes}</div>` : ""}
      </div>
      <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #888;">
        This is a computer-generated receipt.<br />
        XYZ Public School | Contact: +91-XXXXXXXXXX | Email: info@xyzschool.in
      </div>
    </div>
  `;

  const opt = {
    margin: 0.2,
    filename: `Receipt_${receipt.receipt_no || Date.now()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(html).set(opt).outputPdf("blob").then((blob) => {
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // ✅ Opens in new tab
    setTimeout(() => URL.revokeObjectURL(url), 10000); // clean memory
  });
};
