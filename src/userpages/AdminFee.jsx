import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { addFee } from "../api/ClientApi";
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 22px 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
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

const Container = styled.div`
  padding: 0 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
  width: 100%;
  
  
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
  width: 100%;
`;

const FileInput = styled(Input)`
  padding: 6px;
`;

const Field = styled.div`
  flex: 1;
  min-width: 250px;
  max-width:300px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-family: "Poppins";
  font-size: 16px;
`;

const Ftitle = styled.div`
  font-size: 26px;
  color: #002087;
  margin: 20px 0;
  font-family: "Poppins";
`;

const Note = styled.p`
  margin-top: 5px;
  color: red;
  font-size: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.primary ? "#df0043" : "#002087")};
`;
const AdminFee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    admission_no: "",
    pay_date: "",
    pay_method: "Cash",
    paid_amount: "",
    receipt_no: "",
    status: "Paid",
    feestype: "",
    class_name: "",
    section_name: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addFee(formData);
      alert("Fees submitted successfully!");
      setFormData({
        admission_no: "",
        pay_date: "",
        pay_method: "Cash",
        paid_amount: "",
        receipt_no: "",
        status: "Paid",
        feestype: "",
        class_name: "",
        section_name: ""
      });
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err.response?.data?.message || "Fee submission failed.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Fees</Title>
        <Wrapper>
          <Link to="/admin-dashboard">
            <Icons><img src={home} alt="home" /></Icons>
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <Form>
        <Ftitle>Fees Addition</Ftitle>
        <Row>
          <Field>
            <Label>Admission Number *</Label>
            <Input
              name="admission_no"
              value={formData.admission_no}
              onChange={handleChange}
              placeholder="Enter Admission Number"
              required
            />
          </Field>

          <Field>
            <Label>Fee Type *</Label>
            <Select
              name="feestype"
              value={formData.feestype}
              onChange={handleChange}
              required
            >
              <option value="">Select Fee Type</option>
              <option value="Tuition">Tuition</option>
              <option value="Exam">Exam</option>
              <option value="Transport">Transport</option>
            </Select>
          </Field>

          <Field>
            <Label>Class *</Label>
            <Select
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Section *</Label>
            <Select
              name="section_name"
              value={formData.section_name}
              onChange={handleChange}
              required
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </Select>
          </Field>

          <Field>
            <Label>Payment Date *</Label>
            <Input
              name="pay_date"
              type="date"
              value={formData.pay_date}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <Label>Payment Method *</Label>
            <Select
              name="pay_method"
              value={formData.pay_method}
              onChange={handleChange}
              required
            >
              <option>Cash</option>
              <option>Online</option>
              <option>Bank Transfer</option>
            </Select>
          </Field>

          <Field>
            <Label>Paid Amount *</Label>
            <Input
              name="paid_amount"
              type="number"
              value={formData.paid_amount}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <Label>Receipt Number *</Label>
            <Input
              name="receipt_no"
              value={formData.receipt_no}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <Label>Status *</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option>Paid</option>
              <option>Unpaid</option>
            </Select>
          </Field>

          
        </Row>

        <ButtonContainer>
          <Button primary onClick={handleSubmit}>Submit</Button>
          <Button type="reset" onClick={() => setFormData({
            admission_no: "",
            pay_date: "",
            pay_method: "Cash",
            paid_amount: "",
            receipt_no: "",
            status: "Paid",
            fee_type: "",
            class_name: "",
            section: ""
          })}>Reset</Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default AdminFee;
