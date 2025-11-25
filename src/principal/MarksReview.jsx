// src/pages/principal/MarksReview.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPendingMarksForPrincipal, reviewMarksSubmission } from '../api/ClientApi';

export default function MarksReview() {
  const { id } = useParams(); // notification id
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadSubmission();
  }, [id]);

  const loadSubmission = async () => {
    setLoading(true);
    try {
      const res = await fetchPendingMarksForPrincipal(); // returns all pending
      const found = (res.pending || []).find(p => String(p.notification_id) === String(id));
      if (!found) {
        alert('Submission not found or maybe already reviewed.');
        navigate(-1);
        return;
      }
      setSubmission(found);
    } catch (err) {
      console.error(err);
      alert('Failed to load submission.');
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
      navigate('/principal/notifications'); // back to list
    } catch (err) {
      console.error(err);
      alert('Action failed. See console.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Page><p>Loading…</p></Page>;
  if (!submission) return <Page><p>Not found.</p></Page>;

  const s = submission.submission;
  return (
    <Page>
      <Top>
        <h2>{submission.title}</h2>
        <Info>
          <div>Submitted by: <b>{submission.submitted_by}</b></div>
          <div>Class/Section: <b>{s.class_grade}-{s.section}</b></div>
          <div>Subject: <b>{s.subject}</b></div>
          <div>Exam: <b>{s.exam_format}</b></div>
          <div>Submitted at: <small>{new Date(submission.submitted_at).toLocaleString()}</small></div>
        </Info>
      </Top>

      <Table>
        <thead>
          <tr><th>Sl</th><th>Admission No</th><th>Student</th><th>Roll</th><th>Marks</th><th>Total</th></tr>
        </thead>
        <tbody>
          {(s.marks || []).map((m, i) => (
            <tr key={m.admission_no}>
              <td>{i + 1}</td>
              <td>{m.admission_no}</td>
              <td>{m.student_name || '-'}</td>
              <td>{m.roll_no || '-'}</td>
              <td>{m.marks_obtained}</td>
              <td>{m.total_marks}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Actions>
        <textarea placeholder="Optional comments (why reject / notes)" value={comment} onChange={(e) => setComment(e.target.value)} />
        <div>
          <RejectBtn disabled={actionLoading} onClick={() => handleAction('rejected')}>Reject</RejectBtn>
          <ApproveBtn disabled={actionLoading} onClick={() => handleAction('approved')}>Approve</ApproveBtn>
        </div>
      </Actions>
    </Page>
  );
}

/* styled */
const Page = styled.div`padding: 1.2rem;`;
const Top = styled.div`margin-bottom: 1rem;`;
const Info = styled.div`display:flex;gap:1rem;flex-wrap:wrap;margin-top:8px;color:#333;`;
const Table = styled.table`width:100%;border-collapse:collapse;margin-top:12px;
  th,td{padding:10px;border:1px solid #eee;text-align:left;}
  th{background:#f4f6fb;}
`;
const Actions = styled.div`margin-top:16px;display:flex;gap:12px;align-items:flex-start;`;
const RejectBtn = styled.button`background:#e53935;color:white;padding:8px 14px;border-radius:6px;border:none;cursor:pointer;`;
const ApproveBtn = styled.button`background:#2e7d32;color:white;padding:8px 14px;border-radius:6px;border:none;cursor:pointer;`;
