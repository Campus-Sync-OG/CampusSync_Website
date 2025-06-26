import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { getAllClassSections ,uploadTimetable} from "../api/ClientApi";

const defaultTimeSlots = [
  "9:00 AM", "9:45 AM", "10:30 AM", "10:45 AM", "11:30 AM", "12:45 PM", "1:45 PM", "2:30 PM", "3:45 PM"
];
const breakSlots = ["10:30 AM", "12:45 PM"];
const breakLabels = { "10:30 AM": "Snacks Break", "12:45 PM": "Lunch Break" };
const colors = ["#7d9a9a", "#cfded4", "#f0dcd3", "#f9c8bb", "#d2c7b3", "#b3e5f2"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const generateEmptySchedule = (slots) => {
  const empty = {};
  days.forEach(day => {
    empty[day] = slots.map(slot =>
      breakSlots.includes(slot) ? breakLabels[slot] : ""
    );
  });
  return empty;
};

const AdminTimetable = () => {
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const [timeSlots, setTimeSlots] = useState(defaultTimeSlots);
  const [schedule, setSchedule] = useState(generateEmptySchedule(defaultTimeSlots));
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllClassSections();
      setClassOptions(data.map(d => ({ id: d.id, className: d.className })));
      setSectionOptions(data.map(d => ({ id: d.id, section_name: d.section_name })));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadSchedule = async () => {
      if (selectedClass && selectedSection) {
        try {
          const res = await getTimetable(selectedClass, selectedSection);
          if (res?.schedule) {
            const loaded = {};
            days.forEach(day => {
              loaded[day] = timeSlots.map(slot => {
                const match = res.schedule[day]?.find(s => s.time === slot);
                return match ? match.subject : breakSlots.includes(slot) ? breakLabels[slot] : "";
              });
            });
            setSchedule(loaded);
          } else {
            setSchedule(generateEmptySchedule(timeSlots));
          }
        } catch {
          setSchedule(generateEmptySchedule(timeSlots));
        }
      }
    };
    loadSchedule();
  }, [selectedClass, selectedSection, timeSlots]);

  const handleEdit = () => setEditable(true);

  const handleSubmit = async () => {
    setEditable(false);
    if (!selectedClass || !selectedSection) return alert("Select class and section");

    const formatted = {};
    days.forEach(day => {
      formatted[day] = schedule[day].map((subject, idx) => ({ time: timeSlots[idx], subject }));
    });

    try {
      await uploadTimetable({ className: selectedClass, section_name: selectedSection, schedule: formatted });
      alert("Timetable uploaded!");
    } catch {
      alert("Upload failed.");
    }
  };

  const handleChange = (day, idx, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((item, i) => (i === idx ? value : item))
    }));
  };

  const handleTimeChange = (idx, value) => {
    const updated = [...timeSlots];
    updated[idx] = value;
    setTimeSlots(updated);
    setSchedule(generateEmptySchedule(updated));
  };

  const addTimeSlot = () => {
    const newSlot = "New Slot";
    setTimeSlots(prev => {
      const updatedSlots = [...prev, newSlot];
      // Update schedule for the new slot by adding an empty value for each day
      setSchedule(prevSchedule => {
        const updatedSchedule = { ...prevSchedule };
        days.forEach(day => {
          updatedSchedule[day] = [...updatedSchedule[day], ""]; // Add empty value for each day for the new time slot
        });
        return updatedSchedule;
      });
      return updatedSlots;
    });
  };
  
  const removeTimeSlot = (idx) => {
    setTimeSlots(prev => {
      const newSlots = prev.filter((_, i) => i !== idx);
      // Update schedule by removing the column for the selected time slot index
      setSchedule(prevSchedule => {
        const updatedSchedule = { ...prevSchedule };
        days.forEach(day => {
          updatedSchedule[day] = updatedSchedule[day].filter((_, i) => i !== idx); // Remove the column for the removed time slot
        });
        return updatedSchedule;
      });
      return newSlots;
    });
  };
  
  

  const breakColumns = editable
    ? timeSlots.map((_, idx) =>
        days.some(day =>
          (schedule[day]?.[idx] || "").toLowerCase().includes("break")
        )
      )
    : [];

  return (
    <Container>
      <Header>
        <Title>Time Table</Title>
        <IconGroup>
          <Link to="/admin-dashboard"><Icon src={home} alt="home" /></Link>
          <Divider />
          <Icon src={back} alt="back" onClick={() => navigate(-1)} />
        </IconGroup>
      </Header>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel>Class:</FilterLabel>
          <FilterSelect value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classOptions.map(cls => (
              <option key={cls.id} value={cls.className}>{cls.className}</option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Section:</FilterLabel>
          <FilterSelect value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
            <option value="">Select Section</option>
            {sectionOptions.map(sec => (
              <option key={sec.id} value={sec.section_name}>{sec.section_name}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </FilterContainer>

      <ButtonRow>
        <EditButton onClick={handleEdit}>Edit</EditButton>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        <AddSlotButton onClick={addTimeSlot}>+ Add Time Slot</AddSlotButton>
      </ButtonRow>

      <StyledTable>
        <thead>
          <tr>
            <TimeCell>Day</TimeCell>
            {timeSlots.map((slot, idx) => (
              <DayHeader key={idx}>
                {editable ? (
                  <div>
                    <input
                      value={slot}
                      onChange={(e) => handleTimeChange(idx, e.target.value)}
                      style={{ width: "80px" }}
                    />
                    <RemoveSlotButton onClick={() => removeTimeSlot(idx)}>x</RemoveSlotButton>
                  </div>
                ) : (
                  slot
                )}
              </DayHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIdx) => (
            <tr key={day}>
              <TimeCell style={{ backgroundColor: colors[dayIdx] }}>{day}</TimeCell>
              {schedule[day]?.map((subject, idx) => {
                const isDynamicBreak = editable && breakColumns[idx];
                const isHardcodedBreak = breakSlots.includes(timeSlots[idx]);
                const isBreak = isHardcodedBreak || isDynamicBreak;

                return (
                  <td
                    key={`${day}-${idx}`}
                    style={{
                      backgroundColor: isBreak ? "#002087" : colors[dayIdx],
                      color: isBreak ? "white" : "black",
                      fontWeight: isBreak ? "bold" : "normal"
                    }}
                  >
                    {editable && !isHardcodedBreak ? (
                      <input
                        value={subject}
                        onChange={(e) => handleChange(day, idx, e.target.value)}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          textAlign: "center",
                          color: isBreak ? "white" : "black",
                          fontWeight: isBreak ? "bold" : "normal"
                        }}
                      />
                    ) : (
                      subject
                    )}
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

export default AdminTimetable;

const Container = styled.div`
  padding: 0 15px;
`;

const AddSlotButton = styled.button`
  margin: 10px 0;
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #45a049;
  }
`;

const RemoveSlotButton = styled.button`
  margin-left: 8px;
  padding: 6px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #d32f2f;
  }
`;

const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 1px 20px;
  color: white;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
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
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 2px;
  height: 25px;
  background-color: white;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-bottom: 20px;
`;

const EditButton = styled.button`
  background-color: #002087;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: #df0043;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  td,
  th {
    padding: 15px;
    border: 1px solid #ddd;
    font-size: 17px;
    background: #BA76AD;
  }
`;

const TimeCell = styled.td`
  background-color: #8f6b9f;
  font-weight: bold;
  color: black;
`;

const DayHeader = styled.th`
  font-weight: bold;
  font-size: 15px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  justify-content: flex-start;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
