import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const colors = [
  "#97B3AE",
  "#D2E0D3",
  "#F0DDD6",
  "#F2C3B9",
  "#D6CBBF",
  "#F0EEEA",
];

const timeSlots = [
  "9:00 AM",
  "9:45 AM",
  "10:30 AM",
  "10:45 AM",
  "11:30 AM",
  "12:45 PM",
  "1:45 PM",
  "2:30 PM",
  "3:45 PM",
];

const schedule = {
  Monday: [
    "Social Studies",
    "English",
    "Snacks Break",
    "Mathematics",
    "Arts Class",
    "Lunch Break",
    "Science",
    "2nd Language",
    "Physical Education",
  ],
  Tuesday: [
    "Mathematics",
    "2nd Language",
    "Snacks Break",
    "Science",
    "Physical Education",
    "Lunch Break",
    "English",
    "Arts Class",
    "Social Studies",
  ],
  Wednesday: [
    "Physical Education",
    "Mathematics",
    "Snacks Break",
    "Arts Class",
    "2nd Language",
    "Lunch Break",
    "Social Studies",
    "English",
    "Science",
  ],
  Thursday: [
    "English",
    "Arts Class",
    "Snacks Break",
    "Social Studies",
    "Mathematics",
    "Lunch Break",
    "2nd Language",
    "Science",
    "Arts Class",
  ],
  Friday: [
    "Science",
    "2nd Language",
    "Snacks Break",
    "English",
    "Social Studies",
    "Lunch Break",
    "Mathematics",
    "Social Studies",
    "Mathematics",
  ],
  Saturday: [
    "Arts Class",
    "2nd Language",
    "Snacks Break",
    "Mathematics",
    "Social Studies",
    "Lunch Break",
    "Science",
    "Physical Education",
    "English",
  ],
};

const Timetable = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Title>Time Table</Title>
        <IconGroup>
          <Link to="/dashboard">
            <Icon src={home} alt="home" />
          </Link>
          <Divider />
          <Icon src={back} alt="back" onClick={() => navigate(-1)} />
        </IconGroup>
      </Header>

      <StyledTable>
        <thead>
          <tr>
            <TimeCell>Time</TimeCell>
            {days.map((day, idx) => (
              <DayHeader key={day} style={{ backgroundColor: colors[idx] }}>
                {day}
              </DayHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, idx) => {
            const isBreak =
              schedule["Monday"][idx] === "Snacks Break" ||
              schedule["Monday"][idx] === "Lunch Break";
            if (isBreak) {
              return (
                <tr key={idx}>
                  <TimeCell>{slot}</TimeCell>
                  <BreakCell colSpan={6}>{schedule["Monday"][idx]}</BreakCell>
                </tr>
              );
            }
            return (
              <tr key={idx}>
                <TimeCell>{slot}</TimeCell>
                {days.map((day, dayIdx) => (
                  <td
                    key={`${day}-${idx}`}
                    style={{ backgroundColor: colors[dayIdx] }}
                  >
                    {schedule[day][idx]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </Container>
  );
};

export default Timetable;

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  color: white;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Icon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 2px;
  height: 25px;
  background-color: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  td,
  th {
    padding: 12px;
    border: 1px solid #ddd;
    font-size: 14px;
  }
`;

const TimeCell = styled.td`
  background-color: #8f6b9f;
  font-weight: bold;
`;

const BreakCell = styled.td`
  background-color: #002087;
  color: white;
  font-weight: bold;
  text-align: center;
`;

const DayHeader = styled.th`
  font-weight: bold;
  font-size: 15px;
`;
