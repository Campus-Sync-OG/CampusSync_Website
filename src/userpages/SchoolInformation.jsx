import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import homeIcon from "../assets/images/home.png"; // adjust the path as needed
import backIcon from "../assets/images/back.png"; // adjust the path as needed

const SchoolInfo = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    schoolName: "",
    affiliationNo: "",
    affiliationBoard: "CBSE",
    principalName: "",
    address: "",
    pincode: "",
    state: "",
    phone: "",
    mobile: "",
    email: "",
    website: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSave = () => {
    const {
      schoolName,
      affiliationNo,
      principalName,
      address,
      pincode,
      state,
      phone,
      mobile,
      email,
      website,
    } = form;

    if (
      !schoolName ||
      !affiliationNo ||
      !principalName ||
      !address ||
      !pincode ||
      !state ||
      !phone ||
      !mobile ||
      !email ||
      !website
    ) {
      alert("saved sucessfully!!.");
      return;
    }

    setSuccessMessage("Saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <Container>
      <NavContainer>
        <Title>School Information</Title>
        <IconsContainer>
          <Link to="/admin-dashboard">
            <ImageIcon src={homeIcon} alt="Home" />
          </Link>
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={() => navigate(-1)} />
        </IconsContainer>
      </NavContainer>

      <Card>
        <Flex>
          <Column>
            <SectionTitle>School Profile</SectionTitle>
            <Label>Select File *</Label>
            <Input type="file" accept=".jpg,.jpeg,.png" />
            <FileNote>ONLY JPG, JPEG & PNG</FileNote>
          </Column>

          <Column>
            <SectionTitle>School Banner</SectionTitle>
            <Label>Select File *</Label>
            <Input type="file" accept=".jpg,.jpeg,.png" />
            <FileNote>ONLY JPG, JPEG & PNG</FileNote>
          </Column>
        </Flex>

        <SectionTitle>School Information</SectionTitle>

        <Flex>
          <Column>
            <Label>School Name *</Label>
            <Input type="text" placeholder="Enter school name" />
          </Column>
          <Column>
            <Label>Affiliation Number *</Label>
            <Input type="text" placeholder="Enter affiliation no." />
          </Column>
          <Column>
            <Label>Affiliated to *</Label>
            <Select>
              <option>CBSE</option>
              <option>ICSE</option>
              <option>State Board</option>
            </Select>
          </Column>
          </Flex>
           <Flex>
          <Column>
            <Label>Principal Name *</Label>
            <Input type="text" placeholder="Enter principal name" />
          </Column>
       

       
          <Column>
            <Label>Address *</Label>
            <Textarea rows={3} placeholder="Enter address" />
          </Column>
        
          <Column>
            <Label>Pincode *</Label>
            <Input type="text" />
          </Column>
           </Flex>
           <Flex>
          <Column>
            <Label>State *</Label>
            <Select>
              <option>Please Select State</option>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Kerala</option>
            </Select>
          </Column>
          <Column>
            <Label>Phone *</Label>
            <Input type="text" />
          </Column>
          <Column>
            <Label>Mobile Number *</Label>
            <Input type="text" />
          </Column>
        </Flex>

        <Flex>
          <Column>
            <Label>Email Address *</Label>
            <Input type="email" />
          </Column>
          <Column>
            <Label>Website link *</Label>
            <Input type="url" />
          </Column>
        </Flex>

        <ButtonRow>
          <Button>Edit</Button>
          <Button primary onClick={handleSave}>
            Save
          </Button>
        </ButtonRow>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </Card>
    </Container>
  );
};

export default SchoolInfo;

/* Styled Components */
const Container = styled.div`
  padding: 0 1rem;
  background: #f0f2f5;
  font-family: Arial, sans-serif;
  flex-direction: column;
  height: 70vh;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 0px 20px;
  border-radius: 10px;
  color: white;
`;

const Title = styled.h2`
  color: white;
  font-size: 25px;
  font-weight: 600;
  font-family: "Poppins";
  @media (max-width: 426px) {
    font-size: 20px;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  width: 4px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
  position: relative;
  right: 30px;
`;

const ImageIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
  position: relative;
  right: 30px;
`;



const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
`;

const Flex = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
  color: #002087;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #f0f2f8;
`;

const Select = styled.select`
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #f0f2f8;
`;

const Textarea = styled.textarea`
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #f0f2f8;
  resize: vertical;
`;

const FileNote = styled.span`
  font-size: 0.9rem;
  color: #6c757d;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  background: ${(props) => (props.primary ? "#002087" : "#df0043")};
  color: white;
`;

const SuccessMessage = styled.div`
  margin-top: 1rem;
  color: green;
  font-weight: bold;
`;
