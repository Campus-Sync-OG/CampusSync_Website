import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./tabs/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TeacherSidebar from "./components/TeacherSidebar";
import AdminSidebar from "./components/AdminSidebar";
import PrincipalSidebar from "./components/PrincipalSidebar";
import AttendancePage from "./pages/AttendancePage";
import AssignmentPage from "./pages/AssignmentPage";
import AchievementPage from "./pages/AchievementPage";
import UserProfile from "./pages/UserProfile";
import ParentProfile from "./pages/ParentProfile";
import Academics from "./pages/AcademicsPage";
import FormsPage from "./pages/FormsPage";
import GalleryPage from "./pages/GalleryPage";
import TeacherDashboard from "./teacher/TeacherDashboard";
import CertificateRequest from "./pages/CertificateRequest";
import TeacherAssignment from "./teacher/TeacherAssignment";
import NotificationPopup from "./components/notificationpopup";
import NotificationPage from "./pages/NotificationPage";
import TeacherAttendance from "./teacher/TeacherAttendance";
import StudentdetailsPage from "./pages/StudentdetailsPage";
import TeacherTimetable from "./teacher/TeacherTimetable";
import TeacherForm from "./teacher/TeacherForm";
import TeacherCircular from "./teacher/TeacherCircular";
import TeacherProfile from "./teacher/TeacherProfile";
import TeacherFee from "./teacher/TeacherFee";
import TeacherAchievements from "./teacher/TeacherAchievements";
import AdminLogin from "./tabs/AdminLogin";
import TeacherLogin from "./tabs/TeacherLogin";
import StudentLogin from "./tabs/StudentLogin";
import PrincipalLogin from "./tabs/PrincipalLogin";
import ForgotPassword from "./tabs/ForgotPassword";
import AdminDashboard from "./userpages/AdminDashboard";
import SchoolInformation from "./userpages/SchoolInformation";
import TeacherInformation from "./userpages/TeacherInformation";
import TeachersData from "./userpages/TeachersData";
import StudentsData from "./userpages/StudentsData";
import StudentInformation from "./userpages/StudentInformation";
import AdminGallery from "./userpages/AdminGallery";
import TeacherAcademics from "./teacher/TeacherAcademics";
import AdminSubject from "./userpages/AdminSubject";
import AdminNotification from "./userpages/AdminNotification";
import AdminFeedback from "./userpages/AdminFeedback";
import Announcement from "./userpages/Announcement";
import TeacherCalendarofEvent from "./teacher/TeacherCalendarofEvent";
import TeacherSubjects from "./teacher/TeacherSubjects";
import TeacherMyclass from "./teacher/TeacherMyclass";
import Promotion from "./userpages/Promotion";
import UserCreation from "./userpages/UserCreation";
import AdminTimetable from "./userpages/AdminTimetable";
import SchoolPage from "./pages/SchoolPage";
import StudentFees from "./pages/StudentFees";
import Circular from "./pages/Circular";
import TimeTable from "./pages/TimeTable";
import PrincipalDashboard from "./principal/PrincipalDashboard";
import PrincipalAcademics from "./principal/PrincipalAcadamic";
import TeacherInfo from "./principal/TeacherInfo";
import StudentInfo from "./principal/StudentInfo";
import PrincipalGallery from "./principal/PrincipalGallery";
import AddNotification from "./principal/AddNotification";
import PrincipalFees from "./principal/PrincipalFees";
import PrincipalFeedback from "./principal/PrincipalFeedback";
import PrincipleAnnouncement from "./principal/PrincipalAnnouncement";
import AdminFee from "./userpages/AdminFee";
import SubjectList from "./userpages/SubjectList";
import AddSubject from "./userpages/AddSubject";
import TeacherAttendanceDownload from "./teacher/TeacherAttendanceDownload";
import PrincipalSubject from "./principal/PrincipalSubjects";
import ReceiptPage from "./principal/ViewReciept";
import StudentReceiptPage from "./pages/ReciptPage";
import TeacherSchoolinfo from "./teacher/TeacherSchoolinfo";
import AttendnaceReport from "./principal/AttendanceReport";
import LeaveApplication from "./teacher/LeaveApplication";
import PrincipalLeavePanel from "./principal/PrincipalLeavePanel";
import StudentLeaveApplication from "./pages/StudentLeaveApplication";
import StudyModuleUpload from "./userpages/StudyModuleUpload";
import StudyModulePage from "./pages/StudyModulePage";
import ChatPage from "./components/ChatPage";
import PrincipalProfile from "./principal/PrincipalProfile";
import StudentDocument from "./userpages/AddStudentDocument";
import TeacherViewAssignment from "./teacher/TeacherViewAssignment";
import AnnouncementPage from "./pages/AnnouncementPage";
import StudentDocumentView from "./userpages/StudentDocumentView";
import DocumentView from "./pages/DocumentView";
import StudentFeeDetails from "./userpages/StudentFeeDetails";
import AdminCalendarPanel from "./userpages/AdminCalendarPanel";
import StudentCalendarOfEvent from "./pages/StudentCalendarOfEvent";
import TeacherLeaveApprovals from "./teacher/TeacherLeaveApprovals";  
import BusLocationDisplay from "./pages/BusLocationDisplay";
import BusMaps from "./pages/BusMaps";
import AddDriver from "./userpages/AddDriver";
import Drivers from "./userpages/Drivers";
import AddBus from "./userpages/AddBus";
import Buses from "./userpages/Buses";
import DriverLocation from "./pages/DriverLocation";

