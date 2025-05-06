import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";

const localizer = momentLocalizer(moment);

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 10px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 3px;
  height: 25px;
  background-color: white;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  img {
    width: 25px;
    height: 25px;
  }
`;

const CalendarContainer = styled.div`
  padding: 20px;
  background: white;
`;

const CustomEvent = ({ event }) => {
  return (
    <div
      style={{
        backgroundColor: event.color || "#007bff",
        color: "white",
        padding: "5px",
        borderRadius: "4px",
      }}
    >
      {event.title}
    </div>
  );
};

const colors = [
  "#FFCCD7",
  "#D7A5E9",
  "#9FEAE7",
  "#BFEEEE",
  "#E5FCFF",
  "#FFE0BD",
];

const TeacherCalendarofEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Initially empty array
  const [view, setView] = useState("week");

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events"); // Update URL as needed
        const formattedEvents = response.data.map((event) => ({
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          color: event.color,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Function to get the background color for each column based on the index
  const getColumnColor = (index) => {
    return colors[index % colors.length];
  };

  return (
    <CalendarContainer>
      <Header>
        <Title>Calendar Of Event</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
            <Icons>
              <img src={home} alt="home" />
            </Icons>
          </Link>
          <Divider />
          <Link to="/teacher-dashboard">
            <Icons onClick={() => navigate(-1)}>
              <img src={back} alt="back" />
            </Icons>
          </Link>
        </Wrapper>
      </Header>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={view}
        views={["day", "week", "month"]}
        style={{ height: "90vh", border: "none", boxShadow: "none" }}
        components={{ event: CustomEvent }}
        selectable
        step={60}
        timeslots={1}
        min={new Date(2025, 3, 22, 8, 0)} // Starting calendar grid from 8 AM
        max={new Date(2025, 3, 22, 18, 0)}
        onView={(newView) => setView(newView)}
        dayPropGetter={(date) => {
          const columnIndex = date.getDay(); // Get the day index (0 - 6)
          return {
            style: {
              backgroundColor: getColumnColor(columnIndex),
            },
          };
        }}
      />
    </CalendarContainer>
  );
};

export default TeacherCalendarofEvent;
