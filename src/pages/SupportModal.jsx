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
const Textarea = styled.textarea` width:100%; padding:12px; border-radius:8px; border:1px solid #e6e6e6; margin-bottom:10px; `;
const Row = styled.div` display:flex; gap:10px; `;
const Btn = styled.button` padding:12px; border-radius:8px; border:none; background:#1e6fb8; color:#fff; font-weight:700; `;

export default function SupportModal({ visible, onClose, standalone }){
  if (standalone) visible = true;
  if (!visible) return null;

  return (
    <ModalWrap>
      <Card>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <h3 style={{margin:0, color:"#cc2b2b"}}>REVA Hostel Support Request Details</h3>
          {!standalone && <button onClick={onClose} style={{border:'none', background:'transparent', fontSize:18}}>✕</button>}
        </div>

        <label>Priority *</label>
        <select style={{width:'100%', padding:12, marginBottom:12}}>
          <option>Select an Option</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <label>Support Category *</label>
        <select style={{width:'100%', padding:12, marginBottom:12}}>
          <option>Select an Option</option>
          <option>Maintenance</option>
          <option>Housekeeping</option>
        </select>

        <label>Hostel Sub Category *</label>
        <select style={{width:'100%', padding:12, marginBottom:12}}>
          <option>Select an Option</option>
        </select>

        <label>Description *</label>
        <Textarea rows={4} placeholder="Describe the issue" />

        <div style={{display:'flex', gap:12}}>
          <div style={{flex:1, border:'1px solid #ddd', padding:10, borderRadius:6, minHeight:120}}>
            <strong>Available</strong>
            <ul>
              <li>AC Not Working</li>
              <li>Bathroom Light</li>
              <li>Bulb Is Not Working</li>
            </ul>
          </div>

          <div style={{flex:1, border:'1px solid #ddd', padding:10, borderRadius:6, minHeight:120}}>
            <strong>Selected</strong>
            <div />
          </div>
        </div>

        <Row style={{marginTop:12}}>
          <Btn onClick={() => { alert('Support ticket submitted'); onClose && onClose(); }}>Submit</Btn>
          <button style={{background:'#ccc', padding:12, borderRadius:8, border:'none'}} onClick={onClose}>Close</button>
        </Row>
      </Card>
    </ModalWrap>
  );
}
