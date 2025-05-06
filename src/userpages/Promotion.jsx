import React from "react";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(to right, #002e9f, #cc027c);
  padding: 10px;
  color: white;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const IconBtn = styled.img`
  height: 28px;
  width: 28px;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 4px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
  position: relative;
  right: 0px;
  top: 5px;
`;

const SectionTitle = styled.h2`
  color: #002e9f;
  font-size: 20px;
  font-weight: bold;
  margin: 40px 0 30px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  background: #f1f2f7;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  width: 30%;
`;

const Select = styled.select`
  padding: 12px;
  background: #f1f2f7;
  border: none;
  border-radius: 6px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 20px;
`;

const SaveButton = styled.button`
  background: #d6004c;
  color: white;
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
`;

const ResetButton = styled.button`
  background: #002e9f;
  color: white;
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
`;

const classOptions = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

const sectionOptions = ["A", "B", "C", "D"];

const studentNames = [
  "Aarav Sharma",
  "Isha Patel",
  "Rohan Mehta",
  "Sneha Reddy",
  "Aditya Verma",
];

const Promotion = () => {
  return (
    <Container>
      <Header>
        <Title>Promotion</Title>
        <IconWrapper>
          <IconBtn src={homeIcon} alt="Home" title="Home" />
          <Divider />
          <IconBtn src={backIcon} alt="Back" title="Back" />
        </IconWrapper>
      </Header>

      <SectionTitle>Student Promotion</SectionTitle>

      <Form>
        <FormGroup>
          <Label>Name *</Label>
          <Select required>
            <option value="">Please Select Name</option>
            {studentNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Class *</Label>
          <Select defaultValue="X" required>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Section *</Label>
          <Select defaultValue="D" required>
            {sectionOptions.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Current Class</Label>
          <Select>
            <option>Please Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Promotion To Class *</Label>
          <Select required>
            <option>Please Select</option>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Roll Number *</Label>
          <Input type="text" placeholder="" required />
        </FormGroup>
      </Form>

      <ButtonGroup>
        <SaveButton type="submit">Save</SaveButton>
        <ResetButton type="reset">Reset</ResetButton>
      </ButtonGroup>
    </Container>
  );
};

export default Promotion;
