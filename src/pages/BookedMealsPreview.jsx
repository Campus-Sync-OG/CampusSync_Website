import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  background:#fff;
  padding:16px;
  border-radius:12px;
  box-shadow:0 6px 18px rgba(0,0,0,0.06);
`;
const Menu = styled.div`
  background:#cc2b2b;
  color:#fff;
  padding:12px;
  border-radius:10px;
  margin-top:12px;
`;

export default function BookedMealsPreview(){
  const items = ['Chappathi','Curd','Butter Milk','Brinjal Masala','Papad','Chutney','Rice','Rasam','Pickle','Cabbage Dal'];

  return (
    <Panel>
      <div style={{display:'flex', gap:14, alignItems:'center'}}>
        <img src="https://images.unsplash.com/photo-1604908177522-2328c7f0f6c6?auto=format&fit=crop&w=300&q=60" alt="meal" style={{width:88, height:88, borderRadius:44, objectFit:'cover'}} />
        <div>
          <div style={{fontWeight:800, color:'#cc2b2b', fontSize:18}}>LUNCH</div>
          <div style={{marginTop:6, color:'#333'}}>02-Jun-2025 • 11:45 AM - 02:00 PM • Missed Meal</div>
        </div>
      </div>

      <Menu>
        {items.map(i => <div key={i} style={{marginBottom:6}}>• {i}</div>)}
      </Menu>

      <div style={{display:'flex', gap:10, marginTop:12}}>
        <button style={{flex:1, padding:10, borderRadius:8, border:'none', background:'#1e6fb8', color:'#fff', fontWeight:700}}>Scan QR</button>
        <button style={{flex:1, padding:10, borderRadius:8, border:'none', background:'#cc2b2b', color:'#fff', fontWeight:700}}>Cancel</button>
      </div>
    </Panel>
  );
}
