import React from 'react';
import styled from 'styled-components';

const ModalWrap = styled.div`
  position: fixed;
  inset: 0;
  display:flex;
  justify-content:center;
  align-items:center;
  background: rgba(0,0,0,0.45);
  z-index: 600;
`;
const Card = styled.div`
  width: 94%;
  max-width:700px;
  max-height:86vh;
  overflow:auto;
  background:white;
  border-radius:10px;
  padding:18px;
`;
const Input = styled.input` width:100%; padding:12px; border-radius:8px; border:1px solid #e6e6e6; margin-bottom:10px; `;
const Textarea = styled.textarea` width:100%; padding:12px; border-radius:8px; border:1px solid #e6e6e6; margin-bottom:10px; `;
const Row = styled.div` display:flex; gap:10px; `;
const Btn = styled.button`
  padding:12px;
  border-radius:8px;
  border:none;
  background:${p=>p.primary ? '#cc2b2b' : 'transparent'};
  color:${p=>p.primary ? '#fff' : '#1e6fb8'};
  border:${p=>p.primary ? '0' : `1px solid #1e6fb8`};
  font-weight:700;
`;

export default function LeaveModal({ visible, onClose, standalone }){
  if (standalone) visible = true;
  if (!visible) return null;

  return (
    <ModalWrap>
      <Card>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <h3 style={{margin:0, color:"#cc2b2b"}}>REVA Hostel Leave Request Details</h3>
          {!standalone && <button onClick={onClose} style={{border:'none', background:'transparent', fontSize:18}}>✕</button>}
        </div>

        <label>Reason For Leave *</label>
        <Input placeholder="Select an Option" />

        <label>Note to the approver *</label>
        <Textarea rows={4} placeholder="Write a short note" />

        <label>Start Date and Time *</label>
        <Input type="datetime-local" />

        <label>End Date and Time *</label>
        <Input type="datetime-local" />

        <label>Visiting Address</label>
        <Textarea rows={3} placeholder="Visiting address" />

        <Row style={{marginTop:10}}>
          <Btn onClick={onClose}>Close</Btn>
          <Btn primary onClick={() => { alert("Leave Submitted"); onClose && onClose(); }}>Save</Btn>
        </Row>
      </Card>
    </ModalWrap>
  );
}
