import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createFeeOrder,
  verifyFeePayment,
  getFeesByAdmissionNo,
  generateReceipt,
  getStudentFeeStatus
} from "../api/ClientApi";

const Container = styled.div`
  padding: 40px 20px;
  max-width: 1000px;
  margin: auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #0a66c2;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: 600;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.95rem;

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #f4f8fc;
    font-weight: 600;
    color: #0a66c2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  input[type="radio"],
  input[type="checkbox"] {
    transform: scale(1.2);
    cursor: pointer;
  }
`;

const Button = styled.button`
  background-color: #0a66c2;
  color: white;
  padding: 12px 20px;
  margin-top: 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #004c9c;
  }
`;

const FeePaymentForm = () => {
  const [admission_no, setAdmissionNo] = useState(null);
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [uniformItems, setUniformItems] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
      loadFeeData(userData.unique_id);
    }
  }, []);

  const loadFeeData = async (adm_no) => {
    const res = await getStudentFeeStatus(adm_no);
    if (res.success) {
      setFees(res.data || []);
    } else {
      alert(res.error);
    }
  };

  const handleFeeSelect = (fee) => {
    setSelectedFee(fee);
    if (fee.feestype === "Uniform" && fee.item_details) {
      setUniformItems(
        fee.item_details.map(item => ({
          ...item,
          selected: false,
          quantity: 1
        }))
      );
      setPaidAmount(0);
    } else {
      setPaidAmount(fee.due_amount);
      setUniformItems([]);
    }
  };

  const toggleUniformItem = (idx) => {
    setUniformItems(prev => {
      const updated = [...prev];
      updated[idx].selected = !updated[idx].selected;
      return updated;
    });
  };

  const changeUniformQuantity = (idx, delta) => {
    setUniformItems(prev => {
      const updated = [...prev];
      if (!updated[idx].selected) return prev;
      updated[idx].quantity = Math.max(1, updated[idx].quantity + delta);
      return updated;
    });
  };

  const getUniformGrandTotal = () => {
    return uniformItems.reduce((sum, item) => {
      return sum + (item.selected ? item.amount * item.quantity : 0);
    }, 0);
  };

  const handlePayment = async () => {
    if (!selectedFee) {
      alert("Please select a fee type to pay.");
      return;
    }

    let finalAmount = paidAmount;
    let uniformDetails = null;

    if (selectedFee.feestype === "Uniform") {
      finalAmount = getUniformGrandTotal();
      uniformDetails = uniformItems
        .filter(item => item.selected)
        .map(item => ({
          item_name: item.item_name,
          amount: item.amount,
          quantity: item.quantity,
          total: item.amount * item.quantity
        }));

      if (finalAmount === 0) {
        alert("Please select at least one uniform item.");
        return;
      }
    }

    try {
      const payload = {
        admission_no,
        feestype: selectedFee.feestype,
        paid_amount: finalAmount,
        due_date: selectedFee.due_date,
        uniform_details: uniformDetails
      };

      const orderRes = await createFeeOrder(payload, admission_no);
      const options = {
        key: "rzp_test_FFJX9DG8jkqrES",
        amount: orderRes.order.amount,
        currency: "INR",
        order_id: orderRes.order.id,
        name: "Your School Name",
        description: "Fee Payment",
        handler: async (response) => {
          await verifyFeePayment({
            ...response,
            admission_no
          });

          const receiptUrl = await generateReceipt({
            admission_no,
            feestype: selectedFee.feestype,
          });

          if (receiptUrl) {
            window.open(receiptUrl, "_blank");
          }

          await loadFeeData(admission_no);
          setSelectedFee(null);
          setPaidAmount(0);
          setUniformItems([]);
        },
        theme: { color: "#0a66c2" }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  return (
    <Container>
      <Title>Student Fee Payment</Title>

      <Table>
        <thead>
          <tr>
            <th>Fee Type</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Pending</th>
            <th>Due Date</th>
            <th>Pay Now</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, idx) => (
            <tr key={idx}>
              <td>{fee.feestype}</td>
              <td>{fee.total_fee} ₹</td>
              <td>{fee.paid_amount} ₹</td>
              <td>{fee.due_amount} ₹</td>
              <td>{fee.due_date.split("T")[0]}</td>
              <td>
                <Button onClick={() => handleFeeSelect(fee)}>Select</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedFee && (
        <>
          <p><b>Selected Fee Type:</b> {selectedFee.feestype}</p>
          <p><b>Due Date:</b> {selectedFee.due_date.split("T")[0]}</p>
          <p><b>Pending:</b> {selectedFee.due_amount} ₹</p>

          {selectedFee.feestype !== "Uniform" && (
            <>
              <p>Enter Paid Amount:</p>
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
              />
            </>
          )}

          {selectedFee.feestype === "Uniform" && uniformItems.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {uniformItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleUniformItem(idx)}
                      />
                    </td>
                    <td>{item.item_name}</td>
                    <td>{item.amount} ₹</td>
                    <td>
                      {item.selected && (
                        <>
                          <Button onClick={() => changeUniformQuantity(idx, -1)}>-</Button>
                          {item.quantity}
                          <Button onClick={() => changeUniformQuantity(idx, 1)}>+</Button>
                        </>
                      )}
                    </td>
                    <td>{item.selected ? item.amount * item.quantity : 0} ₹</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign: "right" }}><b>Total</b></td>
                  <td><b>{getUniformGrandTotal()} ₹</b></td>
                </tr>
              </tfoot>
            </Table>
          )}

          <Button onClick={handlePayment}>Proceed to Pay</Button>
        </>
      )}
    </Container>
  );
};

export default FeePaymentForm;