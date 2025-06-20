import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { createFeePlanForClassSection, createFeeOrder, generateReceipt } from "../api/ClientApi";  // Update this path as per your project
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const AdminFee = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [feePlanData, setFeePlanData] = useState({
    class_name: "",
    section_name: "",
    feestype: "",
    total_fee: "",
    due_date: "",
    notes: "",
    items: []
  });


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
      if (!formData.admission_no) {
        alert("Admission No is required");
        return;
      }
      if (!formData.feestype) {
        alert("Fee type is required");
        return;
      }

      const { admission_no, ...otherData } = formData;

      // Step 1: Submit the fee order
      const feeResponse = await createFeeOrder(otherData, admission_no);

      alert("Fees submitted successfully!");

      // Step 2: Generate the receipt
      const receiptUrl = await generateReceipt({
        admission_no,
        feestype: formData.feestype
      });

      // Step 3: Show or open receipt
      if (receiptUrl) {
        alert("Receipt generated successfully!");
        console.log("Receipt URL:", receiptUrl);
        // Optionally open or display link
        window.open(receiptUrl, "_blank");
      }

      // Step 4: Reset form
      setFormData({
        admission_no: "",
        pay_date: "",
        pay_method: "Cash",
        paid_amount: "",
        status: "Paid",
        feestype: "",
        class_name: "",
        section_name: "",
        tuition_amount: "",
        transport_amount: "",
        book_amount: "",
        uniform_details: {
          shirt: "",
          pant: "",
          tie: "",
          shoe: ""
        }
      });
    } catch (err) {
      console.error("Submission or receipt generation failed:", err);
      alert(err.error || err.message || "An error occurred.");
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

      <Button type="button" onClick={() => setShowModal(true)}>Add Fee Plan</Button>

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
                <option key={i + 1} value={` ${i + 1}`}>{` ${i + 1}`}</option>
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
            <Label>Status *</Label>
            <Select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </Select>
          </Field>

          {(formData.feestype === "Tuition" || formData.feestype === "All") && (
            <Field>
              <Label>Tuition Fee</Label>
              <Input name="tuition_fee" type="number" value={formData.tuition_fee} onChange={handleChange} />
            </Field>
          )}

          {(formData.feestype === "Transport" || formData.feestype === "All") && (
            <Field>
              <Label>Transport Fee</Label>
              <Input name="transport_fee" type="number" value={formData.transport_fee} onChange={handleChange} />
            </Field>
          )}

          {(formData.feestype === "Uniform" || formData.feestype === "All") && (
            <>
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
            </>
          )}

        </Row>

        <ButtonContainer>
          <Button type="submit" primary>Submit</Button>
          <Button type="button" onClick={() => setFormData({
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
          })}>Reset</Button>
        </ButtonContainer>
      </Form>

      {showModal && (
        <ModalOverlay>
          <LargeModalContent>
          <ModalContent>
            <h3>Add Fee Plan</h3>

            <ModalRow>
              <ModalField>
                <Label>Class</Label>
                <Select
                  name="class_name"
                  value={feePlanData.class_name}
                  onChange={e => setFeePlanData({ ...feePlanData, class_name: e.target.value })}
                >
                  <option value="">Select Class</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={`${i + 1}`}>{`${i + 1}`}</option>
                  ))}
                </Select>
              </ModalField>

              <ModalField>
                <Label>Section</Label>
                <Select
                  name="section_name"
                  value={feePlanData.section_name}
                  onChange={e => setFeePlanData({ ...feePlanData, section_name: e.target.value })}
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </Select>
              </ModalField>
            </ModalRow>

            <ModalRow>
              <ModalField>
                <Label>Fee Type</Label>
                <Select
                  name="feestype"
                  value={feePlanData.feestype}
                  onChange={e => {
                    const feestype = e.target.value;
                    let items = [];
                    if (feestype === "Uniform") {
                      items = [
                        { item_name: "Shirt", amount: 0 },
                        { item_name: "Pant", amount: 0 },
                        { item_name: "Tie", amount: 0 },
                        { item_name: "Shoe", amount: 0 }
                      ];
                    } else if (feestype === "Books") {
                      items = [
                        { item_name: "Math Book", amount: 0 },
                        { item_name: "Science Book", amount: 0 }
                      ];
                    }
                    setFeePlanData(prev => ({
                      ...prev,
                      feestype,
                      items,
                      total_fee: 0
                    }));
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Tuition">Tuition</option>
                  <option value="Transport">Transport</option>
                  <option value="Books">Books</option>
                  <option value="Uniform">Uniform</option>
                </Select>
              </ModalField>

              <ModalField>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={feePlanData.due_date}
                  onChange={e => setFeePlanData({ ...feePlanData, due_date: e.target.value })}
                />
              </ModalField>
            </ModalRow>

            {["Books", "Uniform"].includes(feePlanData.feestype) && (
              <>
                <Label>{feePlanData.feestype} Item Details</Label>
                {feePlanData.items.map((item, idx) => (
                  <ModalRow key={idx}>
                    <ModalField>
                      <Input
                        placeholder="Item Name"
                        value={item.item_name}
                        onChange={e => {
                          const updatedItems = [...feePlanData.items];
                          updatedItems[idx].item_name = e.target.value;
                          setFeePlanData(prev => ({
                            ...prev,
                            items: updatedItems
                          }));
                        }}
                      />
                    </ModalField>
                    <ModalField>
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.amount}
                        onChange={e => {
                          const updatedItems = [...feePlanData.items];
                          updatedItems[idx].amount = parseFloat(e.target.value) || 0;
                          const sum = updatedItems.reduce((acc, itm) => acc + (itm.amount || 0), 0);
                          setFeePlanData(prev => ({
                            ...prev,
                            items: updatedItems,
                            total_fee: sum
                          }));
                        }}
                      />
                    </ModalField>
                    <Button
                      type="button"
                      onClick={() => {
                        const updatedItems = feePlanData.items.filter((_, i) => i !== idx);
                        const sum = updatedItems.reduce((acc, itm) => acc + (itm.amount || 0), 0);
                        setFeePlanData(prev => ({
                          ...prev,
                          items: updatedItems,
                          total_fee: sum
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  </ModalRow>
                ))}

                <Button
                  type="button"
                  onClick={() =>
                    setFeePlanData(prev => ({
                      ...prev,
                      items: [...prev.items, { item_name: "", amount: 0 }]
                    }))
                  }
                >
                  Add {feePlanData.feestype} Item
                </Button>
              </>
            )}


            {["Tuition", "Transport"].includes(feePlanData.feestype) && (
              <>
                <Label>Total Fee</Label>
                <Input
                  type="number"
                  value={feePlanData.total_fee}
                  onChange={e => setFeePlanData({ ...feePlanData, total_fee: parseFloat(e.target.value) || 0 })}
                />
              </>
            )}

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
              <Button
                type="button"
                primary
                onClick={async () => {
                  try {
                    const res = await createFeePlanForClassSection(feePlanData);
                    alert(res.message);
                    setShowModal(false);
                    setFeePlanData({
                      class_name: "",
                      section_name: "",
                      feestype: "",
                      total_fee: "",
                      due_date: "",
                      notes: "",
                      items: []
                    });
                  } catch (err) {
                    alert(err.error || "Error creating fee plan");
                  }
                }}
              >
                Create
              </Button>
              <Button type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </ModalContent>
          </LargeModalContent>
        </ModalOverlay>
      )}


    </Container>
  );
};

export default AdminFee;

/* Keep your styled components exactly as in your provided code */


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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);  /* semi-transparent overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
export const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
  height: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

export const ModalRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const ModalField = styled.div`
  flex: 1 1 48%;
  display: flex;
  flex-direction: column;
`;

export const LargeModalContent = styled(ModalContent)`
  width: 800px;
  max-width: 95%;
  height: auto;
  max-height: 90vh;
  overflow-y: auto;
`;


