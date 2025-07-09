import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import teacherImage from "../assets/images/teacher.png";
import assignmentImage from "../assets/images/assignment1.png";
import subjectImage from "../assets/images/subject.png";
import timetableImage from "../assets/images/timetable.png";
import attendanceImage from "../assets/images/attendance1.png";
import { FaEllipsisH } from "react-icons/fa";
import { fetchTeacherById, fetchAnnouncements, fetchLeaveStatusByEmpId } from "../api/ClientApi"; // ✅ Adjust path as needed

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [emp_name, setTeacherName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);

  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
  }

  const emp_id = user?.unique_id;
  const role = user?.role;
  console.log("emp_id", emp_id);
  // Redirect if not student
  useEffect(() => {
    if (!user) return;
    if (role !== "teacher") {
      console.warn("Unauthorized access attempt to student dashboard.");
      navigate("/unauthorized");
    }
  }, [role, navigate]);

  // ✅ Fetch student name using helper function
  useEffect(() => {
    if (!emp_id) return;

    const fetchData = async () => {
      try {
        const response = await fetchTeacherById(emp_id);

        // CORRECTED CHECK: Remove .data from the chain
        if (response?.teacher?.emp_name) {
          setTeacherName(response.teacher.emp_name);
        } else {
          console.error("Invalid teacher data structure:", response);
          setTeacherName("Unknown Teacher");
        }
      } catch (err) {
        console.error("API Error Details:", {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers,
        });

        if (err.response?.status === 403) {
          console.error("Forbidden: Check permissions or token validity");
          localStorage.clear();
          navigate("/login");
        } else if (err.response?.status === 401) {
          console.error("Unauthorized: Token might be expired");
          navigate("/refresh-token");
        } else {
          console.error("Unhandled API error:", err.message);
          setTeacherName("Error Loading Name");
        }
      }
    };

    fetchData();
  }, [emp_id, navigate]);

  useEffect(() => {
    const popupSeen = sessionStorage.getItem("popupSeen");

    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);

        if (data.length > 0 && !popupSeen) {
          const latest = data[0];
          setLatestAnnouncement(latest);
          setShowPopup(true);
          sessionStorage.setItem("popupSeen", "true");
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    loadAnnouncements();
  }, []);

  useEffect(() => {
    const loadLeaveStatus = async () => {
      try {
        const records = await fetchLeaveStatusByEmpId(emp_id);
        setLeaveRecords(records);
      } catch (error) {
        console.error("Failed to fetch leave status:", error);
      }
    };

    if (emp_id) loadLeaveStatus();
  }, [emp_id]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      {showPopup && latestAnnouncement && (
        <PopupOverlay>
          <PopupBox style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#002087',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &times;
            </button>

            <h1 style={{ textAlign: 'center' }}>Announcement</h1>
            <h3>{latestAnnouncement.title}</h3>
            <p>{latestAnnouncement.message}</p>
          </PopupBox>
        </PopupOverlay>
      )}

      <DashboardContainer>
        <WelcomeCard>
          <div className="text">
            <div className="dashboard-title">Dashboard</div>
            <div className="welcome-text">
              <p>Welcome {emp_name}</p>
            </div>
            <div className="date">
              <p>{currentDate}</p>
            </div>
          </div>
          <img className="image" src={teacherImage} alt="Welcome" />
        </WelcomeCard>

        <MainContent>
          <CardGrid>
            <Link to="/teacher-assignments" style={{ textDecoration: "none" }}>
              <DashboardCard color="#9865F6">
                <p>Assignments</p>
                <img src={assignmentImage} alt="Assignments" />
              </DashboardCard>
            </Link>

            <Link to="/teacher-timetable" style={{ textDecoration: "none" }}>
              <DashboardCard color="#FE8906">
                <p>Timetable</p>
                <img src={timetableImage} alt="Timetable" />
              </DashboardCard>
            </Link>

            <Link to="/teacher-subjects" style={{ textDecoration: "none" }}>
              <DashboardCard color="#D5321A">
                <p>Subjects</p>
                <img src={subjectImage} alt="Subjects" />
              </DashboardCard>
            </Link>

            <Link to="/teacher-attendance" style={{ textDecoration: "none" }}>
              <DashboardCard color="#5DC355">
                <p>Attendance </p>
                <img src={attendanceImage} alt="Attendance" />
              </DashboardCard>
            </Link>
          </CardGrid>

          <CalendarSection>
            <CalendarCard>
              <h3>Calendar</h3>
              <StyledCalendar value={date} onChange={setDate} />

              {/* 🔔 Leave Status Notification */}
              <LeaveNotification>
                <h4>Leave Status</h4>
                <LeaveList>
                  {leaveRecords.map((leave, index) => (
                    <LeaveItem key={index} status={leave.status}>
                      {leave.leave_type} - {leave.status}
                    </LeaveItem>
                  ))}
                </LeaveList>
              </LeaveNotification>
            </CalendarCard>
          </CalendarSection>
        </MainContent>
      </DashboardContainer>
    </div>
  );
};

