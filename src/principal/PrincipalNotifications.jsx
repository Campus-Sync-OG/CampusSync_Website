// src/pages/principal/PrincipalNotifications.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchPendingMarksForPrincipal } from "../api/ClientApi";
import { FiClock, FiChevronRight, FiFileText } from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";

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
      setPending(res.pending || []);
    } catch (err) {
      console.error("Failed to load pending submissions", err);
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  const badgeColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "#2ac37d";
      case "rejected":
        return "#ff6b6b";
      case "pending":
      default:
        return "#ffb020";
    }
  };

  return (
    <Page>
      <Topbar>
        <TopInner>
          <TitleBlock>
            <H1>Pending Marks Submissions</H1>
            <Subtitle>Open a submission to review and Approve / Reject</Subtitle>
          </TitleBlock>
          <Stats>
            <Stat>
              <StatIcon><FiFileText /></StatIcon>
              <StatBody>
                <StatNumber>{loading ? "…" : pending.length}</StatNumber>
                <StatLabel>Pending</StatLabel>
              </StatBody>
            </Stat>
            <Refresh onClick={loadPending} title="Reload">
              <FiClock />
            </Refresh>
          </Stats>
        </TopInner>
      </Topbar>

      <Container>
        {loading ? (
          <LoadingRow>
            <Skeleton height="72px" />
            <Skeleton height="72px" />
            <Skeleton height="72px" />
          </LoadingRow>
        ) : pending.length === 0 ? (
          <EmptyState>
            <EmptyIcon><FaUserGraduate /></EmptyIcon>
            <EmptyText>No pending submissions</EmptyText>
            <EmptySub muted>You're all caught up — no marks awaiting review.</EmptySub>
          </EmptyState>
        ) : (
          <List>
            {pending.map((p) => (
              <Card key={p.notification_id} onClick={() => navigate(`/marks-review/${p.notification_id}`)}>
                <CardLeft>
                  <Avatar>
                    {p.submitted_by ? p.submitted_by.split(" ").map(n=>n[0]).slice(0,2).join("") : "ST"}
                  </Avatar>

                  <Meta>
                    <RowTitle>{p.title || "Marks Submission"}</RowTitle>
                    <RowDesc>
                      <strong>{p.submitted_by || "Unknown"}</strong>
                      <Dot>•</Dot>
                      {p.submission?.subject || "—"}
                      <Dot>•</Dot>
                      {p.submission ? `${p.submission.class_grade}-${p.submission.section}` : "—"}
                    </RowDesc>
                    <TagRow>
                      <Badge style={{ background: badgeColor(p.status) }}>
                        {p.status || "Pending"}
                      </Badge>
                      <SmallNote>{p.submission?.exam_type || "Exam"}</SmallNote>
                    </TagRow>
                  </Meta>
                </CardLeft>

                <CardRight>
                  <Time>{fmtDate(p.submitted_at)}</Time>
                  <OpenBtn onClick={(e) => { e.stopPropagation(); navigate(`/marks-review/${p.notification_id}`); }}>
                    Open <Chevron /><FiChevronRight />
                  </OpenBtn>
                </CardRight>
              </Card>
            ))}
          </List>
        )}
      </Container>
    </Page>
  );
}

/* --------------------- Styled --------------------- */

const Page = styled.div`
  background: #f6f7fb;
  min-height: 100vh;
`;

/* Gradient topbar */
const Topbar = styled.header`
  width: 100%;
  background: linear-gradient(90deg, #9A34FF 0%, #FF7A29 100%);
  color: #fff;
  padding: 28px 16px;
  box-shadow: 0 6px 18px rgba(14,16,40,0.08);
  position: sticky;
  top: 0;
  z-index: 30;
`;

const TopInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
`;

const TitleBlock = styled.div``;

const H1 = styled.h2`
  margin:0;color:#fff;font-size:20px;font-weight:700;
`;

const Subtitle = styled.small`
  display:block;margin-top:6px;opacity:0.95;font-size:13px;
`;

const Stats = styled.div`
  display:flex;align-items:center;gap:12px;
`;

const Stat = styled.div`
  display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.12);padding:8px 12px;border-radius:12px;
