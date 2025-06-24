import React, { useState } from "react";
import {
  getFeeStatusByClassSection,
  getStudentFeeDetails,
} from "../api/ClientApi"; // adjust path
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { useNavigate } from "react-router-dom";

const StudentFeeDetails = () => {
  const [filters, setFilters] = useState({
    class_name: "",
    section_name: "",
    feestype: "",
  });
  const [report, setReport] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      const data = await getFeeStatusByClassSection(filters);
      setReport(data);
      setStudentDetail(null);
      setShowModal(false);
      setError("");
    } catch (err) {
      setReport(null);
      setStudentDetail(null);
      setShowModal(false);
      setError(err.error || "Something went wrong");
    }
  };
  const navigate = useNavigate();
  const fetchStudentDetail = async (admission_no) => {
    try {
      const data = await getStudentFeeDetails(admission_no);
      setStudentDetail({
        ...data,
        fees: data.fees || [],
        history: data.history || [],
      });
      setShowModal(true);
      setError("");
    } catch (err) {
      setStudentDetail(null);
      setShowModal(false);
      setError(err.error || "Something went wrong");
    }
  };

  return (
    <Container>
      <Header
        style={{
          background: "linear-gradient(90deg, #002087, #df0043)",
          padding: "22px 20px",
          borderRadius: "10px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 300,
            margin: 0,
            fontFamily: "Poppins",
          }}
        >
          Fee Status By Class & Section
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            onClick={() => navigate("/admin-dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={home}
              alt="home"
              style={{ width: "25px", height: "25px" }}
            />
          </div>
          <div
            style={{ width: "2px", height: "25px", backgroundColor: "white" }}
          ></div>
          <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
            <img
              src={back}
              alt="back"
              style={{ width: "25px", height: "25px" }}
            />
          </div>
        </div>
      </Header>


      <FilterRow>
        <Select
          value={filters.class_name}
          onChange={(e) =>
            setFilters({ ...filters, class_name: e.target.value })
          }
        >
          <option value="">Select Class</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </Select>

        <Select
          value={filters.section_name}
          onChange={(e) =>
            setFilters({ ...filters, section_name: e.target.value })
          }
        >
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </Select>

        <Select
          value={filters.feestype}
          onChange={(e) => setFilters({ ...filters, feestype: e.target.value })}
        >
          <option value="">Select Fee Type</option>
          <option value="Tuition">Tuition</option>
          <option value="Transport">Transport</option>
          <option value="Books">Books</option>
          <option value="Uniform">Uniform</option>
        </Select>

        <Button onClick={fetchStatus}>Fetch Fee Status</Button>
      </FilterRow>

      {error && <ErrorText>{error}</ErrorText>}

      {report && (
        <>
          <SubTitle>
            Summary: Paid - {report.paid_count} | Due - {report.due_count}
          </SubTitle>
          <Table>
            <thead>
              <tr>
                <Th>Admission No</Th>
                <Th>Total Fee</Th>
                <Th>Paid</Th>
                <Th>Due</Th>
                <Th>Due Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {report.details.map((s, idx) => {
                const Row = s.due_amount > 0 ? HighlightRow : NormalRow;
                return (
                  <Row key={idx}>
                    <Td>{s.admission_no}</Td>
                    <Td>{s.total_fee}</Td>
                    <Td>{s.paid_amount}</Td>
                    <Td>{s.due_amount}</Td>
                    <Td>{s.due_date ? s.due_date.split("T")[0] : ""}</Td>
                    <Td>
                      <Button
                        onClick={() => fetchStudentDetail(s.admission_no)}
                      >
                        View
                      </Button>
                    </Td>
                  </Row>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      {showModal && studentDetail && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setShowModal(false)}>X</CloseButton>

            <SubTitle>
              Student Fee Detail: {studentDetail.name} (
              {studentDetail.admission_no})
            </SubTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Type</Th>
                  <Th>Total</Th>
                  <Th>Paid</Th>
                  <Th>Due</Th>
                </tr>
              </thead>
              <tbody>
                {studentDetail.fees.map((fee, idx) => (
                  <NormalRow key={idx}>
                    <Td>{fee.type}</Td>
                    <Td>{fee.total}</Td>
                    <Td>{fee.paid}</Td>
                    <Td>{fee.due}</Td>
                  </NormalRow>
                ))}
              </tbody>
            </Table>

            <SubTitle>Payment History</SubTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Method</Th>
                  <Th>Amount</Th>
                  <Th>Receipt No</Th>
                </tr>
              </thead>
              <tbody>
                {studentDetail.history.map((h, idx) => (
                  <NormalRow key={idx}>
                    <Td>{h.date}</Td>
                    <Td>{h.pay_method}</Td>
                    <Td>{h.paid_amount}</Td>
                    <Td>{h.receipt_no || "N/A"}</Td>
                  </NormalRow>
                ))}
              </tbody>
            </Table>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default StudentFeeDetails;

export const Container = styled.div`
  padding: 0 1.5rem;
  max-width: 1200px;
  margin: auto;
  background: #f9f9f9;
  border-radius: 8px;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

export const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Button = styled.button`
  padding: 0.5rem 1.2rem;
  background: #002087;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #002087;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: 5px;
  overflow: hidden;
`;

export const Th = styled.th`
  background: #002087;
  color: white;
  padding: 0.8rem;
`;

export const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #ddd;
  text-align: center;
`;

export const HighlightRow = styled.tr`
  background-color: rgb(216, 178, 178);
`;

export const NormalRow = styled.tr`
  background-color: #fff;
`;

export const SubTitle = styled.h3`
  margin-top: 2rem;
  color: #333;
`;

export const ErrorText = styled.p`
  color: red;
  text-align: center;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
`;
export const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 22px 20px;
  border-radius: 10px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;