export default TeacherDashboard;

const LeaveNotification = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-top: 15px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  font-family: "Poppins", sans-serif;
  max-height: 120px; /* Limit height */
  overflow-y: auto; /* Enable vertical scroll */

  h4 {
    font-size: 14px;
    margin-bottom: 8px;
    color: #002087;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
`;


const LeaveList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LeaveItem = styled.li`
  font-size: 13px;
  margin-bottom: 6px;
  padding: 6px 10px;
  border-left: 4px solid
    ${(props) =>
      props.status === "Approved"
        ? "#28a745"
        : props.status === "Pending"
        ? "#ffc107"
        : "#dc3545"};
  background-color: ${(props) =>
    props.status === "Approved"
      ? "#e6f4ea"
      : props.status === "Pending"
      ? "#fff8e5"
      : "#fbeaea"};
  border-radius: 4px;
  font-family: "Roboto", sans-serif;
`;


const DashboardContainer = styled.div`
  flex: 1;
  width: 100%;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 0px;
  overflow-x: hidden;
  max-height: 84vh;
  overflow-y: auto;

  @media (max-width: 1024px) {
    max-height: 170vh;
  }
  @media (max-width: 426px) {
    max-height: 270vh;
  }
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #002087, #df0043);
  color: white;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-left: 20px;
  padding: 20px;
  border-radius: 27px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 150px;
  width: 95%;
  z-index: -1;

  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .dashboard-title {
    font-size: 30px;
    font-weight: bold;
    font-family: Poppins;
    position: absolute;
    top: 10px;
    left: 20px;
    font-family: "Poppins", sans-serif;
  }

  .welcome-text {
    position: absolute;
    bottom: 25px;
    left: 20px;
    font-size: 25px;
    font-family: "Roboto", sans-serif;
  }

  .date {
    position: absolute;
    bottom: 8px;
    left: 20px;
    font-size: 15px;
    font-family: "Roboto", sans-serif;
  }

  .image {
    width: 180px;
    height: 160px;
    margin-right: 30px;
  }
  @media (max-width: 1024px) {
    margin: 0;
    margin-bottom: 10px;
    width: 94%;
    padding-left: 10px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    text-align: left;
    height: auto;
    padding-bottom: 30px;

    .dashboard-title {
      position: absolute;
      margin-bottom: 10px;
    }

    .welcome-text {
      position: absolute;
      margin-top: 10px;
    }

    .image {
      margin-left: auto;
    }
  }
  @media (max-width: 426px) {
    width: 90%;
    margin-right: px;
    padding-bottom: 43px;
    .welcome-text {
      font-size: 17px;
    }
    .image {
      height: 100px;
      width: 130px;
      margin-right: 10px;
    }
    .date {
      font-size: 12px;
      margin: 0;
    }
  }

  @media (max-width: 420px) {
    width: 91%;
    margin-bottom: 10px;
    .image {
      position: relative;
      top: 20px;
    }
  }
`;

const MainContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0px;
  margin-left: 10px;
  gap: 30px;
  flex-wrap: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 426px) {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 10px;
  //max-width:650px;
  margin-bottom: 0px;
  padding: 10px;

  @media (max-width: 1366px) {
    gap: 0;
    padding-top: 0;
    padding-left: 0;
    margin: 0;
  }

  @media (max-width: 1024px) {
    width: 100%;
    gap: 7px;
    margin-left: 6px;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr; /* Stack cards */
    margin-left: 20px;
    max-width: auto;
  }
  @media (max-width: 426px) {
    grid-template-columns: 1fr; /* Stack cards */
    gap: 0px;
  }
  @media (max-width: 376px) {
    width: 100%;
    gap: 20px;
  }
`;

const DashboardCard = styled.div`
  background: ${(props) => props.color || "#ffffff"};
   color: white; 
  border-radius: 10px;
  padding: 20px;
  text-align:left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s;
  cursor: pointer;
  height: 150px;
  width:85%;
  gap:10px;
  margin:10px;
  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 200px;
    height: 170px;
    margin-left:auto;

  }
  
  p {
    flex:1;
    font-size: 16px;
    font-weight: bold;
    text-align: left; 
    margin:0;
    font-family: 'Poppins', sans-serif;
  }


    @media(max-width:1366px){
    height:120px;
    img {
      width:170px;
      height:140px;
    }
  }

  @media (max-width: 1024px) {
    gap:5px;
    margin:0;
    width:84%;
   
  }
  @media (max-width: 768px) {
    gap:10px;
    margin:0;
    width:85%;
    
  }

  @media (max-width: 426px) {
    grid-template-columns: 1fr; /* Stack cards */
    width:85%;
    margin-bottom:20px;
  }

     @media (max-width: 376px) {
    margin:0;
    width:85%;
    height:150px;
    img {
    width: 150px;
    height: 150px;
    margin-left:auto;

  }
  }
   @media (max-width: 320px) {
    margin:0;
    margin-left:0px;
    width:80%;
    height:150px;
    img {
    width: 130px;
    height: 130px;
    margin-left:auto;

  }
`;

const CalendarSection = styled.div`
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  flex-direction: column;
  margin-top: 0;

  @media (max-width: 1366px) {
    width: 22%;
  }

  @media (max-width: 1024px) {
    width: 45%;
    margin-left: 200px;
  }
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 20px;
  }
  @media (max-width: 426px) {
    width: 85%;
    margin-left: 25px;
    margin-top: 0;
  }
  @media (max-width: 480px) {
    width: 95%;
    margin-left: 20px;
  }
  @media (max-width: 320px) {
    width: 95%;
    margin-left: 25px;
  }
`;

const CalendarCard = styled.div`
  background: rgb(111, 184, 162);
  color: #333;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 95%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 2px;
  margin-right: 30px;
  height: 380px;

  h3 {
    margin-bottom: 8px;
    align-text: left;
    font-family: "Poppins", sans-serif;
    color: white;
  }

  @media (max-width: 1366px) {
    margin-top: 10px;
    height: 300px;

    h3 {
      margin-top: 0;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 425px) {
    width: 90%;
  }
`;

const StyledCalendar = styled(Calendar)`
  max-width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 5px;

  .react-calendar__navigation {
    margin-bottom: 2px; /* Reduce gap between month and days */
    padding-bottom: 0; /* Minimize extra space */
  }

  .react-calendar__month-view__weekdays {
    margin-bottom: 0; /* Remove extra gap */
    font-size: 12px;
  }
  .react-calendar__tile {
    font-size: 12px; /* Reduce font size to fit */
    padding: 4px;
  }

  .react-calendar__month-view {
    height: 190px; /* Ensure the calendar stays within 200px */
    margin: 0;
  }

  .react-calendar__navigation button {
    font-size: 12px;
    padding: 2px;
  }

  @media (max-width: 1366px) {
    padding: 0;

    .react-calendar__tile {
      font-size: 9px; /* Reduce font size to fit */
      padding: 0px;
    }
  }
`;

const AnnouncementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 300px; /* Prevent overflow */
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const NotificationCard = styled(Link)`
  display: flex;
  align-items: center;
  background: #f1f9f6;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease-in-out;
  text-decoration: none;
  color: inherit;
  width: 90%;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
`;

const DateText = styled.span`
  font-size: 11px;
  color: #6c757d;
  font-family: "Roboto", sans-serif;
  margin-top: 3px;
`;

const OptionsIcon = styled(FaEllipsisH)`
  font-size: 14px;
  color: #6c757d;
`;
const AnnouncementsHeading = styled.h3`
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
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
  padding: 30px;
  border-radius: 15px;
  width: 40%;
  max-width: 350px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height:200px;
  height:50%;

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

    &:hover {
      background-color: #001764;
    }
  }
`;
