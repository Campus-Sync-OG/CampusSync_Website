import React, { useState } from "react";
import styled from "styled-components";
import { createFeeOrder, verifyFeePayment } from "../api/ClientApi";

// === Styled Components ===
const Container = styled.div`
  max-width: 750px;
  margin: auto;
  padding: 2rem;
  background: #fefefe;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #0a66c2;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #094d96;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;

  th, td {
    border: 1px solid #ccc;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: #f0f0f0;
  }
`;

const FeePaymentForm = () => {
  const [formData, setFormData] = useState({
    admission_no: "",
    class_name: "",
    section_name: "",
    due_date: "",
    feestype: "",
    pay_method: "Online",
    tuition_amount: 1,
    book_amount: 2000,
    transport_amount: 3000,
    uniform_details: { shirt: 500, pant: 600, tie: 300, sweater: 700, shoes: 800 },
    paid_amount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("uniform_details.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        uniform_details: {
          ...prev.uniform_details,
          [key]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "paid_amount" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const totalUniform = Object.values(formData.uniform_details).reduce((a, b) => a + b, 0);
  const totalFee = (formData.tuition_amount || 0) + (formData.book_amount || 0) + (formData.transport_amount || 0) + totalUniform;

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const orderResponse = await createFeeOrder(formData);
      const orderId = orderResponse.order.id;

      const options = {
        key: "your_razorpay_key", // Replace with your Razorpay key
        amount: orderResponse.order.amount,
        currency: "INR",
        name: "Your School Name",
        description: "Fee Payment",
        order_id: orderId,
        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            admission_no: formData.admission_no,
          };
          const verifyResponse = await verifyFeePayment(paymentData);
          console.log("Payment verified", verifyResponse);
        },
        theme: { color: "#0a66c2" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const renderFeeTable = () => {
    const show = (type) => formData.feestype === type || formData.feestype === "Multiple";

    return (
      <Table>
        <thead>
          <tr>
            <th>Fee Category</th>
            <th>Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          {show("Tuition") && (
            <tr>
              <td>Tuition</td>
              <td>{formData.tuition_amount}</td>
            </tr>
          )}
          {show("Books") && (
            <tr>
              <td>Books</td>
              <td>{formData.book_amount}</td>
            </tr>
          )}
          {show("Transport") && (
            <tr>
              <td>Transport</td>
              <td>{formData.transport_amount}</td>
            </tr>
          )}
          {show("Uniform") &&
            Object.entries(formData.uniform_details).map(([item, amount]) => (
              <tr key={item}>
                <td>Uniform - {item.charAt(0).toUpperCase() + item.slice(1)}</td>
                <td>{amount}</td>
              </tr>
            ))}
          <tr>
            <th>Total</th>
            <th>{totalFee}</th>
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Title>Student Fee Payment</Title>
      <form onSubmit={handlePayment}>
        <FormGroup>
          <Label>Admission Number</Label>
          <Input name="admission_no" onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Class</Label>
          <Input name="class_name" onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Section</Label>
          <Input name="section_name" onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Due Date</Label>
          <Input name="due_date" type="date" onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Fee Type</Label>
          <Select name="feestype" onChange={handleChange} required>
            <option value="">-- Select Fee Type --</option>
            <option value="Tuition">Tuition</option>
            <option value="Books">Books</option>
            <option value="Transport">Transport</option>
            <option value="Uniform">Uniform</option>
            <option value="Multiple">Multiple</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Payment Method</Label>
          <Select name="pay_method" onChange={handleChange} required>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="UPI">UPI</option>
          </Select>
        </FormGroup>

        {formData.feestype && renderFeeTable()}

        <FormGroup>
          <Label>Enter Paid Amount</Label>
          <Input
            type="number"
            name="paid_amount"
            placeholder="Amount you are paying"
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Remaining Balance</Label>
          <Input
            value={Math.max(totalFee - formData.paid_amount, 0)}
            readOnly
            style={{ background: "#eee" }}
          />
        </FormGroup>

        <Button type="submit">Proceed to Pay</Button>
      </form>
    </Container>
  );
};

export default FeePaymentForm;
