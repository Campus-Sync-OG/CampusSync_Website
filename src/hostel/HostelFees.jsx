// src/pages/HostelFees.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

/* Reuse same tokens and style language as HostelAttendance */
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

const ExportButton = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: #9a34ff;
  color: white;
  cursor: pointer;
  font-weight: 700;
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

  tr:hover td {
    background: #fff6f8;
  }

  .muted { font-weight: 500; color: #666; font-size: 13px; }
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

  &.view { background: #002087; }
  &.pay { background: #df0043; }
  &.edit { background: #9a34ff; }
`;

const SaveButton = styled.button`
  margin-top: 18px;
  display: block;
  margin-left: auto;
  margin-right: 0;
  padding: 11px 20px;
  background: #df0043;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #002087;
  }
`;

/* Dummy data for fees (you will replace with API data) */
const dummyFees = [
  {
    id: 1,
    unique_id: "S-2025-0001",
    admission: "A001",
    name: "Gnana Dev",
    class: "10",
    section: "A",
    hostel_fee: 5000,
    paid_amount: 5000,
    due_amount: 0,
    status: "paid",
    last_payment: "2025-06-01",
    receipt_no: "R-1001",
  },
  {
    id: 2,
    unique_id: "S-2025-0002",
    admission: "A002",
    name: "Rohan Kumar",
    class: "10",
    section: "B",
    hostel_fee: 5000,
    paid_amount: 3000,
    due_amount: 2000,
    status: "partial",
    last_payment: "2025-06-10",
    receipt_no: "R-1002",
  },
  {
    id: 3,
    unique_id: "S-2025-0003",
    admission: "A003",
    name: "Sneha Raj",
    class: "9",
    section: "A",
    hostel_fee: 4500,
    paid_amount: 0,
    due_amount: 4500,
    status: "unpaid",
    last_payment: null,
    receipt_no: null,
  },
  {
    id: 4,
    unique_id: "S-2025-0004",
    admission: "A004",
    name: "Arjun Mehta",
    class: "8",
    section: "C",
    hostel_fee: 4800,
    paid_amount: 4800,
    due_amount: 0,
    status: "paid",
    last_payment: "2025-05-20",
    receipt_no: "R-1004",
  },
];

const formatCurrency = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const HostelFees = () => {
  const [fees, setFees] = useState([]);
  const [filters, setFilters] = useState({ class: "All", section: "All", q: "" });
  const [editedMap, setEditedMap] = useState({}); // id -> partial edits

  useEffect(() => {
    // simulate fetch
    const load = async () => {
      await new Promise(r => setTimeout(r, 300));
      setFees(dummyFees);
    };
    load();
  }, []);

  const classes = useMemo(() => ["All", ...Array.from(new Set(fees.map(f => f.class)))], [fees]);
  const sections = useMemo(() => ["All", ...Array.from(new Set(fees.map(f => f.section)))], [fees]);

  const filtered = useMemo(() => {
    return fees.filter(f => {
      if (filters.class !== "All" && f.class !== filters.class) return false;
      if (filters.section !== "All" && f.section !== filters.section) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!(`${f.name} ${f.admission} ${f.unique_id}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [fees, filters]);

  const totalCount = fees.length;
  const paidCount = fees.filter(f => f.status === "paid").length;
  const unpaidCount = fees.filter(f => f.status === "unpaid").length;
  const partialCount = fees.filter(f => f.status === "partial").length;
  const totalDue = fees.reduce((s, f) => s + (f.due_amount || 0), 0);

  const updatePaid = (id, newPaid) => {
    setFees(prev => prev.map(f => {
      if (f.id !== id) return f;
      const paid = Number(newPaid || 0);
      const due = Math.max(0, f.hostel_fee - paid);
      const status = paid >= f.hostel_fee ? "paid" : (paid > 0 ? "partial" : "unpaid");
      return { ...f, paid_amount: paid, due_amount: due, status, last_payment: paid ? new Date().toISOString().slice(0,10) : f.last_payment, receipt_no: paid ? (f.receipt_no || `R-${1000 + f.id}`) : f.receipt_no };
    }));
    setEditedMap(m => ({ ...m, [id]: true }));
  };

  const handleMarkPaid = (row) => {
    const pay = window.prompt(`Enter amount to mark as paid for ${row.name} (Hostel Fee: ${row.hostel_fee})`, String(row.hostel_fee));
    if (pay === null) return;
    const amount = Number(pay);
    if (Number.isNaN(amount) || amount < 0) { alert("Invalid amount"); return; }
    updatePaid(row.id, Math.min(amount, row.hostel_fee));
  };

  const handleViewReceipt = (row) => {
    // create a simple receipt string and trigger download (simulate)
    const content = `
      Receipt No: ${row.receipt_no || "N/A"}
      Student: ${row.name} (${row.admission})
      Unique ID: ${row.unique_id}
      Hostel Fee: ${row.hostel_fee}
      Paid: ${row.paid_amount}
      Due: ${row.due_amount}
      Date: ${row.last_payment || "N/A"}
    `;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${row.admission || row.unique_id}_receipt.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleInlineEdit = (id, field, value) => {
    setFees(prev => prev.map(f => f.id === id ? ({ ...f, [field]: value }) : f));
    setEditedMap(m => ({ ...m, [id]: true }));
  };

  const exportCSV = () => {
    const rows = [
      ["unique_id", "admission", "name", "class", "section", "hostel_fee", "paid_amount", "due_amount", "status", "last_payment", "receipt_no"]
    ];
    filtered.forEach(r => {
      rows.push([r.unique_id, r.admission, r.name, r.class, r.section, r.hostel_fee, r.paid_amount, r.due_amount, r.status, r.last_payment || "", r.receipt_no || ""]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `hostel_fees_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSaveAll = () => {
    // In real app: send edited rows to API
    const editedIds = Object.keys(editedMap).filter(k => editedMap[k]);
    if (editedIds.length === 0) {
      alert("No changes to save.");
      return;
    }
    // simulate save
    setTimeout(() => {
      alert(`Saved ${editedIds.length} record(s) successfully.`);
      setEditedMap({});
    }, 500);
  };

  return (
    <Container>
      <Title>🏨 Hostel Fee Details</Title>

      <TopBar>
        <CountBox>Total: {totalCount}</CountBox>
        <CountBox>✅ Paid: {paidCount}</CountBox>
        <CountBox>⚠️ Partial: {partialCount}</CountBox>
        <CountBox>❌ Unpaid: {unpaidCount}</CountBox>
        <CountBox>💸 Total Due: {formatCurrency(totalDue)}</CountBox>

        <Controls>
          <Select value={filters.class} onChange={e => setFilters(f => ({ ...f, class: e.target.value }))}>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Select value={filters.section} onChange={e => setFilters(f => ({ ...f, section: e.target.value }))}>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>

          <SearchInput placeholder="Search by name / admission / id" value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} />

          <ExportButton onClick={exportCSV}>Export CSV</ExportButton>
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="muted">No records found.</td>
              </tr>
            ) : filtered.map(row => (
              <tr key={row.id}>
                <td>{row.admission}</td>
                <td style={{ textAlign: "left", paddingLeft: 18 }}>{row.name}</td>
                <td>{row.class}</td>
                <td>{row.section}</td>
                <td>{formatCurrency(row.hostel_fee)}</td>

                {/* Paid inline editable */}
                <td>
                  <input
                    type="number"
                    min={0}
                    style={{ width: 90, padding: 6, borderRadius: 8, border: "1px solid #ddd", fontWeight: 700 }}
                    value={row.paid_amount}
                    onChange={e => handleInlineEdit(row.id, "paid_amount", Number(e.target.value))}
                    onBlur={e => {
                      // ensure constraints & recalc due/status
                      const val = Number(e.target.value || 0);
                      updatePaid(row.id, Math.min(val, row.hostel_fee));
                    }}
                  />
                </td>

                <td>{formatCurrency(row.due_amount)}</td>
                <td style={{ textTransform: "capitalize" }}>{row.status}</td>
                <td className="muted">{row.last_payment || "-"}</td>
                <td className="muted">{row.receipt_no || "-"}</td>

                <td>
                  <ActionBtn className="view" onClick={() => handleViewReceipt(row)}>View</ActionBtn>
                  <ActionBtn className="pay" onClick={() => handleMarkPaid(row)}>Mark Paid</ActionBtn>
                  <ActionBtn className="edit" onClick={() => {
                    const newPaid = window.prompt("Enter new paid amount", String(row.paid_amount));
                    if (newPaid === null) return;
                    const n = Number(newPaid);
                    if (Number.isNaN(n) || n < 0) return alert("Invalid amount");
                    updatePaid(row.id, Math.min(n, row.hostel_fee));
                  }}>Save</ActionBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <SaveButton onClick={handleSaveAll}>💾 Save Changes</SaveButton>
    </Container>
  );
};

export default HostelFees;
