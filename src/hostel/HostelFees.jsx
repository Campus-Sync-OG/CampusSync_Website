import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  getFeeStatusByClassSection,
  getStudentFeeDetails,
  recordCashPayment,
} from "../api/ClientApi";

/* ================= STYLES (UNCHANGED) ================= */

const Container = styled.div`
  padding: 22px;
  font-family: "Roboto", sans-serif;
  background: #fafafa;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #002087;
  text-align: center;
  margin-bottom: 18px;
`;

const TopBar = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 12px;
  flex-wrap: wrap;
`;

const CountBox = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #333;
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-width: 140px;
  text-align: center;
`;

const Controls = styled.div`
  display:flex;
  gap: 10px;
  align-items: center;
  margin-left: auto;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  min-width: 220px;
  font-weight: 600;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 2px solid #002087;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: #002087;
  outline: none;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  background: white;
  padding: 10px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  margin-top: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;

  th {
    background: #002087;
    color: white;
    padding: 12px;
    font-size: 14px;
    text-align: center;
  }

  td {
    padding: 10px 12px;
    border-bottom: 2px solid #eee;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
`;

const ActionBtn = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  margin: 0 4px;
  color: white;

  &.pay { background: #df0043; }
`;

/* ================= COMPONENT ================= */

const formatCurrency = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const HostelFees = () => {
  const [fees, setFees] = useState([]);
  const [filters, setFilters] = useState({ class: "X", section: "A", q: "" });

  useEffect(() => {
    loadFees();
  }, [filters.class, filters.section]);

  const loadFees = async () => {
    try {
      const res = await getFeeStatusByClassSection({
        class_name: filters.class,
        section_name: filters.section,
        feestype: "Hostel",
      });

      const enriched = await Promise.all(
        res.details.map(async (plan, index) => {
          let studentName = "Student";
          let lastPayment = null;
          let receiptNo = null;

          try {
            const details = await getStudentFeeDetails(plan.admission_no);
            studentName = details.name;

            const hostelPayments = details.history.filter(
              h => h.fee_type === "Hostel"
            );

            if (hostelPayments.length > 0) {
              const latest = hostelPayments.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              )[0];

              lastPayment = latest.date;
              receiptNo = latest.receipt_no;
            }
          } catch {}

          return {
            id: index + 1,
            admission: plan.admission_no,
            name: studentName,
            class: filters.class,
            section: filters.section,
            hostel_fee: plan.total_fee,
            paid_amount: plan.paid_amount,
            due_amount: plan.due_amount,
            status:
              plan.paid_amount >= plan.total_fee
                ? "paid"
                : plan.paid_amount > 0
                ? "partial"
                : "unpaid",
            last_payment: lastPayment,
            receipt_no: receiptNo,
          };
        })
      );

      setFees(enriched);
    } catch (err) {
      console.error("Error fetching hostel fees:", err);
      setFees([]);
    }
  };

  const filtered = useMemo(() => {
    return fees.filter(f =>
      `${f.name} ${f.admission}`.toLowerCase().includes(filters.q.toLowerCase())
    );
  }, [fees, filters.q]);

  const handleMarkPaid = async (row) => {
    const amount = prompt("Enter amount", row.due_amount);
    if (!amount) return;

    await recordCashPayment({
      admission_no: row.admission,
      feestype: "Hostel",
      paid_amount: Number(amount),
    });

    loadFees();
  };

  return (
    <Container>
      <Title>🏨 Hostel Fee Details</Title>

      <TopBar>
        <CountBox>Total: {fees.length}</CountBox>
        <CountBox>Paid: {fees.filter(f => f.status === "paid").length}</CountBox>
        <CountBox>Due: {fees.filter(f => f.status !== "paid").length}</CountBox>

        <Controls>
          <Select value={filters.class} onChange={e => setFilters(f => ({ ...f, class: e.target.value }))}>
            <option value="X">X</option>
            <option value="9">9</option>
            <option value="8">8</option>
          </Select>

          <Select value={filters.section} onChange={e => setFilters(f => ({ ...f, section: e.target.value }))}>
            <option value="A">A</option>
            <option value="B">B</option>
          </Select>

          <SearchInput placeholder="Search" value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} />
        </Controls>
      </TopBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Admission</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Hostel Fee</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
              <th>Last Payment</th>
              <th>Receipt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                <td>{row.admission}</td>
                <td>{row.name}</td>
                <td>{row.class}</td>
                <td>{row.section}</td>
                <td>{formatCurrency(row.hostel_fee)}</td>
                <td>{formatCurrency(row.paid_amount)}</td>
                <td>{formatCurrency(row.due_amount)}</td>
                <td>{row.status}</td>
                <td>{row.last_payment || "-"}</td>
                <td>{row.receipt_no || "-"}</td>
                <td>
                  <ActionBtn className="pay" onClick={() => handleMarkPaid(row)}>
                    Mark Paid
                  </ActionBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default HostelFees;
