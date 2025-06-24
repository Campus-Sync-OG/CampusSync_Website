import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { getAllEvents } from "../api/ClientApi"; // Adjust the import path if needed

const localizer = momentLocalizer(moment);

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 1px 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
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
  padding: 0 15px;
  flex-direction: column;
  height: 70vh;
`;

const colors = ["#FFCCD7", "#D7A5E9", "#9FEAE7", "#BFEEEE", "#E5FCFF", "#FFE0BD"];

const CustomEvent = ({ event }) => {
    return (
        <div
            style={{
                fontWeight: "bold",
                color: event.color || "#007bff",
            }}
        >
            {event.title}
        </div>
    );
};

const StudentCalendarOfEvent = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [view, setView] = useState("week");

    useEffect(() => {
        const loadStudentEvents = async () => {
            try {
                const data = await getAllEvents("Student");
                const formatted = data.map(event => ({
                    title: event.title,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    color: event.color,
                }));
                setEvents(formatted);
            } catch (err) {
                console.error("Error loading events", err);
            }
        };

        loadStudentEvents();
    }, []);

    const getColumnColor = (index) => {
        return colors[index % colors.length];
    };



    return (
        <CalendarContainer>
            <Header>
                <Title>Student Calendar Of Event</Title>
                <Wrapper>
                    <Link to="/student-dashboard">
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
                min={new Date(2025, 0, 1, 8, 0)}  // 8AM
                max={new Date(2025, 0, 1, 18, 0)} // 6PM
                onView={(newView) => setView(newView)}
                dayPropGetter={(date) => {
                    const columnIndex = date.getDay();
                    return {
                        style: {
                            backgroundColor: getColumnColor(columnIndex),
                        },
                    };
                }}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0
                    }
                })}
            />

        </CalendarContainer>
    );
};

export default StudentCalendarOfEvent;
