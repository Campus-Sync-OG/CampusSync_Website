import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import dashboard from "../assets/images/dashboard.png";
import academics from "../assets/images/academics.png";
import fees from "../assets/images/fees.png";
import assignment from "../assets/images/assignment.png";
import attendance from "../assets/images/attendance.png";
import {
  fetchStudentByAdmissionNo,
  fetchAnnouncements,
} from "../api/ClientApi"; // API function to fetch student info
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";
// Styled Components
const PageContainer = styled.div`
  flex: 1;
  padding: 0 20px;
  width: 98.5%;
  margin: 40px 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 80vh;
  scroll-behavior: smooth;
  position: relative;
  right: 80px;
  bottom: 35px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f9f9f9;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    width: 86%;
  }

  @media (max-width: 420px) {
    width: 86%;
  }
  @media (max-width: 320px) {
    width:0%;
  }
`;

const DashboardContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  @media (max-width: 360px) {
    width: 0;
  }
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #002087, #df0043);
  color: white;
  border-radius: 20px;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4rem;
  width: 105.5%;
  flex-wrap: wrap;
  position: relative;
  z-index: -1;

  h2 {
    font-size: 1.6rem;
    position: relative;
    left: 1px;
    bottom: 35px;
    font-weight: 40px;
    font-family: "Poppins", sans-serif;
  }

  p {
    font-size: 1.5rem;
    text-align: left;
    position: relative;
    top: 15px;
    margin: 0;
  }

  img {
    min-width: 35%;
    max-width: 60%;
    min-height: 25vh;
    max-height: 25vh;
    position: relative;
    top: 15px;
  }

  @media (max-width: 1366px) {
    margin-bottom: 1rem;
  }

  @media (max-width: 1024px) {
    position: relative;
    left: 12px;
    width: 101%;
    margin-left: 10px;

    h2 {
      font-size: 1.5rem;
      text-align: center;
    }

    img {
      min-height: 22vh;
      max-height: 22vh;
    }

    p {
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    overflow-x: hidden;
    width: 102%;
  }

  @media (max-width: 480px) {
    width: 107%;
    left: 30px;
    h2 {
      top: 0;
    }
    p {
      text-align: center;
      top: 0px;
    }
    img {
      left: 35px;
      min-height: 1vh;
      max-height: 12vh;
    }
  }
  @media (max-width: 420px) {
    width: 100%;

    h2 {
      top: 0;
      font-size: 1.1rem;
    }
    p {
      text-align: center;
      font-size: 1rem;
    }
    img {
      left: 25px;
      top: 0px;
      min-height: 1vh;
      max-height: 9.3vh;
    }
  }
  @media (max-width: 380px) {
    width: 100%;
    left: 36px;
    h2 {
      top: 0;
      font-size: 1.3rem;
    }
    p {
      text-align: center;
      font-size: 1rem;
    }
    img {
      left: 25px;
      top: 0px;
      min-width: 55%;
      max-width: 35%;
      min-height: 15vh;
      max-height: 9vh;
    }
  }

  @media (max-width: 320px) {
     min-width: 212px;
    left: 42px;
    h2 {
      top: 0;
      font-size: 1.2rem;
    }
    p {
      text-align: center;
      font-size: 0.9rem;
    }
    img {
      left: 25px;
      top: 0px;
      min-width: 45%;
      max-width: 30%;
      min-height: 12vh;
      max-height: 9vh;
    }
  }
`;
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupBox = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  height: 50%;
  h1 {
    color: red;
    font-family: "Poppins", sans-serif;
  }

  h3 {
    margin-bottom: 10px;
    font-family: "Poppins", sans-serif;
  }

  p {
    margin: 10px 0;
    font-family: "Roboto", sans-serif;
  }

  button {
    margin-top: 20px;
    background-color: #002087;
    color: white;
    border: none;
    padding: 10px 20px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    border-radius: 8px;
    cursor: pointer;
    gap: 10px;

    &:hover {
      background-color: #001764;
    }
  }
`;

const WidgetsContainer = styled.div`
  display: grid;
  grid-template-columns: 2.9fr 0.5fr;

  @media (max-width: 1024px) {
    position: relative;
    right: 10px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 1.2rem 5.5rem;
  margin-top: 0;

  @media (max-width: 1366px) {
    gap: 15px 87px;
    padding-top: 0;
    padding-left: 0;
    margin-left: 5px;
    height: 35%;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0rem 6rem;
    position: relative;
    right: 10px;
    bottom: 10px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 25px 100px;
    position: relative;
    right: 24px;
  }

  @media (max-width: 480px) {
    gap: 15px 105px;
  }
  @media (max-width: 380px) {
    left: 25px;
    width: 100%;
  }
  @media (max-width: 320px) {
    gap: 15px 105px;
    left: 35px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Widget = styled.div`
  background-color: ${({ color }) => color || "#fff"};
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  width: 110%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 1366px) {
    width: 115%;
    height: 120px;
  }

  @media (max-width: 1024px) {
    position: relative;
    left: 40px;
    width: 130%;
    height: 70%;
  }
  @media (max-width: 768px) {
    position: relative;
    height: 130px;
    width: 115%;
    left: 55px;
  }
  @media (max-width: 480px) {
    height: 120px;
    width: 109%;
    left: 80px;
  }
  @media (max-width: 380px) {
    height: 100px;
    width: 100%;
    left: 40px;
  }
  @media (max-width: 320px) {
    overflow-x: hidden;
    position: relative;
    height: 80px;
    width: 104%;
    left: 25px;
  }
