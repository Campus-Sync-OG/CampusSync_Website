import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './Header'; // your header component (or simple placeholder)
import HostelDetailsCard from './HostelDetailsCard';
import BookedMealsPanel from './BookedMealsPreview';
import LeaveModal from './LeaveModal';
import SupportModal from './SupportModal';

const Page = styled.div`
  min-height:100vh;
  background:#f5f7fb;
  padding:24px;
`;
const Container = styled.div`
  max-width:900px;
  margin:0 auto;
  position:relative;
`;

export default function HostelHomePge(){
  // open: null | 'booked' | 'support' | 'leave'
  const [open, setOpen] = useState(null);

  return (
    <Page>
      <Container>
        <Header />
        {/* keep student details visible always */}
        <HostelDetailsCard
          onOpenBooked={() => setOpen('booked')}
          onOpenSupport={() => setOpen('support')}
          onOpenLeave={() => setOpen('leave')}
        />

        {/* inline booked meals panel (visible when open === 'booked') */}
        <div style={{marginTop:18}}>
          {open === 'booked' && (
            <BookedMealsPanel />
          )}
        </div>

        {/* Support modal */}
        <SupportModal
          visible={open === 'support'}
          onClose={() => setOpen(null)}
        />

        {/* Leave modal */}
        <LeaveModal
          visible={open === 'leave'}
          onClose={() => setOpen(null)}
        />
      </Container>
    </Page>
  );
}
