import React, { useState } from 'react';
import styled from 'styled-components';
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { fetchStudentDocumentByAdmissionNo, fetchStudentByAdmissionNo,createStudentDocument, updateStudentDocumentByAdmissionNo } from '../api/ClientApi'; 

const Container = styled.div`
  
  margin: auto;
  padding: 1rem;
`;

const InputGroup = styled.div`
  margin: 1rem;

  display: flex;
  align-items: center;
  gap: 1rem;

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
const TableWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  overflow-x: auto;
`;

const TableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  @media (max-width: 426px) {
    max-height: 200px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-radius: 20px;
`;

const TheadWrapper = styled.thead`
  box-shadow: 0 8px 10px rgba(34, 22, 200, 0.1);
`;

const Th = styled.th`
  background-color: #002087;
  color: white;
  font-family: Poppins;
  font-weight: 100;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Td = styled.td`
  font-family: Poppins;
  padding: 10px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  text-align: center;
`;
const Label = styled.label`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
  display: block;
`;

const StyledInput = styled.input`
  padding: 5px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 200;
  outline: none;
  transition: border 0.3s ease;

  &:focus {
    border-color: #002087;
    box-shadow: 0 0 0 2px rgba(0, 32, 135, 0.2);
  }

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

const StudentCertificates = () => {
    
 const defaultCertificates = {
  caste_certificate: false,
  income_certificate: false,
  birth_certificate: false,
  transfer_certificate: false,
  aadhar_card: false
};
  const [admissionNo, setAdmissionNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [certificates, setCertificates] = useState({ ...defaultCertificates });

const [showNewCertInput, setShowNewCertInput] = useState(false);
const [newCertificate, setNewCertificate] = useState('');
const addNewCertificate = () => {
  const certKey = newCertificate.trim().toLowerCase().replace(/\s+/g, '_');

  if (certKey && !certificates.hasOwnProperty(certKey)) {
    setCertificates((prev) => ({
      ...prev,
      [certKey]: false
    }));
    setNewCertificate('');
    setShowNewCertInput(false);
  }
};

  const fetchStudentData = async () => {
    try {
      // Fetch student name
      const student = await fetchStudentByAdmissionNo(admissionNo);
      

      setStudentName(student?.student_name || 'Name not found');
      setClassName(student?.class || '');
      setSection(student?.section || '');
      // Fetch certificate document (if exists)
     const doc = await fetchStudentDocumentByAdmissionNo(admissionNo);

      if (doc) {
        setClassName(doc.class);
        setSection(doc.section);
          setCertificates({
    ...defaultCertificates,
    ...doc.certificate_status
  });

      } else {
        setCertificates({
          caste_certificate: false,
          income_certificate: false,
          birth_certificate: false,
          transfer_certificate: false,
          aadhar_card: false
        });
      }
    } catch (error) {
    console.error('Error fetching student:', error);

    if (error.response?.status === 404) {
      alert('Student not found.');
    } else {
      alert('Error fetching student.');
    }

    setStudentName('');
    setClassName('');
    setSection('');
    setCertificates({ ...defaultCertificates });
  }
};

  const handleCheckboxChange = (type) => {
    setCertificates((prev) => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSubmit = async () => {
    try {
      const body = {
        admission_no: admissionNo,
        class: className,
        section,
        certificate_status: certificates
      };

      // Try to POST new or PUT update
       await createStudentDocument(body);
      alert('Data submitted successfully!');
    } catch (error) {
      if (error.response?.status === 400) {
        // Already exists → update it
        await updateStudentDocumentByAdmissionNo(admissionNo, {
    certificate_status: certificates,
    class: className,
    section,
  });
        alert('Updated existing record successfully!');
      } else {
        console.error('Submit error:', error);
        alert('Error submitting data.');
      }
    }
  };

  return (
    <Container>
      <Header>
             <Title>Student Document Upload</Title>
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
      <InputGroup>
       <Label>Admission No:</Label>
    <StyledInput
      type="text"
      value={admissionNo}
      onChange={(e) => setAdmissionNo(e.target.value)}
      placeholder="Enter Admission No"
    />
        <Button onClick={fetchStudentData}>Search</Button>
         <Button
    type="button"
    onClick={() => setShowNewCertInput(!showNewCertInput)}
    color=" #df0043"
  >
    + Add Certificate
  </Button>
  
{showNewCertInput && (
  <InputGroup>
    <StyledInput
      type="text"
      value={newCertificate}
      onChange={(e) => setNewCertificate(e.target.value)}
      placeholder="e.g. sports_certificate"
    />
    <Button type="button" onClick={addNewCertificate}>Confirm Add</Button>
  </InputGroup>
)}
      </InputGroup>
<InputGroup> {studentName && (
  <div>
    <Label>Student Name: <strong>{studentName}</strong></Label>
    <Label>Class: <strong>{className}</strong></Label>
    <Label>Section: <strong>{section}</strong></Label>
  </div>
)}</InputGroup>
     

      


      <TableWrapper>
  <TableContainer>
    <Table>
      <TheadWrapper>
        <tr>
          <Th>Certificate Type</Th>
          <Th>Status</Th>
        </tr>
      </TheadWrapper>
      <tbody>
        {Object.entries(certificates).map(([type, status]) => (
          <tr key={type}>
            <Td>{type.replace(/_/g, ' ').toUpperCase()}</Td>
            <Td>
              <input
                type="checkbox"
                checked={status}
                onChange={() => handleCheckboxChange(type)}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#00b300', // ✅ Green checkbox
                  cursor: 'pointer'
                }}
              />
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  </TableContainer>
</TableWrapper>

      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};

export default StudentCertificates;
