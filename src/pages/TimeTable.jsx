import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { fetchTimetableByAdmissionNo } from "../api/ClientApi"; // Adjust the import path as necessary

const colors = [
  "#FFDAB9",
  "#E6E6FA",
  "#F0FFF0",
  "#FFFACD",
  "#D3D3D3",
  "#FFB6C1",
];

const Timetable = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({});
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [admission_no, setAdmissionNo] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
    }
  }, []);
  console.log("Admission No:", admission_no);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchTimetableByAdmissionNo(admission_no);
        const { schedule } = res;
        console.log("Fetched timetable:", schedule);
        setSchedule(schedule);

        // Extract unique days and time slots from schedule
        const fetchedDays = Object.keys(schedule);

        // Sort days in correct weekly order
        const weekdayOrder = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const sortedDays = fetchedDays.sort(
          (a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b)
        );
        setDays(sortedDays);

        // Extract and sort time slots with AM/PM handling
        const fetchedTimeSlots = new Set();
        fetchedDays.forEach((day) => {
          schedule[day].forEach((entry) => {
            fetchedTimeSlots.add(entry.time);
          });
        });

        const sortedTimeSlots = Array.from(fetchedTimeSlots).sort((a, b) => {
          const toMinutes = (timeStr) => {
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            return hours * 60 + minutes;
          };

          return toMinutes(a) - toMinutes(b);
        });

        setTimeSlots(sortedTimeSlots);
      } catch (error) {
        console.error("Failed to load timetable:", error);
      }
    };

    if (admission_no) {
      fetchData();
    }
  }, [admission_no]);

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
            <DayHeader>Day</DayHeader>
            {timeSlots.map((slot) => (
              <TimeCell key={slot}>{slot}</TimeCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIdx) => (
            <tr key={day}>
              <DayHeader
                style={{ backgroundColor: colors[dayIdx % colors.length] }}
              >
                {day}
              </DayHeader>
              {timeSlots.map((time, colIdx) => {
                const subject =
                  schedule[day]?.find((entry) => entry.time === time)
                    ?.subject || "";
                const isBreak =
                  subject === "Snacks Break" || subject === "Lunch Break";
                return (
                  <td
                    key={`${day}-${colIdx}`}
                    style={{
                      backgroundColor: isBreak
                        ? "#002087"
                        : colors[dayIdx % colors.length],
                      color: isBreak ? "white" : "black",
                      fontWeight: isBreak ? "bold" : "normal",
                      textAlign: "center",
                    }}
                  >
                    {subject}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Container>
  );
};

export default Timetable;
// Styled Components
const Container = styled.div`
  padding: 0 15px;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 1px 20px;
  color: white;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
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
