import React from 'react';
import styled from 'styled-components';

const Card = styled.section`
  background: #fff;
  padding:18px;
  border-radius:12px;
  box-shadow:0 6px 18px rgba(0,0,0,0.06);
  margin-bottom:12px;
`;
const Heading = styled.h2` color: #cc2b2b; margin:0 0 8px 0; font-size:16px;`;
const BtnRow = styled.div` display:flex; gap:10px; margin-top:8px; `;
const Btn = styled.button`
  flex:1;
  padding:12px;
  border-radius:8px;
  border:none;
  font-weight:700;
  cursor:pointer;
`;

export default function HostelDetailsCard({ onOpenBooked, onOpenSupport, onOpenLeave }){
  return (
    <Card>
      <Heading>Hostel For SOMAGANI HARSHITHA</Heading>
      <p style={{margin:0}}>Course Details : B. Tech in Artificial Intelligence and Data Science-(2022-2026)</p>

      <BtnRow style={{marginTop:12}}>
        <Btn
          onClick={() => onOpenBooked && onOpenBooked()}
          style={{background:'transparent', color:'#cc2b2b', border:'2px solid #cc2b2b'}}
        >
          Booked Meals / QR Scan
        </Btn>

        <Btn
          onClick={() => onOpenSupport && onOpenSupport()}
          style={{background:'#1e6fb8', color:'#fff'}}
        >
          Student Support
        </Btn>

        <Btn
          onClick={() => onOpenLeave && onOpenLeave()}
          style={{background:'#cc2b2b', color:'#fff'}}
        >
          Apply For Leave
        </Btn>
      </BtnRow>

      {/* details table */}
      <div style={{marginTop:16}}>
        <h4 style={{margin:'8px 0'}}>DETAILS</h4>
        <div style={{background:'#eee', borderRadius:8, overflow:'hidden'}}>
          {[
            ['NAME','RHR-0001287'],
            ['TYPE','3 Sharing'],
            ['STATUS','Room Allotted'],
            ['ROOM NUMBER','425'],
            ['BLOCK','G1']
          ].map((r,i)=>(
            <div key={r[0]} style={{display:'flex', justifyContent:'space-between', padding:'12px 16px', background: i%2? '#f7f7f7':'#e6e6e6'}}>
              <div style={{fontWeight:700}}>{r[0]}</div>
              <div>{r[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
