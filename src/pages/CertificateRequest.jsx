import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { submitCertificateRequest, getCertificateRequestsByAdmissionNo } from "../api/ClientApi";

const CertificateRequest = () => {
  const [view, setView] = useState("new");
  const [certificateType, setCertificateType] = useState("");
  const [reason, setReason] = useState("");
  const [admission_no, setAdmissionNo] = useState("");
  const [certificateRequests, setCertificateRequests] = useState([]);
 


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
      setLoading(false);
    } else {
      setError("Admission number not found");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "requested" && admission_no) {
      getCertificateRequestsByAdmissionNo(admission_no)
        .then((res) => {
          console.log("Full API Response:", res); // should show the array
          setCertificateRequests(res); // <-- directly assign the array
        })
        .catch((err) => {
          console.error("Failed to fetch certificate requests:", err);
          setError("Unable to load requested certificates.");
        });
    }
  }, [view, admission_no]);

  
  console.log("Certificate Requests:", certificateRequests);
  console.log("Admission No:", admission_no);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certificateType || !reason || !admission_no) {
      setError("Please fill all the fields before submitting.");
      return;
    }

    const requestData = {
      admission_no,
      certificate_type: certificateType,
      reason,
    };

    try {
      await submitCertificateRequest(requestData);
      alert("Request submitted for: " + certificateType);
      setCertificateType("");
      setReason("");
      setError(null);
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Failed to submit request. Please try again.");
      }
    }
  };

  const handleHomeClick = () => navigate("/dashboard");
  const handleBackClick = () => navigate(-1);

  if (loading) return <p>Loading...</p>;
  if (error && view === "new") return <p>{error}</p>;

  return (
    <Container>
      <NavContainer>
        <Title>Certificate Request</Title>
        <IconsContainer>
          <ImageIcon src={homeIcon} alt="Home" onClick={handleHomeClick} />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={handleBackClick} />
        </IconsContainer>
      </NavContainer>

      <RadioContainer>
        <label>
          <input
            type="radio"
            value="new"
            checked={view === "new"}
            onChange={() => setView("new")}
          />
          Add New Request
        </label>
        <label>
          <input
            type="radio"
            value="requested"
            checked={view === "requested"}
            onChange={() => setView("requested")}
          />
          Requested Certificates
        </label>
      </RadioContainer>

      {view === "new" ? (
        <FormContainer onSubmit={handleSubmit}>
          <RowGroup>
            <FormGroup style={{ flex: 1 }}>
              <label>Type of Certificate</label>
              <select
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
                required
              >
                <option value="">Select Certificate</option>
                <option value="Transfer Certificate">Transfer Certificate</option>
                <option value="Bonafide Certificate">Bonafide Certificate</option>
                <option value="Character Certificate">Character Certificate</option>
                <option value="Study Certificate">Study Certificate</option>
                <option value="Scholarship Certificate">Scholarship Certificate</option>
                <option value="Migration Certificate">Migration Certificate</option>
              </select>
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <label>Admission Number</label>
              <input type="text" value={admission_no} disabled />
            </FormGroup>
          </RowGroup>

          <FormGroup>
            <label>Reason for Certificate</label>
            <textarea
              placeholder="Type reason here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit">Submit</SubmitButton>
        </FormContainer>
      ) : (
        <StyledTableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Type of Certificate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {(certificateRequests || []).length === 0 ? (
                <tr>
                  <td colSpan="3">No requests found.</td>
                </tr>
              ) : (
                (certificateRequests || []).map((req, index) => (
                  <tr key={req.admission_no || index}>
                    <td>{index + 1}</td>
                    <td>{req.certificate_type}</td>
                    <td>
                      <StatusText status={req.status}>{req.status}</StatusText>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </StyledTable>
          <TableNote>
            * Note: Please collect the hardcopy of the certificate from the school.
          </TableNote>
        </StyledTableContainer>
      )}
    </Container>
  );
};

export default CertificateRequest;




const Container = styled.div`
    font-family:Poppins;
  margin: auto;
  padding: 20px;
  @media (max-width: 426px) {
    max-height:400px;
    overflow-y:auto;
  }
`;



const RadioContainer = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 20px;
   @media (max-width: 426px) {
    font-size:12px;
  }
`;

const FormContainer = styled.form`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
   @media (max-width: 426px) {
    font-size:14px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-weight: 500;
    margin-bottom: 5px;
  }

  textarea {
    width: 95%;
    height:100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
    input,
    select {
    width: 50%;
    padding: 10px;
   
    border: 1px solid #ccc;
    border-radius: 5px;
  }


  textarea {
    resize: vertical;
  }
 @media (max-width: 426px) {
   input,
    select {
    width: 80%;
}
  }
`;

const SubmitButton = styled.button`
  background-color: #d9534f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const TableContainer = styled.div`
  margin-top: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #eee;
  }
`;
const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #d9534f);
  padding: 10px 20px;
  border-radius: 10px;
  height: 40px;
  flex-shrink: 0;
`;

const Title = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: bold;
  @media (max-width: 426px) {
    font-size:14px;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
`;
const ImageIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const RowGroup = styled.div`
  display: flex;
  
  margin-bottom: 15px;
  flex-wrap: wrap;
  @media (max-width: 426px) {
    flex-direction:column;
  }
`;
const StyledTableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }

  th {
    background-color:rgb(12, 16, 118);
    font-weight: bold;
    color: white;
  }
    th:first-child {
    border-top-left-radius: 10px;
     border-bottom-left-radius: 10px;
  }

  th:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  tr:nth-child(even) {
    background-color: #fafafa;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;
const StatusText = styled.span`
  font-weight: bold;
  color: ${({ status }) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "orange"; // or "gold" for a brighter yellow
      case "rejected":
        return "red";
      default:
        return "black";
    }
  }};
`;
const TableNote = styled.p`
  margin-top: 12px;
  font-size: 14px;
  
  color:rgb(132, 19, 4);
  text-align: left;
`;
