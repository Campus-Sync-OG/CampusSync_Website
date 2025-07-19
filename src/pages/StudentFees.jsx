import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createFeeOrder,
  verifyFeePayment,
  getFeesByAdmissionNo,
  generateReceipt,
  getStudentFeeStatus,
} from "../api/ClientApi";

import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { generateReceiptPdf } from "../utils/generateReceiptPdf";

const Container = styled.div`
  padding: 0px 15px;
  margin: auto;
  
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

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 1px 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 30px;
`;

const NavTitle = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
`;

const NavIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
  padding: 10px;
`;

const IconDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: white;
`;


const FeePaymentForm = () => {
  const [admission_no, setAdmissionNo] = useState(null);
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [uniformItems, setUniformItems] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const navigate = useNavigate();

  const handleHomeClick = () => navigate("/dashboard");
  const handleBackClick = () => navigate(-1);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
      loadFeeData(userData.unique_id);
      loadFeeRecords(userData.unique_id);
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

  const loadFeeRecords = async (adm_no) => {
    const res = await getFeesByAdmissionNo(adm_no);
    if (res.success) {
      setFeeRecords(res.data || []);
    }
  };

  const handleFeeSelect = (fee) => {
    setSelectedFee(fee);

    if (fee.feestype === "Uniform" && fee.item_details) {
      const items = fee.item_details.map((item) => ({
        item_name: item.item_name,
        amount: item.amount,
        selected: false,
        quantity: 1,
      }));
      setUniformItems(items);
      setPaidAmount(0);
    } else {
      setUniformItems([]);
      setPaidAmount(fee.due_amount);
    }
  };

  const toggleUniformItem = (idx) => {
    setUniformItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const changeUniformQuantity = (idx, delta) => {
    setUniformItems((prev) =>
      prev.map((item, i) =>
        i === idx && item.selected
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const getUniformGrandTotal = () => {
    return uniformItems.reduce(
      (sum, item) => sum + (item.selected ? item.amount * item.quantity : 0),
      0
    );
  };

  const handleGenerateReceipt = (record) => {
    navigate("/receipt", {
      state: { receipt: record }
    });
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
        .filter((item) => item.selected)
        .map((item) => ({
          item_name: item.item_name,
          amount: item.amount,
          quantity: item.quantity,
          total: item.amount * item.quantity,
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
        uniform_details: uniformDetails,
      };

      const orderRes = await createFeeOrder(payload, admission_no);
      const options = {
        key: "rzp_test_7fhdtLtzRXOZDh",
        amount: orderRes.order.amount,
        currency: "INR",
        order_id: orderRes.order.id,
        name: "Your School Name",
        description: "Fee Payment",
        handler: async (response) => {
          await verifyFeePayment({
            ...response,
            admission_no,
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
        theme: { color: "#0a66c2" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  return (
    <Container>
      <NavContainer>
        <NavTitle>Student Fee Payment</NavTitle>
        <NavIcons>
          <NavIcon src={homeIcon} alt="Home" onClick={handleHomeClick} />
          <IconDivider />
          <NavIcon src={backIcon} alt="Back" onClick={handleBackClick} />
        </NavIcons>
      </NavContainer>

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
          <p>
            <b>Selected Fee Type:</b> {selectedFee.feestype}
          </p>
          <p>
            <b>Due Date:</b> {selectedFee.due_date.split("T")[0]}
          </p>
          <p>
            <b>Pending:</b> {selectedFee.due_amount} ₹
          </p>

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

          {selectedFee?.feestype === "Uniform" && uniformItems.length > 0 && (
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
                      {item.selected ? (
                        <>
                          <Button
                            onClick={() => changeUniformQuantity(idx, -1)}
                          >
                            -
                          </Button>
                          {item.quantity}
                          <Button onClick={() => changeUniformQuantity(idx, 1)}>
                            +
                          </Button>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{item.selected ? item.amount * item.quantity : 0} ₹</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" align="right">
                    <b>Total</b>
                  </td>
                  <td>
                    <b>{getUniformGrandTotal()} ₹</b>
                  </td>
                </tr>
              </tfoot>
            </Table>
          )}

          <Button onClick={handlePayment}>Proceed to Pay</Button>
        </>

      )}

      {feeRecords.length > 0 && (
        <div>
          <h3 style={{ marginTop: "40px" }}>Paid Fee Records</h3>
          <Table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Fee Type</th>
                <th>Paid Amount</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.feestype}</td>
                  <td>{record.paid_amount} ₹</td>
                  <td>{record.pay_date?.split("T")[0]}</td>
                  <td>{record.pay_method}</td>
                  <td>
                    <Button onClick={() => generateReceiptPdf(record)}>
                      Generate Receipt
                    </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default FeePaymentForm;