// 📌 General Layout Component for Students (Uses Sidebar)
const Layout = ({ children }) => {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Sidebar />
          <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
        </div>
      </div>
    </>
  );
};

// 📌 Layout Component for Teachers (Uses TeacherSidebar)
const TeacherLayout = ({ children }) => {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <TeacherSidebar />
          <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
        </div>
      </div>
    </>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <AdminSidebar />
          <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
        </div>
      </div>
    </>
  );
};

const PrincipalLayout = ({ children }) => {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <PrincipalSidebar />
          <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/principal-login" element={<PrincipalLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/*  Student Dashboard & Pages (Uses Sidebar) */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />
          <Route
            path="/attendance"
            element={
              <Layout>
                <AttendancePage />
              </Layout>
            }
          />
          <Route
            path="/announcement"
            element={
              <Layout>
                <AnnouncementPage />
              </Layout>
            }
          />
          <Route
            path="/school/assignment"
            element={
              <Layout>
                <AssignmentPage />
              </Layout>
            }
          />

          <Route
            path="/school/calendar"
            element={
              <Layout>
                <StudentCalendarOfEvent />
              </Layout>
            }
          />
          <Route
            path="/achievement"
            element={
              <Layout>
                <AchievementPage />
              </Layout>
            }
          />
          <Route
            path="/profile/my-profile"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          <Route
            path="/profile/parent-info"
            element={
              <Layout>
                <ParentProfile />
              </Layout>
            }
          />
          <Route
            path="/school/circular"
            element={
              <Layout>
                <Circular />
              </Layout>
            }
          />
          <Route
            path="/school/timetable"
            element={
              <Layout>
                <TimeTable />
              </Layout>
            }
          />
          <Route
            path="/academics"
            element={
              <Layout>
                <Academics />
              </Layout>
            }
          />
          <Route
            path="/forms-feedback"
            element={
              <Layout>
                <FormsPage />
              </Layout>
            }
          />
          <Route
            path="/gallery"
            element={
              <Layout>
                <GalleryPage />
              </Layout>
            }
          />
          <Route
            path="/school/certificate-request"
            element={
              <Layout>
                <CertificateRequest />
              </Layout>
            }
          />

          <Route
            path="/notification-popup"
            element={
              <Layout>
                <NotificationPopup />
              </Layout>
            }
          />

          <Route
            path="/chatbot"
            element={
              <Layout>
                <ChatPage />
                {/* Chatbot component can be added here */}
              </Layout>
            }
          />
          <Route
            path="/notification"
            element={
              <Layout>
                <NotificationPage />
              </Layout>
            }
          />

          <Route
            path="/profile/school-info"
            element={
              <Layout>
                <SchoolPage />
              </Layout>
            }
          />

          <Route
            path="/fees"
            element={
              <Layout>
                <StudentFees />
              </Layout>
            }
          />
          <Route
            path="/student-receipt"
            element={
              <Layout>
                <StudentReceiptPage />
              </Layout>
            }
          />
          <Route
            path="/leave"
            element={
              <Layout>
                <StudentLeaveApplication />
              </Layout>
            }
          />

          <Route
            path="/study-module"
            element={
              <Layout>
                <StudyModulePage />
          <Route
            path="/BusMap"
            element={
              <Layout>
                <BusMaps />
              </Layout>
            }
          />
          <Route
            path="/documentview"
            element={
              <Layout>
                <DocumentView />
              </Layout>
             }
             />
             <Route
            path="/BusLocation"
            element={
              <Layout>
                <BusLocationDisplay />
              </Layout>
            }
          />
          <Route
            path="/DriverLocation"
            element={
              <Layout>
                <DriverLocation />
              </Layout>
            }
          />
          {/*  Teacher Dashboard & Pages (Uses TeacherSidebar) */}
          <Route
            path="/teacher-dashboard"
            element={
              <TeacherLayout>
                <TeacherDashboard />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-timetable"
            element={
              <TeacherLayout>
                <TeacherTimetable />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-form"
            element={
              <TeacherLayout>
                <TeacherForm />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-circular"
            element={
              <TeacherLayout>
                <TeacherCircular />
              </TeacherLayout>
            }
          />
          <Route
            path="/profile/teacher-profile"
            element={
              <TeacherLayout>
                <TeacherProfile />
              </TeacherLayout>
            }
          />

           <Route
            path="/teacher-student-leaves"
            element={
              <TeacherLayout>
                <TeacherLeaveApprovals />
              </TeacherLayout>
            }
          />
          <Route
            path="/profile/teacher-school-info"
            element={
              <TeacherLayout>
                <TeacherSchoolinfo />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-fees"
            element={
              <TeacherLayout>
                <TeacherFee />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-achievement"
            element={
              <TeacherLayout>
                <TeacherAchievements />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-attendance"
            element={
              <TeacherLayout>
                <TeacherAttendance />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-attendance-download"
            element={
              <TeacherLayout>
                <TeacherAttendanceDownload />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-myclass"
            element={
              <TeacherLayout>
                <TeacherMyclass />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-assignments"
            element={
              <TeacherLayout>
                <TeacherAssignment />
              </TeacherLayout>
            }
          />
          <Route
            path="/notification-popup"
            element={
              <TeacherLayout>
                <NotificationPopup />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-chatbot"
            element={
              <TeacherLayout>
                <ChatPage />
                {/* Chatbot component can be added here */}
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher/announcement"
            element={
              <TeacherLayout>
                <AnnouncementPage />
                {/* Chatbot component can be added here */}
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-academics"
            element={
              <TeacherLayout>
                <TeacherAcademics />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-calendar-of-event"
            element={
              <TeacherLayout>
                <TeacherCalendarofEvent />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-notification"
            element={
              <TeacherLayout>
                <NotificationPage />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-subjects"
            element={
              <TeacherLayout>
                <TeacherSubjects />
              </TeacherLayout>
            }
          />
          <Route
            path="/studentdetails"
            element={
              <TeacherLayout>
                <StudentdetailsPage />
              </TeacherLayout>
            }
          />
          <Route
            path="/teacher-levaveapplication"
            element={
              <TeacherLayout>
                <LeaveApplication />
              </TeacherLayout>
            }
          />
          <Route
            path="/view-assignments"
            element={
              <TeacherLayout>
                <TeacherViewAssignment />
              </TeacherLayout>
            }
          />
          {/*  Admin Dashboard & Pages (Uses Aminsidebar) */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-school-information"
            element={
              <AdminLayout>
                <SchoolInformation />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-teacher-information"
            element={
              <AdminLayout>
                <TeacherInformation />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-teacher-data"
            element={
              <AdminLayout>
                <TeachersData />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/announcement"
            element={
              <AdminLayout>
                <AnnouncementPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-students-data"
            element={
              <AdminLayout>
                <StudentsData />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-student-information"
            element={
              <AdminLayout>
                <StudentInformation />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-gallery"
            element={
              <AdminLayout>
                <AdminGallery />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-subjects"
            element={
              <AdminLayout>
                <AdminSubject />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-add-notification"
            element={
              <AdminLayout>
                <AdminNotification />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-feedback"
            element={
              <AdminLayout>
                <AdminFeedback />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-announcement"
            element={
              <AdminLayout>
                <Announcement />
              </AdminLayout>
            }
          />

          <Route
            path="/admin-promotion"
            element={
              <AdminLayout>
                <Promotion />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-usercreation"
            element={
              <AdminLayout>
                <UserCreation />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-timetable"
            element={
              <AdminLayout>
                <AdminTimetable />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-fee"
            element={
              <AdminLayout>
                <AdminFee />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-subjectlist"
            element={
              <AdminLayout>
                <SubjectList />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-addsubject"
            element={
              <AdminLayout>
                <AddSubject />
              </AdminLayout>
            }
          />
          <Route
            path="/transport/addbus"
            element={
              <AdminLayout>
                <AddBus/>
              </AdminLayout>
            }
          />
          <Route
            path="/transport/buses"
            element={
              <AdminLayout>
                <Buses />
              </AdminLayout>
            }
          />
          <Route
            path="/transport/adddriver"
            element={
              <AdminLayout>
                <AddDriver />
              </AdminLayout>
            }
          />
          <Route
            path="/transport/drivers"
            element={
              <AdminLayout>
                <Drivers />
              </AdminLayout>
            }
          />

          <Route
            path="/admin-studymodule"
            element={
              <AdminLayout>
                <StudyModuleUpload />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-Studentdocuments"
            element={
              <AdminLayout>
                <StudentDocument />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-Studentdocumentview"
            element={
              <AdminLayout>
                <StudentDocumentView />
              </AdminLayout>
            }
          />

          <Route
            path="/admin-calendar"
            element={
              <AdminLayout>
                <AdminCalendarPanel />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-Studentfee"
            element={
              <AdminLayout>
                <StudentFeeDetails />
              </AdminLayout>
            }
          />
          <Route
            path="/admin-notification"
            element={
              <AdminLayout>
                <NotificationPage />
              </AdminLayout>
            }
          />
          {/*  principal & Pages (Uses Aminsidebar) */}
          <Route
            path="/principal-dashboard"
            element={
              <PrincipalLayout>
                <PrincipalDashboard />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-academics"
            element={
              <PrincipalLayout>
                <PrincipalAcademics />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-teacherinfo"
            element={
              <PrincipalLayout>
                <TeacherInfo />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal/announcement"
            element={
              <PrincipalLayout>
                <AnnouncementPage />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-studentinfo"
            element={
              <PrincipalLayout>
                <StudentInfo />
              </PrincipalLayout>
            }
          />
          <Route
            path="/profile/principalprofile"
            element={
              <PrincipalLayout>
                <PrincipalProfile />
              </PrincipalLayout>
            }
          />
          <Route
            path="/Principal-gallery"
            element={
              <PrincipalLayout>
                <PrincipalGallery />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-addnotification"
            element={
              <PrincipalLayout>
                <AddNotification />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-fees"
            element={
              <PrincipalLayout>
                <PrincipalFees />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-feedback"
            element={
              <PrincipalLayout>
                <PrincipalFeedback />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-announcement"
            element={
              <PrincipalLayout>
                <PrincipleAnnouncement />
              </PrincipalLayout>
            }
          />
          <Route
            path="/receipt"
            element={
              <PrincipalLayout>
                <ReceiptPage />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-subjects"
            element={
              <PrincipalLayout>
                <PrincipalSubject />
              </PrincipalLayout>
            }
          />

          <Route
            path="/principal-attendance"
            element={
              <PrincipalLayout>
                <AttendnaceReport />
              </PrincipalLayout>
            }
          />
          <Route
            path="/principal-notification"
            element={
              <PrincipalLayout>
                {" "}
                {/* ✅ FIXED */}
                <NotificationPage />
              </PrincipalLayout>
            }
          />

          <Route
            path="/principal-leave-panel"
            element={
              <PrincipalLayout>
                <PrincipalLeavePanel />
              </PrincipalLayout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
