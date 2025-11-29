import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  font-family: "Roboto", sans-serif;
  background: #fdfdfd;
  min-height: 100vh;
`;

const SectionTitle = styled.h2`
  font-size: 19px;
  color: #df0043;
  margin-bottom: 10px;
  text-transform: capitalize;
  font-weight: 700;
`;

const RoomsSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 25px;
`;

const RoomsRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 10px;
`;

const RoomCard = styled.div`
  width: 160px;
  padding: 15px;
  border-radius: 18px;
  background: ${(p) => (p.filled === p.total ? "#ffe6ea" : "white")};
  border: 2px solid ${(p) => (p.selected ? "#002087" : "#ddd")};
  box-shadow: ${(p) =>
    p.selected ? "0 4px 14px rgba(0,32,135,0.3)" : "0 2px 8px rgba(0,0,0,0.06)"};
  transition: 0.3s ease;
  cursor: pointer;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    border-color: #df0043;
  }
`;

const RoomText = styled.div`
  font-size: 17px;
  color: #002087;
  font-weight: 700;
`;

const BedsCount = styled.p`
  margin-top: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #222;
`;

const Status = styled.p`
  margin-top: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #444;
`;

const AssignButton = styled.button`
  width: 200px;
  padding: 12px;
  background: #002087;
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 15px;
  margin-top: 28px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #df0043;
  }
  &:disabled {
    background: #bbb;
    cursor: not-allowed;
  }
`;

/* Modal Styling */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 350px;
  background: white;
  padding: 22px;
  border-radius: 22px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.2);
  animation: pop 0.3s ease-out;
  @keyframes pop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const FormTitle = styled.h3`
  text-align: center;
  font-size: 20px;
  color: #df0043;
  font-weight: 700;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px;
  border: 2px solid #002087;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  outline: none;
  &:focus {
    border-color: #df0043;
  }
`;

const FormField = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-top: 12px;
  background: #f5f5f5;
  padding: 9px 12px;
  border-radius: 12px;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #002087;
  color: white;
  border: none;
  margin-top: 18px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #df0043;
  }
`;

const dummyRooms = {
  "2-sharing": [
    { id: "2-101", total: 2, filled: 1 },
    { id: "2-102", total: 2, filled: 2 },
    { id: "2-103", total: 2, filled: 0 },
  ],
  "3-sharing": [
    { id: "3-201", total: 3, filled: 1 },
    { id: "3-202", total: 3, filled: 3 },
    { id: "3-203", total: 3, filled: 2 },
  ],
  "4-sharing": [
    { id: "4-301", total: 4, filled: 3 },
    { id: "4-302", total: 4, filled: 4 },
    { id: "4-303", total: 4, filled: 1 },
  ],
};

const dummyStudents = [
  { admission: "A001", name: "Gnana Dev", class: "10", section: "A" },
  { admission: "A002", name: "Rohan Kumar", class: "10", section: "B" },
  { admission: "A003", name: "Sneha Raj", class: "9", section: "A" },
  { admission: "A004", name: "Arjun Mehta", class: "8", section: "C" },
];

const RoomAvailability = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [student, setStudent] = useState(null);

  const handleSearchStudent = () => {
    const found = dummyStudents.find(
      (stu) => stu.admission === admissionNumber.trim()
    );
    if (!found) {
      alert("Student not found ❌");
      setStudent(null);
    } else {
      setStudent(found);
    }
  };

  const handleAssign = () => {
    if (!student) {
      alert("Please fetch student first!");
      return;
    }
    alert(`✅ Room ${selectedRoom} assigned to ${student.name}`);
    setModalOpen(false);
    setSelectedRoom(null);
    setStudent(null);
    setAdmissionNumber("");
  };

  const room = Object.values(dummyRooms).flat().find(r => r.id === selectedRoom);

  return (
    <Container>

      <h1 style={{marginTop:"20px", fontSize:"24px", fontWeight:"800", color:"#002087"}}>
        🏠 Room Availability
      </h1>

      <RoomsSectionWrapper>
        {Object.entries(dummyRooms).map(([type, rooms]) => (
          <div key={type}>
            <SectionTitle>{type}</SectionTitle>
            <RoomsRow>
              {rooms.map(room => (
                <RoomCard
                  key={room.id}
                  selected={selectedRoom === room.id}
                  filled={room.filled}
                  total={room.total}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <RoomText>{room.id}</RoomText>
                  <BedsCount>{room.filled} / {room.total} Beds</BedsCount>
                  <Status>
                    {room.filled === room.total
                      ? "Fully Filled"
                      : `Available Beds: ${room.total - room.filled}`}
                  </Status>
                </RoomCard>
              ))}
            </RoomsRow>
          </div>
        ))}
      </RoomsSectionWrapper>

      <AssignButton
        disabled={!selectedRoom || room?.filled === room?.total}
        onClick={() => {
          if (!selectedRoom) return alert("Select a room first!");
          if (room?.filled === room?.total) return alert("Room fully filled ❌");
          setModalOpen(true);
        }}
      >
        Assign Room
      </AssignButton>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <FormTitle>📝 Assign Room - {selectedRoom}</FormTitle>
            <Input
              placeholder="Enter Admission Number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
            />
            <ModalButton onClick={handleSearchStudent}>Fetch Student</ModalButton>

            {student && (
              <>
                <FormField>👤 {student.name}</FormField>
                <FormField>🎓 Class {student.class} - Section {student.section}</FormField>
                <ModalButton onClick={handleAssign}>✅ Assign</ModalButton>
              </>
            )}
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default RoomAvailability;