`;

const StatIcon = styled.div`
  display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.12);width:36px;height:36px;border-radius:8px;font-size:16px;
`;

const StatBody = styled.div`
  color:#fff;line-height:1;
`;

const StatNumber = styled.div`font-weight:700;font-size:16px;`;
const StatLabel = styled.div`font-size:12px;opacity:0.95;`;

const Refresh = styled.button`
  display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:rgba(255,255,255,0.95);padding:8px;border-radius:8px;cursor:pointer;font-size:18px;
  &:hover{ transform: translateY(-2px); }
`;

/* container */
const Container = styled.main`
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 16px 40px;
`;

/* list */
const List = styled.div`
  display:flex;flex-direction:column;gap:12px;
`;

/* Card */
const Card = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px;
  background:#fff;
  border-radius:12px;
  box-shadow: 0 6px 18px rgba(20,20,50,0.04);
  transition: transform .12s ease, box-shadow .12s ease;
  cursor:pointer;
  &:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(20,20,50,0.08); }
`;

const CardLeft = styled.div`
  display:flex;align-items:center;gap:14px;min-width:0;
`;

const Avatar = styled.div`
  width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;
  background: linear-gradient(135deg, rgba(154,52,255,0.12), rgba(255,122,41,0.12));
  font-weight:700;color:#3b1a6b;
  box-shadow: inset 0 -6px 18px rgba(0,0,0,0.02);
`;

const Meta = styled.div`
  min-width:0;
`;

const RowTitle = styled.div`
  font-weight:700;font-size:15px;color:#0f1724;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
`;

const RowDesc = styled.div`
  margin-top:6px;font-size:13px;color:#586174;display:flex;gap:8px;align-items:center;flex-wrap:wrap;
`;

const Dot = styled.span`opacity:0.5;margin:0 4px;`;

/* small tags row */
const TagRow = styled.div`margin-top:8px;display:flex;gap:8px;align-items:center;`;

const Badge = styled.span`
  display:inline-block;padding:6px 10px;border-radius:999px;color:white;font-size:12px;font-weight:600;
`;

const SmallNote = styled.span`
  background:#f3f4f6;padding:6px 8px;border-radius:8px;font-size:12px;color:#6b7280;
`;

/* right */
const CardRight = styled.div`
  display:flex;flex-direction:column;align-items:flex-end;gap:8px;
`;

const Time = styled.small`font-size:12px;color:#94a3b8;`;

/* open button */
const OpenBtn = styled.button`
  display:inline-flex;align-items:center;gap:8px;border:0;padding:8px 12px;border-radius:10px;background:linear-gradient(90deg,#9A34FF,#FF7A29);color:#fff;font-weight:700;cursor:pointer;
  box-shadow: 0 6px 18px rgba(154,52,255,0.12);
  svg{ opacity:0.95; transform: translateX(0); transition: transform .12s ease; }
  &:hover{ transform: translateY(-2px); }
`;

/* little chevron wrapper so icons align nicely */
const Chevron = styled.span`
  display:inline-flex;align-items:center;font-size:14px;opacity:0.95;
`;

/* empty state */
const EmptyState = styled.div`
  background:linear-gradient(180deg, #fff, #fff);
  border-radius:12px;padding:48px;text-align:center;color:#667085;box-shadow:0 6px 24px rgba(10,12,30,0.04);
`;

const EmptyIcon = styled.div`
  width:72px;height:72px;border-radius:18px;margin:0 auto;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f3e9ff,#fff0e6);font-size:28px;color:#7b2ae8;
`;

const EmptyText = styled.div`font-weight:700;margin-top:12px;font-size:16px;color:#0f1724;`;
const EmptySub = styled.small`display:block;margin-top:6px;color:#94a3b8;`;

/* loading skeletons */
const LoadingRow = styled.div`display:flex;flex-direction:column;gap:12px;padding:8px 0;`;
const Skeleton = styled.div`
  width:100%;height:${p=>p.height||"72px"};border-radius:12px;background:linear-gradient(90deg,#f3f4f6,#eef2f7);animation: pulse 1.2s infinite;
  @keyframes pulse { 0% { opacity: 1 } 50% { opacity: 0.6 } 100% { opacity: 1 } }
`;

