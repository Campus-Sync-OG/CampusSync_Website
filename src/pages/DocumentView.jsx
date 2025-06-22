import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchStudentDocumentByAdmissionNo } from "../api/ClientApi";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PageContainer = styled.div`
  margin: auto;
  padding: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Poppins;
  margin-top: 2rem;
`;

const TheadWrapper = styled.thead`
  background-color: #002087;
  color: white;
`;

const Th = styled.th`
  padding: 12px;
  text-align: center;
`;

const Td = styled.td`
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const GreenTick = styled(FaCheckCircle)`
  color: #00b300;
  font-size: 20px;
`;

const RedCross = styled(FaTimesCircle)`
  color: #e60000;
  font-size: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 22px 20px;
  border-radius: 10px;
  color: white;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 300;
  font-family: "Poppins";
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 2px;
  height: 25px;
  background-color: white;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  img {
    width: 25px;
    height: 25px;
  }
`;

const DocumentView = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [admission_no, setAdmissionNo] = useState(null);

  const BASIC_CERTIFICATES = [
    "caste_certificate",
    "income_certificate",
    "birth_certificate",
    "transfer_certificate",
    "aadhar_card",
  ];

  // Step 1: Get admission number from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
    } else {
      alert("User not found");
      navigate(-1);
    }
  }, []);

  // Step 2: Fetch document by admission number
  useEffect(() => {
    if (admission_no) {
      fetchStudentDocumentByAdmissionNo(admission_no)
        .then((data) => setStudent(data))
        .catch(() => {
          alert("Student document not found");
          navigate(-1);
        });
    }
  }, [admission_no]);

  if (!student) return null;

  // Step 3: Combine all possible certificate types
  const allCertificates = Array.from(
    new Set([
      ...Object.keys(student?.certificate_status || {}),
      ...BASIC_CERTIFICATES,
    ])
  );

  return (
    <PageContainer>
      <Header>
        <Title>Student Document Upload</Title>
        <Wrapper>
          <Icons onClick={() => navigate("/student-dashboard")}>
            <img src={home} alt="home" />
          </Icons>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <Table>
        <TheadWrapper>
          <tr>
            <Th>Certificate Type</Th>
            <Th>Status</Th>
          </tr>
        </TheadWrapper>
        <tbody>
          {allCertificates.map((cert) => (
            <tr key={cert}>
              <Td>{cert.replace(/_/g, " ").toUpperCase()}</Td>
              <Td>
                {student.certificate_status?.[cert] ? (
                  <GreenTick />
                ) : (
                  <RedCross />
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageContainer>
  );
};

export default DocumentView;
