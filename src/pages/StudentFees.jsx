import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createFeeOrder, verifyFeePayment, getFeesByAdmissionNo } from "../api/ClientApi";

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }
  th {
    background-color: #f4f4f4;
  }
`;

const Button = styled.button`
  background-color: #0a66c2;
  color: white;
  padding: 10px 20px;
  margin-top: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const FeePaymentForm = () => {
  const defaultUniformRates = { shirt: 500, pant: 600, tie: 300, sweater: 700, shoes: 800 };

  const [admission_no, setAdmissionNo] = useState(null);
  const [student, setStudent] = useState({ admission_no: "", class_name: "", section_name: "" });
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [dueDates, setDueDates] = useState([]);
  const [fees, setFees] = useState([]);
  const [formData, setFormData] = useState({
    due_date: "",
    paid_amount: 0,
    uniform_selection: {
      shirt: false,
      pant: false,
      tie: false,
      sweater: false,
      shoes: false,
    },
  });

  const getDueDates = async () => {
    return ["2025-06-15", "2025-07-01", "2025-08-01"];
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
    }
    getDueDates().then(setDueDates);
  }, []);
  console.log("Admission No:", admission_no);

  const handleFeeTypeChange = (e) => {
    const type = e.target.value;
    setSelectedFeeType(type);

    // Find first unpaid matching fee
    const unpaidFee = fees.find(f => f.feestype === type && (f.total_amount - (f.paid_amount || 0)) > 0);

    if (unpaidFee) {
      setFormData((prev) => ({
        ...prev,
        due_date: unpaidFee.due_date,
        paid_amount: unpaidFee.total_amount - (unpaidFee.paid_amount || 0)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        paid_amount: 0
      }));
    }
  };


  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name.startsWith("uniform_selection.")) {
      const key = name.split(".")[1];
      setFormData(fd => ({
        ...fd,
        uniform_selection: { ...fd.uniform_selection, [key]: checked }
      }));
    } else {
      setFormData(fd => ({
        ...fd,
        [name]: type === "number" ? parseFloat(value || 0) : value
      }));
    }
  };

  const getUniformTotal = () =>
    Object.entries(formData.uniform_selection)
      .filter(([, sel]) => sel)
      .reduce((sum, [k]) => sum + defaultUniformRates[k], 0);

  const getFeeSummaryAmount = () => {
    switch (selectedFeeType) {
      case "Tuition": return 100;
      case "Books": return 100;
      case "Transport": return 100;
      case "Uniform": return getUniformTotal();
      case "Multiple": return 100 + 100 + 100 + getUniformTotal();
      default: return 0;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const payload = {
      ...student,
      feestype: selectedFeeType,
      due_date: formData.due_date,
      paid_amount: formData.paid_amount,
      uniform_details: formData.uniform_selection,
      total_fee: getFeeSummaryAmount(),
    };
    try {
      const orderRes = await createFeeOrder(payload, admission_no);
      const options = {
        key: "rzp_test_FFJX9DG8jkqrES",
        amount: orderRes.order.amount,
        currency: "INR",
        order_id: orderRes.order.id,
        name: "Your School Name",
        description: "Fee Payment",
        handler: async (response) => {
          const verify = {
            ...response,
            admission_no: student.admission_no
          };
          const verifyResponse = await verifyFeePayment(verify);
          console.log("Payment verified", verifyResponse);
        },
        theme: { color: "#0a66c2" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <Container>
      <Title>Student Fee Payment</Title>

      <Label>Select Fee Type</Label>
      <Select value={selectedFeeType} onChange={handleFeeTypeChange}>
        <option value="pay_method">-- Select Fee Type --</option>
        <option value="Tuition">Tuition</option>
        <option value="Books">Books</option>
        <option value="Transport">Transport</option>
        <option value="Uniform">Uniform</option>
        <option value="Multiple">Multiple</option>
      </Select>

      {selectedFeeType && (
        <>
          <Table>
            <thead>
              <tr>
                <th>Due Date</th>
                <th>Receipt Book</th>
                <th>Fee Name</th>
                <th>Actual Amount</th>
                <th>Paid Amount</th>
                <th>Outstanding Amount</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {fees
                .filter(f => selectedFeeType === "" || f.feestype === selectedFeeType)
                .map((fee, index) => {
                  const outstanding = fee.total_amount - (fee.paid_amount || 0);
                  return (
                    <tr key={index}>
                      <td>{fee.due_date}</td>
                      <td>{fee.receipt_book || `${fee.feestype.toUpperCase()} FEE (2025-26)`}</td>
                      <td>{fee.term_name || `${fee.feestype} Fee`}</td>
                      <td>{fee.total_amount} ₹</td>
                      <td>{fee.paid_amount || 0} ₹</td>
                      <td>{outstanding} ₹</td>
                      <td>
                        <input
                          type="radio"
                          name="selected_fee"
                          onChange={() => {
                            setFormData((prev) => ({
                              ...prev,
                              due_date: fee.due_date,
                              paid_amount: outstanding
                            }));
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>


          {selectedFeeType === "Uniform" && (
            <Table>
              <thead>
                <tr><th>Select</th><th>Item</th><th>Price</th></tr>
              </thead>
              <tbody>
                {Object.entries(defaultUniformRates).map(([item, rate]) => (
                  <tr key={item}>
                    <td>
                      <input
                        type="checkbox"
                        name={`uniform_selection.${item}`}
                        checked={formData.uniform_selection[item]}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>{item.charAt(0).toUpperCase() + item.slice(1)}</td>
                    <td>{rate} ₹</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Label>Due Date</Label>
          <Select name="due_date" value={formData.due_date} onChange={handleFormChange} required>
            <option value="">-- Select Due Date --</option>
            {dueDates.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </Select>

          <Label>Paid Amount</Label>
          <Input
            type="number"
            name="paid_amount"
            value={formData.paid_amount}
            onChange={handleFormChange}
            required
          />

          <Button type="submit" onClick={handlePayment}>Proceed to Pay</Button>
        </>
      )}
    </Container>
  );
};

export default FeePaymentForm;
