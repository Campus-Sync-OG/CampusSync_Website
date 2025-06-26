import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAllStudentDocuments } from "../api/ClientApi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const PageContainer = styled.div`
  padding: 0 1.5rem;
`;

const SearchInput = styled.input`
  width: 20%;
  padding: 12px 25px;
  font-size: 16px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  font-family: Poppins;
`;

const Thead = styled.thead`
  background-color: #002087;
  color: white;
`;

const Th = styled.th`
  padding: 12px;
  text-align: center;
  position: sticky;
  top: 0;
`;

const Td = styled.td`
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const GreenTick = styled(FaCheckCircle)`
  color: green;
  font-size: 18px;
`;

const RedCross = styled(FaTimesCircle)`
  color: red;
  font-size: 18px;
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
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
const Button = styled.button`
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  background-color: ${(props) => props.color || "#002087"};
  margin-top: 10px;
  gap: 10px;
  align: right;
`;
const StudentDocumentView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const BASIC_CERTIFICATES = [
    "caste_certificate",
    "income_certificate",
    "birth_certificate",
    "transfer_certificate",
    "aadhar_card",
  ];

  useEffect(() => {
    fetchAllStudentDocuments().then(setStudents);
  }, []);

  const filteredStudents = students.filter((student) => {
    const admissionMatch = student.admission_no
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = student.student?.student_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return admissionMatch || nameMatch;
  });

  // Collect all certificate keys that ever appeared
  const allCertificates = Array.from(
    new Set(
      students
        .flatMap((s) =>
          s.certificate_status ? Object.keys(s.certificate_status) : []
        )
        .concat(BASIC_CERTIFICATES)
    )
  );

  return (
    <PageContainer>
      <Header>
        <Title> Submitted Documents</Title>
        <Wrapper>
          <Icons onClick={() => navigate("/admin-dashboard")}>
            <img src={home} alt="home" />
          </Icons>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>
      <SearchInput
        type="text"
        placeholder="Search by Admission No or name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ButtonContainer>
        <Button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
          Back
        </Button>
      </ButtonContainer>

      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>Admission No</Th>
              <Th>Name</Th>
              <Th>Class</Th>
              <Th>Section</Th>
              {allCertificates.map((cert) => (
                <Th key={cert}>{cert.replace(/_/g, " ").toUpperCase()}</Th>
              ))}
            </tr>
          </Thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.admission_no}>
                <Td>{student.admission_no}</Td>
                <Td>{student.student?.student_name || "-"}</Td>
                <Td>{student.class || "-"}</Td>
                <Td>{student.section || "-"}</Td>
                {allCertificates.map((cert) => (
                  <Td key={cert}>
                    {student.certificate_status?.[cert] ? (
                      <GreenTick />
                    ) : (
                      <RedCross />
                    )}
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </PageContainer>
  );
};

export default StudentDocumentView;
