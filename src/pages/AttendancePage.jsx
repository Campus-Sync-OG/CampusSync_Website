import React, { useState,useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { Link } from "react-router-dom";
import { getAttendanceByAdmissionNo } from "../api/ClientApi"; // Adjust the import path as necessary
import { createGlobalStyle } from 'styled-components';


// Styled Components
const Container = styled.div`
  width: 85%;
  height: auto;
  margin: 10px auto;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;

  @media (max-width: 1024px) {
    width: 85%;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 5px;
    box-shadow: none;
    border: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
   background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 10px; /* Optional for rounded corners */
  color: white; /* Text color */
  margin-left: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Title = styled.h2`
 font-size: 20px;
  font-weight: bold;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
   align-items: center; /* Ensures icons and divider are vertically aligned */
  img {
    width: 18px;
    height: 18px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const Icons2 = styled.div`
  position: relative;
 width: 1px; /* Thickness of the white line */
  height: 20px; /* Adjust to match the size of icons */
  background-color: white; 
  right: 10px;
  align-items: center; /* Ensures icons and divider are vertically aligned */
  img {
    position: relative;
    width: 18px;
    height: 18px;
    left:4px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
      
    }
  }

  @media (max-width: 768px) {
    flex: none;
  }
`;


const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const CalendarWrapper = styled.div`
  width: 50%;

  .react-calendar {
    width: 100%;
    font-family: Arial, sans-serif;
    padding: 15px;

    .react-calendar__tile {
      border-radius: 5px;
      height: 60px;
      font-size: 12px;
      font-weight: bold;
      padding: 5px;

      &.present {
        background-color: #80e6c2 !important;
        color: white;
      }

      &.absent {
        background-color:rgb(194, 25, 25) !important;
        color: white;
      
      }

      &.weekend-holiday {
        background-color:rgb(55, 28, 152) !important;
        color: white;
      }

      &.attendance-not-uploaded {
        background-color:rgb(221, 183, 86) !important;
        color: white;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    .react-calendar__tile {
      height: 25px;
      font-size: 10px;
    }
  }
`;

const LegendSection = styled.div`
  width: 40%;
  padding: 10px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 5px 0;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px;

  span {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 4px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 480px) {
      width: 15px;
      height: 15px;
    }
  }

  p {
    margin: 0;
    font-size: 12px;

    @media (max-width: 768px) {
      font-size: 10px;
    }

    @media (max-width: 480px) {
      font-size: 9px;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  gap: 10px; /* Adjust the gap between the icons */
`;

const CalendarStyles = createGlobalStyle`
  .present {
    background-color: lightgreen !important;
    color: black;
    font-weight: bold;
  }

  .absent {
    background-color: red !important;
    color: black;
    font-weight: bold;
  }

  .weekend {
    background-color: lavender !important;
    color: black;
    font-weight: bold;
  }

  .not-uploaded {
    background-color: khaki !important;
    color: black;
  }

  .react-calendar__tile--now {
    background-color: lightgray !important;
    border: 1px solid gray;
  }

`;



const Attendance = () => {
  const [admission_no, setAdmissionNo] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [value, setValue] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
    } else {
      setError('Admission number not found');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!admission_no) return;

    const fetchAttendance = async () => {
      try {
        const data = await getAttendanceByAdmissionNo(admission_no);
        const formatted = data.reduce((acc, record) => {
          const dateStr = record.date; // already in YYYY-MM-DD format
          acc[dateStr] = record.status.toLowerCase();
          return acc;
        }, {});
        setAttendanceData(formatted);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError('Failed to fetch attendance');
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [admission_no]);

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const dateString = date.toLocaleDateString('en-CA'); // ensures 'YYYY-MM-DD'
    const status = attendanceData[dateString];

    if (status === 'present') return 'present';
    if (status === 'absent') return 'absent';
    if (date.getDay() === 0) return 'weekend'; // Sunday
    return 'not-uploaded';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Header>
        <Title>Attendance</Title>
        <Wrapper>
          <Link to="/dashboard">
            <Icons><img src={home} alt="home" /></Icons>
          </Link>
          <Link to="/dashboard">
            <Icons2><img src={back} alt="back" /></Icons2>
          </Link>
        </Wrapper>
      </Header>

      <Content>
        <CalendarWrapper>
          <Calendar
            onChange={setValue}
            value={value}
            tileClassName={tileClassName}
          />
        </CalendarWrapper>

        <LegendSection>
          <LegendItem><span className="legend present" /> <p>Present</p></LegendItem>
          <LegendItem><span className="legend absent" /> <p>Absent</p></LegendItem>
          <LegendItem><span className="legend weekend" /> <p>Weekend Holiday</p></LegendItem>
          <LegendItem><span className="legend not-uploaded" /> <p>Attendance Not Uploaded</p></LegendItem>
        </LegendSection>
      </Content>

      <CalendarStyles />
    </Container>
  );
};

export default Attendance;