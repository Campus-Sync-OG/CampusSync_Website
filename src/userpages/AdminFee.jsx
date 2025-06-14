import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { addFee } from "../api/ClientApi"; // adjust path if needed
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

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
    section_name: "",
    tuition_fee: "",
    transport_fee: "",
    shirt: "",
    pant: "",
    tie: "",
    shoe: "",
    uniform_fee: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Auto-calculate uniform_fee if any item changes
    if (["shirt", "pant", "tie", "shoe"].includes(name)) {
      const shirt = parseFloat(updatedForm.shirt || 0);
      const pant = parseFloat(updatedForm.pant || 0);
      const tie = parseFloat(updatedForm.tie || 0);
      const shoe = parseFloat(updatedForm.shoe || 0);
      updatedForm.uniform_fee = shirt + pant + tie + shoe;
    }

    setFormData(updatedForm);
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
        section_name: "",
        tuition_fee: "",
        transport_fee: "",
        shirt: "",
        pant: "",
        tie: "",
        shoe: "",
        uniform_fee: ""
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
          <Icons onClick={() => navigate(-1)}><img src={back} alt="back" /></Icons>
        </Wrapper>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Ftitle>Fees Addition</Ftitle>
        <Row>
          <Field>
            <Label>Admission Number *</Label>
            <Input name="admission_no" value={formData.admission_no} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Fee Type *</Label>
            <Select name="feestype" value={formData.feestype} onChange={handleChange} required>
              <option value="">Select Fee Type</option>
              <option value="Tuition">Tuition</option>
              <option value="Exam">Exam</option>
              <option value="Transport">Transport</option>
              <option value="Uniform">Uniform</option>
            </Select>
          </Field>

          <Field>
            <Label>Class *</Label>
            <Select name="class_name" value={formData.class_name} onChange={handleChange} required>
              <option value="">Select Class</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Section *</Label>
            <Select name="section_name" value={formData.section_name} onChange={handleChange} required>
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </Select>
          </Field>

          <Field>
            <Label>Payment Date *</Label>
            <Input name="pay_date" type="date" value={formData.pay_date} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Payment Method *</Label>
            <Select name="pay_method" value={formData.pay_method} onChange={handleChange} required>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Select>
          </Field>

          <Field>
            <Label>Paid Amount *</Label>
            <Input name="paid_amount" type="number" value={formData.paid_amount} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Receipt Number *</Label>
            <Input name="receipt_no" value={formData.receipt_no} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Status *</Label>
            <Select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </Select>
          </Field>

          <Field>
            <Label>Tuition Fee</Label>
            <Input name="tuition_fee" type="number" value={formData.tuition_fee} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Transport Fee</Label>
            <Input name="transport_fee" type="number" value={formData.transport_fee} onChange={handleChange} />
          </Field>

          {/* Uniform Breakdown */}
          <Field>
            <Label>Shirt Price</Label>
            <Input name="shirt" type="number" value={formData.shirt} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Pant Price</Label>
            <Input name="pant" type="number" value={formData.pant} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Tie Price</Label>
            <Input name="tie" type="number" value={formData.tie} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Shoe Price</Label>
            <Input name="shoe" type="number" value={formData.shoe} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Total Uniform Fee</Label>
            <Input name="uniform_fee" type="number" value={formData.uniform_fee} readOnly />
          </Field>
        </Row>

        <ButtonContainer>
          <Button type="submit" primary>Submit</Button>
          <Button
            type="button"
            onClick={() =>
              setFormData({
                admission_no: "",
                pay_date: "",
                pay_method: "Cash",
                paid_amount: "",
                receipt_no: "",
                status: "Paid",
                feestype: "",
                class_name: "",
                section_name: "",
                tuition_fee: "",
                transport_fee: "",
                shirt: "",
                pant: "",
                tie: "",
                shoe: "",
                uniform_fee: ""
              })
            }
          >Reset</Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default AdminFee;

export const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Icons = styled.div`
  cursor: pointer;
  padding: 0.3rem;
  img {
    width: 24px;
    height: 24px;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: gray;
  margin: 0 10px;
`;

export const Form = styled.form`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;

export const Ftitle = styled.h3`
  text-align: center;
  margin-bottom: 1rem;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Field = styled.div`
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 0.3rem;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button`
  background: ${({ primary }) => (primary ? "#4CAF50" : "#ccc")};
  color: ${({ primary }) => (primary ? "#fff" : "#000")};
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
`;
