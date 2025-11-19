// src/utils/generateAndOpenMarksheetPDF.js
import html2pdf from "html2pdf.js";
import { generateMarksheet } from "../api/ClientApi";

export const generateAndOpenMarksheetPDF = async (admission_no, exam_format) => {
  try {
    const response = await generateMarksheet(admission_no, exam_format);
    const data = response?.data || response;

    if (!data || !data.student_name) {
      alert("Failed to fetch marksheet data");
      return;
    }

    const subjectsTable = data.subjects.map(sub => `
      <tr>
        <td>${sub.subject}</td>
        <td>${sub.total_marks}</td>
        <td>${sub.marks_obtained}</td>
        <td>${sub.grade}</td>
      </tr>
    `).join("");

    const [obtainedMarks, totalMarks] = data.total_marks.split(" / ");

    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              background: #f5faff;
              color: #000;
            }

            .marksheet {
              border: 1px solid #000;
              padding: 20px;
              max-width: 800px;
              margin: auto;
            }

            .header {
              text-align: center;
            }

            .header h1 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
            }

            .header p {
              margin: 2px 0;
              font-size: 12px;
            }

            .section-title {
              background: #d9e7f4;
              padding: 5px 10px;
              font-weight: bold;
              margin-top: 15px;
              font-size: 14px;
            }

            .student-info {
              font-size: 14px;
              margin-top: 10px;
              line-height: 1.8;
            }

            .student-info span {
              display: inline-block;
              min-width: 200px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
              margin-top: 5px;
            }

            table th, table td {
              border: 1px solid #000;
              padding: 5px;
              text-align: center;
            }

            table th {
              background: #d9e7f4;
            }

            .summary {
              font-size: 14px;
              margin-top: 10px;
              line-height: 1.8;
            }

            .principal {
              margin-top: 40px;
              text-align: right;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="marksheet">
            <div class="header">
              <h1>ABC PUBLIC SCHOOL</h1>
              <p>Affiliated to ABX Board | Affiliation No: 123456</p>
              <p>123, Main Road, City, State - ZIPCODE</p>
              <p>Contact: +91-XXXXXXXXXX | www.abcschool.edu.in</p>
            </div>

            <div class="section-title">STUDENT INFORMATION</div>
            <div class="student-info">
              <div><span><strong>Student Name:</strong></span> ${data.student_name} <span><strong>Roll Number:</strong></span> ${data.roll_number}</div>
              <div><span><strong>Admission No:</strong></span> ${data.admission_no} <span><strong>Class / Section:</strong></span> ${data.class_grade} / -</div>
              <div><span><strong>Academic Year:</strong></span> ${data.academic_year} <span><strong>Date of Birth:</strong></span> ${data.dob}</div>
              <div><span><strong>Exam Type:</strong></span> ${data.exam_format} <span><strong>Issue Date:</strong></span> ${data.issue_date}</div>
            </div>

            <div class="section-title">ACADEMIC PERFORMANCE</div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Max Marks</th>
                  <th>Marks Obtained</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsTable}
              </tbody>
            </table>

            <div class="section-title">SUMMARY</div>
            <div class="summary">
              <div><strong>Total Marks Obtained:</strong> ${obtainedMarks} / ${totalMarks}</div>
              <div><strong>Percentage:</strong> ${data.percentage}%</div>
              <div><strong>Result:</strong> ${data.result}</div>
              <div><strong>Overall Grade:</strong> ${data.overall_grade}</div>
              <div><strong>Remarks:</strong> ${data.remarks}</div>
            </div>

            <div class="principal">
              Principal: __________________
            </div>
          </div>
        </body>
      </html>
    `;

    const opt = {
      margin: 0.5,
      filename: `Marksheet_${data.admission_no}_${data.exam_format}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    const blobPromise = html2pdf().from(html).set(opt).outputPdf("blob");
    blobPromise.then((pdfBlob) => {
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");
    });

  } catch (err) {
    console.error("PDF Generation Error:", err);
    alert("Error generating PDF");
  }
};
