// src/pages/principal/PrincipalNotifications.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchPendingMarksForPrincipal } from '../api/ClientApi';

export default function PrincipalNotifications() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await fetchPendingMarksForPrincipal();
      // expected shape: { success:true, pending: [...] }
      setPending(res.pending || []);
    } catch (err) {
      console.error('Failed to load pending submissions', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Header>
        <h2>Pending Marks Submissions</h2>
        <small>Open a submission to review and Approve / Reject</small>
      </Header>

      {loading ? (
        <p>Loading…</p>
      ) : pending.length === 0 ? (
        <Empty>No pending submissions</Empty>
      ) : (
        <List>
          {pending.map((p) => (
            <Row key={p.notification_id} >
              <Left>
                <Title>{p.title}</Title>
                <Meta>By: {p.submitted_by} • {p.submission.subject} • {p.submission.class_grade}-{p.submission.section}</Meta>
              </Left>
              <Right>
                <small>{new Date(p.submitted_at).toLocaleString()}</small>
                <Open onClick={() => navigate(`/marks-review/${p.notification_id}`)}>Open</Open>

              </Right>
            </Row>
          ))}
        </List>
      )}
    </Page>
  );
}

/* styled */
const Page = styled.div`padding: 1.2rem;`;
const Header = styled.div`margin-bottom: 1rem;`;
const Empty = styled.div`padding: 2rem; color: #666;`;
const List = styled.div`display:flex;flex-direction:column;gap:8px;`;
const Row = styled.div`
  display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:8px;
  background: #fff; cursor:pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  &:hover{ transform: translateY(-1px); }
`;
const Left = styled.div``;
const Right = styled.div`text-align:right;`;
const Title = styled.div`font-weight:600;`;
const Meta = styled.div`font-size: 13px; color: #666;`;
const Open = styled.div`margin-top:6px;background:#002087;color:white;padding:6px 8px;border-radius:6px;font-size:12px;`;