`;

const WidgetTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 27;
  font-family: "Poppins", sans-serif;
  color: #fff;
  position: relative;
  right: 100px;
  top: 15px;

  @media (max-width: 1366px) {
    font-size: 1.3rem;
  }

  @media (max-width: 1024px) {
    font-size: 1rem;
    right: 40px;
    top: -10px;
  }
  @media (max-width: 768px) {
    right: 110px;
    top: 10px;
  }
  @media (max-width: 480px) {
    position: relative;
    font-size: 1.2rem;
    bottom: 10px;
    right: 90px;
  }
  @media (max-width: 380px) {
    font-size: 1rem;
    position: relative;
    right: 80px;
  }
  @media (max-width: 320px) {
    font-size: 0.9rem;
    right: 60px;
  }
`;

const WidgetImage = styled.img`
  max-height: 100%;
  max-width: 75%;
  margin: 0;
  position: relative;
  left: 110px;
  top: 0px;

  @media (max-width: 1366px) {
    max-height: 90%;
    max-width: 70%;
  }

  @media (max-width: 1024px) {
    position: relative;
    max-width: 85%;
    left: 40px;
  }
  @media (max-width: 480px) {
    position: relative;
    left: 60px;
    bottom: 20px;
  }
  @media (max-width: 380px) {
    position: relative;
    left: 60px;
    bottom: 20px;
  }
  @media (max-width: 320px) {
    position: relative;
    left: 80px;
    width: 60%;
  }
`;

const CalendarContainer = styled.div`
  position: relative;
  background-color: #fdd980;
  border-radius: 18px;
  padding: 1rem;
  width: 100%;
  max-width: 335px;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 90px;

  @media (max-width: 1366px) {
    height: 90%;
  }

  @media (max-width: 1024px) {
    position: relative;
    width: 75%;
    height: 86%;
    left: 130px;
    bottom: 10px;
  }
  @media (max-width: 768px) {
    position: relative;
    left: 210px;
  }
  @media (max-width: 480px) {
    width: 100%;
    position: relative;
    left: 70px;
  }
  @media (max-width: 380px) {
    position: relative;
    left: 67px;
    width: 100%;
  }
  @media (max-width: 320px) {
    position: relative;
    left: 72px;
    width: 96%;
  }
`;

const CalendarWidget = styled.div`
  background-color: white;
  width: 90%;
  height: 100%;
  padding: 1rem;
  border-radius: 15px;
  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 1366px) {
    height: 95%;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CalendarButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #002087;

  &:hover {
    color: #df0043;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  text-align: center;

  @media (max-width: 1366px) {
    gap: 0;
  }

  @media (max-width: 1024px) {
    font-size: 15px;
    position: relative;
  }

  @media (max-width: 380px) {
    font-size: 10px;
    gap: 0rem;
  }
`;

const CalendarDay = styled.div`
  padding: 0.5rem;
  border-radius: 5px;
  background-color: ${({ isToday }) => (isToday ? "#002087" : "transparent")};
  color: ${({ isToday }) => (isToday ? "#fff" : "#000")};
  @media (max-width: 1024px) {
    position: relative;
    font-size: 8px;
  }

  @media (max-width: 380px) {
    font-size: 10px;
    gap: 0rem;
  }
  @media (max-width: 320px) {
    font-size: 8px;
    gap: 0rem;
  }
`;

const BirthdayPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const BirthdayCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
`;

const BirthdayTitle = styled.h1`
  font-size: 30px;
  margin-bottom: 20px;
`;

const BirthdayMessage = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const BirthdayButton = styled.button`
  background: #ff69b4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
