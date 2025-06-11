import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createFeeOrder,
  verifyFeePayment,
  getFeesByAdmissionNo,
  generateReceipt,
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
  const defaultUniformRates = {
    shirt: 500,
    pant: 600,
    tie: 300,
    sweater: 700,
    shoes: 800,
  };

  const [admission_no, setAdmissionNo] = useState(null);
  const [student, setStudent] = useState({
    admission_no: "",
    class_name: "",
    section_name: "",
  });
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [dueDates, setDueDates] = useState([]);
  const [fees, setFees] = useState([]);
  const [lastPayment, setLastPayment] = useState(null);
  const [formData, setFormData] = useState({
    due_date: "",
    paid_amount: 0,
    uniform_selection: {
      shirt: { selected: false, quantity: 1 },
      pant: { selected: false, quantity: 1 },
      tie: { selected: false, quantity: 1 },
      sweater: { selected: false, quantity: 1 },
      shoes: { selected: false, quantity: 1 },
    },
  });

  const getDueDates = async () => {
    return ["2025-06-15", "2025-07-01", "2025-08-01"];
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
      getFeesByAdmissionNo(userData.unique_id).then((res) => {
        setFees(res.data || []);
        setStudent({
          admission_no: userData.unique_id,
          class_name: res.data?.[0]?.class_name || "",
          section_name: res.data?.[0]?.section_name || "",
        });
      });
    }
    getDueDates().then(setDueDates);
  }, []);

  const handleFeeTypeChange = (e) => {
    const type = e.target.value;
    setSelectedFeeType(type);
    const unpaidFee = fees.find(
      (f) => f.feestype === type && f.total_amount - (f.paid_amount || 0) > 0
    );

    if (unpaidFee) {
      setFormData((prev) => ({
        ...prev,
        due_date: unpaidFee.due_date,
        paid_amount: unpaidFee.total_amount - (unpaidFee.paid_amount || 0),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        paid_amount: 0,
      }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name.startsWith("uniform_selection.")) {
      const [, item, field] = name.split(".");
      setFormData((fd) => ({
        ...fd,
        uniform_selection: {
          ...fd.uniform_selection,
          [item]: {
            ...fd.uniform_selection[item],
            [field]: field === "selected" ? checked : parseInt(value || 1),
          },
        },
      }));
    } else {
      setFormData((fd) => ({
        ...fd,
        [name]: type === "number" ? parseFloat(value || 0) : value,
      }));
    }
  };

  const getUniformTotal = () =>
    Object.entries(formData.uniform_selection)
      .filter(([, data]) => data.selected)
      .reduce(
        (sum, [item, data]) => sum + defaultUniformRates[item] * data.quantity,
        0
      );

  const getFeeSummaryAmount = () => {
    if (selectedFeeType === "Uniform") return getUniformTotal();
    if (selectedFeeType === "Multiple")
      return 100 + 100 + 100 + getUniformTotal();
    return formData.paid_amount;
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
        key: "rzp_test_FFJX9DG8jkqrES", // Replace with your Razorpay key
        amount: orderRes.order.amount,
        currency: "INR",
        order_id: orderRes.order.id,
        name: "Your School Name",
        description: "Fee Payment",
        handler: async (response) => {
          const verify = {
            ...response,
            admission_no: student.admission_no,
          };

          await verifyFeePayment(verify);
          const receiptWindow = window.open("", "_blank");

          try {
            const receiptUrl = await generateReceipt({
              admission_no: student.admission_no,
              feestype: selectedFeeType,
            });

            window.open(receiptUrl, "_blank"); // 👈 Opens PDF in new tab

            const link = document.createElement("a");
            link.href = receiptUrl;
            link.download = receiptUrl.split("/").pop(); // Extract filename
            document.body.appendChild(link);
            link.click();
            link.remove();
          } catch (err) {
            alert("Receipt not available.");
            console.error("Receipt error:", err);
          }

          setLastPayment({
            response,
            feestype: selectedFeeType,
          });

          const refreshed = await getFeesByAdmissionNo(admission_no);
          setFees(refreshed.data || []);
        },
        theme: { color: "#0a66c2" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  const handleManualReceipt = async () => {
    if (!lastPayment) {
      alert("No payment found to generate receipt.");
      return;
    }

    try {
      const receiptWindow = window.open("", "_blank");
      const receiptData = await generateReceipt({
        admission_no: student.admission_no,
        feestype: lastPayment.feestype,
        pay_response: lastPayment.response,
      });

      if (receiptData?.receiptUrl) {
        receiptWindow.location.href = receiptData.receiptUrl;
      } else {
        receiptWindow.document.body.innerHTML = "<p>Receipt not found.</p>";
      }
    } catch (err) {
      alert("Error generating receipt. Please try again.");
      console.error(err);
    }
  };

  return (
    <Container>
      <Title>Student Fee Payment</Title>

      <Label>Select Fee Type</Label>
      <Select value={selectedFeeType} onChange={handleFeeTypeChange}>
        <option value="">-- Select Fee Type --</option>
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
                <th>Total</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {fees
                .filter((f) => f.feestype === selectedFeeType)
                .map((fee, i) => {
                  const pending = fee.total_amount - (fee.paid_amount || 0);
                  return (
                    <tr key={i}>
                      <td>{fee.due_date}</td>
                      <td>
                        {fee.receipt_book ||
                          `${fee.feestype.toUpperCase()} FEE (2025-26)`}
                      </td>
                      <td>{fee.term_name || `${fee.feestype} Fee`}</td>
                      <td>{fee.total_amount} ₹</td>
                      <td>{fee.paid_amount || 0} ₹</td>
                      <td>{pending} ₹</td>
                      <td>
                        <input
                          type="checkbox"
                          name="selected_fee"
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              due_date: fee.due_date,
                              paid_amount: pending,
                            }))
                          }
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
                <tr>
                  <th>Select</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(defaultUniformRates).map(([item, rate]) => {
                  const selected = formData.uniform_selection[item].selected;
                  const quantity = formData.uniform_selection[item].quantity;

                  const handleQuantityChange = (delta) => {
                    if (!selected) return;
                    setFormData((fd) => {
                      const newQty = Math.max(
                        1,
                        fd.uniform_selection[item].quantity + delta
                      );
                      return {
                        ...fd,
                        uniform_selection: {
                          ...fd.uniform_selection,
                          [item]: {
                            ...fd.uniform_selection[item],
                            quantity: newQty,
                          },
                        },
                      };
                    });
                  };

                  return (
                    <tr key={item}>
                      <td>
                        <input
                          type="checkbox"
                          name={`uniform_selection.${item}.selected`}
                          checked={selected}
                          onChange={handleFormChange}
                        />
                      </td>
                      <td>
                        {item.charAt(0).toUpperCase() + item.slice(1)}{" "}
                        {selected && (
                          <span style={{ marginLeft: "10px" }}>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(-1)}
                              style={{ padding: "2px 6px", marginRight: "5px" }}
                            >
                              −
                            </button>
                            {quantity}
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(1)}
                              style={{ padding: "2px 6px", marginLeft: "5px" }}
                            >
                              +
                            </button>
                          </span>
                        )}
                      </td>
                      <td>{rate} ₹</td>
                      <td>{selected ? rate * quantity : 0} ₹</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total
                  </td>
                  <td style={{ fontWeight: "bold" }}>{getUniformTotal()} ₹</td>
                </tr>
              </tfoot>
            </Table>
          )}

          <Label>Due Date</Label>
          <Select
            name="due_date"
            value={formData.due_date}
            onChange={handleFormChange}
            required
          >
            <option value="">-- Select Due Date --</option>
            {dueDates.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
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

          <Button type="submit" onClick={handlePayment}>
            Proceed to Pay
          </Button>

          {/* 🆕 Button to manually regenerate receipt */}
          {lastPayment !== null && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Button
                type="button"
                onClick={handleManualReceipt}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Generate Receipt Again
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default FeePaymentForm;
