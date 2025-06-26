import React, { useState } from "react";
import styled from "styled-components";
import { getTimetableByClassSection } from "../api/ClientApi";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { Link, useNavigate } from "react-router-dom";

const TimetableViewer = () => {
  const navigate = useNavigate();

  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [schedule, setSchedule] = useState({});
  const [error, setError] = useState("");
  const classOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10th"];
  const sectionOptions = ["A", "B", "C"];

  const fetchTimetable = async () => {
    try {
      const data = await getTimetableByClassSection(className, sectionName);
      setSchedule(data.schedule);
      setError("");
    } catch (err) {
      setSchedule({});
      setError(err.message || "Failed to load timetable");
    }
  };

  // Create a list of all unique time slots
  const allTimes = Object.values(schedule)
    .flat()
    .map((s) => s.time);
  const uniqueTimes = [...new Set(allTimes)].sort((a, b) => {
    const parseTime = (t) => {
      const [time, period] = t.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    return parseTime(a) - parseTime(b);
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <Container>
      <Header>
        <Title>View Class Timetable</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
            <Icons>
              <img src={home} alt="home" />
            </Icons>
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>
      <Form>
        <Select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </Select>

        <Select
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
        >
          <option value="">Select Section</option>
          {sectionOptions.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </Select>

        <Button onClick={fetchTimetable}>Load Timetable</Button>
      </Form>

      {error && <ErrorText>{error}</ErrorText>}

      {Object.keys(schedule).length > 0 && (
        <Table>
          <thead>
            <tr>
              <TimeCell>Time</TimeCell>
              {days.map((day, idx) => (
                <DayHeader key={idx}>{day}</DayHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueTimes.map((time, i) => (
              <tr key={i}>
                <TimeCell>{time}</TimeCell>
                {days.map((day, j) => {
                  const subject =
                    schedule[day]?.find((s) => s.time === time)?.subject || "-";
                  const isBreak = subject.includes("Break");
                  return (
                    <td
                      key={`${i}-${j}`}
                      style={{
                        backgroundColor: isBreak
                          ? "#002087"
                          : colorPalette[j % colorPalette.length],
                        color: isBreak ? "white" : "black",
                        fontWeight: isBreak ? "bold" : "normal",
                      }}
                    >
                      {subject}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default TimetableViewer;

// ---------------- Styled Components ----------------

const Container = styled.div`
  padding: 0 15px;
  margin: auto;
  font-family: "Poppins", sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 1px 20px;
  color: white;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icons = styled.div`
  cursor: pointer;
  margin: 0 10px;

  img {
    width: 30px;
    height: 30px;
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 30px;
  background-color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
`;

const Form = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 200px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #002087;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #00156b;
  }
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 14px;

  td,
  th {
    padding: 10px;
    border: 1px solid #ccc;
  }
`;

const TimeCell = styled.td`
  background-color: #8f6b9f;
  font-weight: bold;
  color: white;
`;

const DayHeader = styled.th`
  background-color: #002087;
  color: white;
  font-weight: bold;
`;

const Select = styled.select`
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 200px;
  font-size: 16px;
  background-color: white;
`;

const colorPalette = [
  "#E0F7FA",
  "#F1F8E9",
  "#FFF3E0",
  "#FBE9E7",
  "#E8F5E9",
  "#EDE7F6",
];
