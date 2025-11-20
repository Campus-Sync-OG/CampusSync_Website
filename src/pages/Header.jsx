import React from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';


const Bar = styled.header`
background: ${p=>p.theme.blue}; color:white; padding:18px 20px; border-radius:8px; display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;
`;
const Title = styled.h1`font-size:18px; margin:0; font-weight:700;`;


export default function Header(){
return (
<Bar>
<Title>Hostel</Title>
<FaUserCircle size={34} />
</Bar>
);
}