import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import Header from './Header.jsx';


const Page = styled.div`min-height:100vh; background:${p=>p.theme.light}; padding:24px;`;
const Container = styled.div`max-width:900px; margin:0 auto;`;
const Card = styled.div`background:#fff; padding:18px; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.06);`;
const Menu = styled.div`background:${p=>p.theme.red}; color:white; border-radius:12px; padding:18px; margin-top:16px;`;


export default function BookedMealCard(){
const items = ['Chappathi','Curd','Butter Milk','Brinjal Masala','Papad','Chutney','Rice','Rasam','Pickle','Cabbage Dal'];
return (
<ThemeProvider theme={theme}>
<Page>
<Container>
<Header />
<h2 style={{color:theme.red}}>BOOKED MEALS</h2>
<Card>
<div style={{display:'flex', gap:18}}>
<img src='https://images.unsplash.com/photo-1604908177522-2328c7f0f6c6?auto=format&fit=crop&w=400&q=60' alt='meal' style={{width:90, height:90, borderRadius:45}} />
<div>
<h3 style={{margin:0}}>LUNCH</h3>
<p style={{margin:'6px 0'}}>02-Jun-2025</p>
<p style={{margin:0}}>11:45 AM - 02:00 PM</p>
<p style={{marginTop:8}}>Missed Meal</p>
</div>
</div>


<Menu>
{items.map(i=> <div key={i} style={{marginBottom:8}}>• {i}</div>)}
</Menu>


<div style={{display:'flex', gap:10, marginTop:16}}>
<button style={{flex:1, padding:12, borderRadius:8, border:'none', background:theme.blue, color:'white', fontWeight:700}}>Scan QR</button>
<button style={{flex:1, padding:12, borderRadius:8, border:'none', background:theme.red, color:'white', fontWeight:700}}>Cancel</button>
</div>
</Card>
</Container>
</Page>
</ThemeProvider>
);
}