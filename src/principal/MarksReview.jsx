// src/pages/principal/MarksReview.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPendingMarksForPrincipal, reviewMarksSubmission } from "../api/ClientApi";
import { FiChevronLeft } from "react-icons/fi";

export default function MarksReview() {
  const { id } = useParams(); // notification id
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadSubmission = async () => {
    setLoading(true);
    try {
      const res = await fetchPendingMarksForPrincipal(); // returns all pending
      const found = (res.pending || []).find((p) => String(p.notification_id) === String(id));
      if (!found) {
        alert("Submission not found or maybe already reviewed.");
        navigate(-1);
        return;
      }
      setSubmission(found);
    } catch (err) {
      console.error(err);
      alert("Failed to load submission.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this submission?`)) return;
    setActionLoading(true);
    try {
      await reviewMarksSubmission(id, action, comment);
      alert(`Submission ${action} successfully.`);
      navigate("/principal-dashboard"); // back to list
    } catch (err) {
      console.error(err);
      alert("Action failed. See console.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Wrap><Loader>Loading…</Loader></Wrap>;
  if (!submission) return <Wrap><Loader>Not found.</Loader></Wrap>;

  const s = submission.submission || {};

  return (
    <Wrap>
      <Topbar>
        <TopInner>
          <LeftTop>
            <Back onClick={() => navigate(-1)} title="Back">
              <FiChevronLeft /> Back
            </Back>
            <Heading>
              {submission.title || "Marks Submission"}
              <SubHeading>{submission.submitted_by || "Unknown"} · {s.subject || "—"} · {s.class_grade}-{s.section}</SubHeading>
            </Heading>
          </LeftTop>

          <TopMeta>
            <MetaItem>
              <Label>Submitted</Label>
              <Value>{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : "-"}</Value>
            </MetaItem>
            <MetaItem>
              <Label>Exam</Label>
              <Value>{s.exam_format || s.exam_type || "—"}</Value>
            </MetaItem>
            <StatusBadge status={submission.status}>{submission.status || "Pending"}</StatusBadge>
          </TopMeta>
        </TopInner>
      </Topbar>

      <Container>
        <Card>
          <CardHeader>
            <h3>Marks Preview</h3>
            <small>Review the student marks list below. You can approve or reject with a comment.</small>
          </CardHeader>

          <TableWrap>
            <StyledTable>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Admission No</th>
                  <th>Student</th>
                  <th>Roll</th>
                  <th style={{ textAlign: "right" }}>Marks</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(s.marks || []).map((m, i) => (
                  <tr key={m.admission_no || i}>
                    <td>{i + 1}</td>
                    <td>{m.admission_no || "-"}</td>
                    <td>{m.student_name || "-"}</td>
                    <td>{m.roll_no || "-"}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{m.marks_obtained ?? "-"}</td>
                    <td style={{ textAlign: "right" }}>{m.total_marks ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableWrap>

          <CardFooter>
            <CommentBox
              placeholder="Optional comment (reason for rejection / notes)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Actions>
              <Reject disabled={actionLoading} onClick={() => handleAction("rejected")}>Reject</Reject>
              <Approve disabled={actionLoading} onClick={() => handleAction("approved")}>Approve</Approve>
            </Actions>
          </CardFooter>
        </Card>
      </Container>
    </Wrap>
  );
}

/* ===== Styled ===== */

const Wrap = styled.div`
  background: #f6f7fb;
  min-height: 100vh;
  padding-bottom: 48px;
`;

/* Top gradient bar */
const Topbar = styled.header`
  background: linear-gradient(90deg, #9A34FF 0%, #FF7A29 100%);
  color: #fff;
  padding: 18px 16px;
  box-shadow: 0 8px 30px rgba(17,12,36,0.08);
  position: sticky;
  top: 0;
  z-index: 20;
`;

const TopInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
`;

const LeftTop = styled.div`
  display:flex;align-items:center;gap:14px;
`;

const Back = styled.button`
  display:inline-flex;gap:8px;align-items:center;background:rgba(255,255,255,0.08);border:0;color:#fff;padding:8px 10px;border-radius:8px;cursor:pointer;font-weight:600;
  svg{ font-size:18px; }
  &:hover{ transform: translateY(-2px); }
`;

const Heading = styled.div`
  h2{ margin:0;font-size:18px;font-weight:800; }
`;

const SubHeading = styled.div`
  font-size:13px;opacity:0.95;margin-top:6px;
`;

const TopMeta = styled.div`
  display:flex;align-items:center;gap:12px;
`;

const MetaItem = styled.div`
  text-align:right;
  ${'' /* small label */}
`;

const Label = styled.div`
  font-size:12px;color:rgba(255,255,255,0.85);opacity:0.9;
`;
const Value = styled.div`
  font-weight:700;font-size:14px;
`;

const StatusBadge = styled.div`
  padding:8px 12px;border-radius:999px;font-weight:800;color:#fff;
  background: ${p => p.status && String(p.status).toLowerCase() === "approved" ? "#2ac37d" : p.status && String(p.status).toLowerCase() === "rejected" ? "#ff6b6b" : "#ffb020"};
`;

/* main container */
const Container = styled.main`
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 16px;
`;

/* card */
const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(16,24,40,0.06);
`;

/* header inside card */
const CardHeader = styled.div`
  display:flex;flex-direction:column;gap:6px;margin-bottom:12px;
  h3{ margin:0;font-size:16px;font-weight:800; }
  small{ color:#64748b; }
`;

/* table styles */
const TableWrap = styled.div`
  overflow:auto;
  border-radius:10px;
  margin-top:6px;
  margin-bottom:12px;
`;

const StyledTable = styled.table`
  width:100%;
  border-collapse:collapse;
  min-width: 740px;
  thead th{
    text-align:left;
    padding:12px;
    background: #f4f6fb;
    font-weight:700;
    color:#111827;
    border-bottom: 1px solid #e6edf3;
  }
  tbody td{
    padding:12px;
    border-bottom: 1px dashed #eef2f6;
    color:#334155;
  }
  tbody tr:hover td{
    background: rgba(154,52,255,0.02);
    transform: translateY(-2px);
  }
`;

/* footer with comment and actions */
const CardFooter = styled.div`
  display:flex;
  align-items:flex-start;
  gap:16px;
  margin-top:12px;
  flex-wrap:wrap;
`;

const CommentBox = styled.textarea`
  flex:1;
  min-height:84px;
  padding:12px;
  border-radius:10px;
  border:1px solid #e6eef7;
  background:#fbfdff;
  font-size:14px;
  resize:vertical;
  outline:none;
  &:focus{ box-shadow: 0 6px 18px rgba(154,52,255,0.08); border-color: rgba(154,52,255,0.35); }
`;

/* actions */
const Actions = styled.div`
  display:flex;gap:10px;align-items:center;
`;

const Btn = styled.button`
  padding:10px 16px;border-radius:10px;border:0;font-weight:800;cursor:pointer;
  box-shadow: 0 8px 22px rgba(16,24,40,0.06);
`;

const Reject = styled(Btn)`
  background:#fff;border:1px solid #f1a1a1;color:#b00020;
  &:disabled{ opacity:0.6; cursor:not-allowed; }
`;

const Approve = styled(Btn)`
  background:linear-gradient(90deg,#9A34FF,#FF7A29);color:#fff;
  &:disabled{ opacity:0.7; cursor:not-allowed; }
`;

/* loader */
const Loader = styled.div`
  padding: 40px;
  text-align:center;
  color:#475569;
  font-weight:700;
`;