`;

const widgetConfig = [
  {
    title: "Academics",
    color: "#9865F6",
    image: academics,
    link: "/academics",
  },
  {
    title: "School Fees",
    color: "#FE8906",
    image: fees,
    link: "/fees",
  },
  {
    title: "Attendance",
    color: "#D5321A",
    image: attendance,
    link: "/attendance",
  },
  {
    title: "Assignment",
    color: "#5DC355",
    image: assignment,
    link: "/school/assignment",
  },
];

const CalendarComponent = ({ currentDate, onPrevious, onNext }) => {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const adjustedFirstDay = (firstDay + 6) % 7;
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <CalendarContainer>
      <CalendarWidget>
        <CalendarHeader>
          <CalendarButton onClick={onPrevious}>&lt;</CalendarButton>
          <span>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </span>
          <CalendarButton onClick={onNext}>&gt;</CalendarButton>
        </CalendarHeader>
        <CalendarGrid>
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
          {[...Array(adjustedFirstDay)].map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => (
            <CalendarDay
              key={i + 1}
              isToday={
                i + 1 === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
              }
            >
              {i + 1}
            </CalendarDay>
          ))}
        </CalendarGrid>
      </CalendarWidget>
    </CalendarContainer>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [student_name, setStudentName] = useState("");
  const [isBirthday, setIsBirthday] = useState(false);
  const [showBirthdayWish, setShowBirthdayWish] = useState(false);
  const [width, height] = useWindowSize(); // ✅ get window size for confetti
  const [showPopup, setShowPopup] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
  }

  const admission_no = user?.unique_id;
  const role = user?.role;

  // Redirect if not student
  useEffect(() => {
    if (!user) return;
    if (role !== "student") {
      console.warn("Unauthorized access attempt to student dashboard.");
      navigate("/unauthorized");
    }
  }, [role, navigate]);

  // ✅ Fetch student name using helper function
  useEffect(() => {
    if (admission_no) {
      const token = localStorage.getItem("token");
      console.log("Token in localStorage:", token); // <-- check this

      fetchStudentByAdmissionNo(admission_no)
        .then((data) => {
          setStudentName(data.student_name);
        })
        .catch((err) => {
          console.error("Error fetching student info:", err);
        });
    }
  }, [admission_no]);

  const handleDateChange = (direction) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (direction === "prev" ? -1 : 1),
        1
      )
    );
  };

  if (!user) {
    return <p>Loading your personalized dashboard...</p>;
  }

  useEffect(() => {
    const fetchStudentDob = async () => {
      try {
        const res = await fetchStudentByAdmissionNo(admission_no);
        const dob = res?.dob; // 👈 correct way

        if (dob) {
          const today = new Date();
          const dobDate = new Date(dob);

          const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;
          const dobMonthDay = `${dobDate.getMonth() + 1}-${dobDate.getDate()}`;

          console.log("Today:", todayMonthDay, "Student DOB:", dobMonthDay);

          if (todayMonthDay === dobMonthDay) {
            setIsBirthday(true);
            setShowBirthdayWish(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      }
    };

    if (admission_no) {
      fetchStudentDob();
    }
  }, [admission_no]);

  useEffect(() => {
    const popupSeen = sessionStorage.getItem("popupSeen");

    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        console.log("Fetched Announcements:", data);
        setAnnouncements(data);

        if (data.length > 0 && !popupSeen) {
          const latest = data[0]; // your controller already sorts DESC
          setLatestAnnouncement(latest);
          setShowPopup(true);
          sessionStorage.setItem("popupSeen", "true"); // Mark popup as shown
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    loadAnnouncements();
  }, []);

  return (
    <>
      {isBirthday && showBirthdayWish && (
        <BirthdayPopup>
          <Confetti width={width} height={height} />
          <BirthdayCard>
            <BirthdayTitle>🎉 Happy Birthday, {student_name}! 🎂</BirthdayTitle>
            <BirthdayMessage>
              Wishing you a day filled with joy, success, and lots of cake! 🍰🎁
            </BirthdayMessage>
            <BirthdayButton onClick={() => setShowBirthdayWish(false)}>
              Thank You!
            </BirthdayButton>
          </BirthdayCard>
        </BirthdayPopup>
      )}
      {showPopup && latestAnnouncement && (
        <PopupOverlay>
          <PopupBox style={{ position: "relative" }}>
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "30px",
                height: "30px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#002087",
                color: "#fff",
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &times;
            </button>

            {/* Centered Title */}
            <h1 style={{ textAlign: "center" }}>Announcement</h1>

            <h3>{latestAnnouncement.title}</h3>
            <p>{latestAnnouncement.message}</p>
          </PopupBox>
        </PopupOverlay>
      )}

      <PageContainer>
        <DashboardContainer>
          <WelcomeSection>
            <div>
              <h2>Dashboard</h2>
              <p>Welcome {student_name} </p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <img src={dashboard} alt="Dashboard Illustration" />
          </WelcomeSection>

          <WidgetsContainer>
            <CardGrid>
              {widgetConfig.map((widget) => (
                <StyledLink to={widget.link} key={widget.title}>
                  <Widget color={widget.color}>
                    <WidgetTitle>{widget.title}</WidgetTitle>
                    <WidgetImage src={widget.image} alt={widget.title} />
                  </Widget>
                </StyledLink>
              ))}
            </CardGrid>

            <CalendarComponent
              currentDate={currentDate}
              onPrevious={() => handleDateChange("prev")}
              onNext={() => handleDateChange("next")}
            />
          </WidgetsContainer>
        </DashboardContainer>
      </PageContainer>
    </>
  );
};

export default DashboardPage;
