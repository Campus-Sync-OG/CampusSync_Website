import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/images/logo.png";
import defaultProfile from "../assets/images/profile.png";
import defaultSlogo from "../assets/images/Slogo.png";
import { FaBell, FaCaretDown, FaEllipsisV } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiSettings } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationPopupPage from "./notificationpopup";

// styled-components (unchanged)
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: nowrap;
  position: sticky;
  font-family: "Roboto", sans-serif;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 10px 15px;
  }
`;

const LogoSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: flex-end;
    width: 100%;
    right: 270px;
  }
  @media (max-width: 480px) {
    justify-content: flex-end;
    width: 100%;
    left: 30px;
  }
`;

const Logo = styled.img`
  width: 80px;
  margin-right: 18px;
  filter: brightness(0) saturate(100%) invert(17%) sepia(86%) saturate(7470%)
    hue-rotate(345deg) brightness(99%) contrast(104%);

  @media (max-width: 768px) {
    position: relative;
    right: 15px;
  }
  @media (max-width: 480px) {
    position: relative;
    right: 45px;
  }
  @media (max-width: 380px) {
    position: relative;
    right: 45px;
  }
  @media (max-width: 320px) {
    margin-right: 57px;
  }
`;

const Divider = styled.div`
  height: 40px;
  width: 2px;
  background-color: #e91e63;
  margin: 0 15px;

  @media (max-width: 480px) {
    position: relative;
    right: 60px;
  }
  @media (max-width: 380px) {
    position: relative;
    right: 60px;
  }
`;

const SchoolDetails = styled.div`
  display: flex;
  align-items: center;

  h1 {
    font-size: 18px;
    margin: 0 10px 0 0;
    font-weight: bold;
    color: #000;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: gray;
    font-style: italic;
  }

  @media (max-width: 480px) {
    position: relative;
    right: 40px;
    h1 {
      font-size: 16px;
    }

    p {
      font-size: 12px;
    }
  }

  @media (max-width: 380px) {
    position: relative;
    right: 40px;
  }
  @media (max-width: 320px) {
    position: relative;
    right: 70px;
  }
`;

const SlogoImage = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 768px) {
    margin-top: 10px;
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchBarContainer = styled.div`
  position: relative;
  margin-right: 15px;

  input {
    padding: 8px 15px;
    padding-left: 35px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    width: 300px;
  }

  i {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: gray;
    font-size: 14px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 100px;
    left: 130px;
    top: 5px;
    input {
      width: 300px;
      height: 20px;
    }
  }

  @media (max-width: 480px) {
    width: 130px;
    left: 100px;
    top: 5px;
    input {
      width: 80px;
      height: 20px;
    }
  }

  @media (max-width: 380px) {
    width: 100px;
    left: 80px;
    top: 5px;
    input {
      width: 80px;
      height: 20px;
    }
  }
  @media (max-width: 320px) {
    width: 100px;
    left: 70px;
    top: 0px;
    input {
      width: 80px;
      height: 20px;
    }
  }
`;

const NotificationButton = styled.div`
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  @media (max-width: 768px) {
    position: relative;
    left: 233px;
    top: 3px;
  }
  @media (max-width: 480px) {
    position: relative;
    left: 83px;
    top: 3px;
  }
  @media (max-width: 380px) {
    position: relative;
    left: 83px;
    top: 3px;
  }
  @media (max-width: 320px) {
    position: relative;
    left: 79px;
    top: 0px;
  }
`;

const NotificationButtonIcon = styled(FaBell)`
  font-size: 20px;
  color: rgb(233, 30, 30);
`;

const DividerRight = styled.div`
  height: 30px;
  width: 2px;
  background-color: rgb(233, 30, 30);
  margin: 0 15px;
  @media (max-width: 768px) {
    top: 5px;
    position: relative;
    left: 76px;
  }
  @media (max-width: 480px) {
    top: 5px;
    position: relative;
    left: 36px;
  }
  @media (max-width: 380px) {
    top: 5px;
    position: relative;
    left: 36px;
  }
  @media (max-width: 320px) {
    top: 0px;
    position: relative;
    left: 42px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfilePic = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: 8px;
`;

const DropdownIcon = styled(FaCaretDown)`
  font-size: 14px;
  color: red;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  min-width: 150px;
  display: ${(props) => (props.visible ? "block" : "none")};
  z-index: 9999;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  color: #000;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #fff;

  &:hover {
    background-color: #f7f7f7;
  }

  svg {
    margin-right: 10px;
    color: #e91e63;
  }
`;

const MenuButton = styled.div`
  display: none;
  cursor: pointer;
  font-size: 24px;
  color: red;

  @media (max-width: 768px) {
    display: block;
    position: relative;
    top: 8px;
    right: 70px;
  }
  @media (max-width: 480px) {
    display: block;
    position: relative;
    top: 10px;
    right: 0px;
  }
  @media (max-width: 380px) {
    display: block;
    position: relative;
    top: 10px;
    right: 0px;
  }
  @media (max-width: 320px) {
    display: block;
    position: relative;
    top: 5px;
    left: 10px;
  }
`;

const Header = ({
  schoolName = "LocateUs International School",
  location = "Bangalore, Karnataka",
  profilePic = defaultProfile,
  schoolLogo = defaultSlogo,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const back_location = useLocation();

  const searchRoutes = {
    dashboard: "/dashboard",
    attendance: "/attendance",
    assignment: "/school/assignment",
    achievement: "/achievement",
    profile: "/profile/my-profile",
    parent: "/profile/parent-info",
    academics: "/academics",
    forms: "/forms-feedback",
    gallery: "/gallery",
    certificate: "/school/certificate-request",
    "teacher dashboard": "/teacher-dashboard",
    "teacher timetable": "/teacher-timetable",
    "teacher attendance": "/teacher-attendance",
    "teacher assignment": "/teacher-assignments",
    "teacher form": "/teacher-form",
    "teacher notification": "/teacher-notification",
    "student details": "/studentdetails",
  };

  const handleSearch = () => {
    const key = searchTerm.toLowerCase().trim();
    const role = localStorage.getItem("role");

    const studentRoutes = [
      "dashboard",
      "attendance",
      "assignment",
      "achievement",
      "profile",
      "parent",
      "academics",
      "forms",
      "gallery",
      "certificate",
    ];

    const teacherRoutes = [
      "teacher dashboard",
      "teacher timetable",
      "teacher attendance",
      "teacher assignment",
      "teacher form",
      "teacher notification",
      "student details",
    ];

    const isStudentRoute = role !== "teacher" && studentRoutes.includes(key);
    const isTeacherRoute = role === "teacher" && teacherRoutes.includes(key);

    if (isStudentRoute || isTeacherRoute) {
      const path = searchRoutes[key];
      navigate(path);
      setSearchTerm("");
    } else {
      alert("Page not found or access denied.");
    }
  };

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  const handleViewAllNotifications = () => {
    const role = localStorage.getItem("role");
    if (role === "teacher") navigate("/teacher-notification");
    else navigate("/notifications");
  };

  useEffect(() => {
    setIsPopupVisible(false);
  }, [back_location]);

  return (
    <>
      <HeaderContainer>
        <LogoSection>
          <Logo src={logo} alt="Campus Sync Logo" />
          <Divider />
          <SchoolDetails>
            <SlogoImage src={schoolLogo} alt="School Logo" />
            <div>
              <h1>{schoolName}</h1>
              <p>{location}</p>
            </div>
          </SchoolDetails>
        </LogoSection>

        <HeaderRight>
          <SearchBarContainer>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <i className="fas fa-search" onClick={handleSearch}></i>
          </SearchBarContainer>

          <NotificationButton onClick={togglePopup}>
            <NotificationButtonIcon />
          </NotificationButton>

          <DividerRight />

          <ProfileSection onClick={toggleDropdown}>
            <ProfilePic src={profilePic} alt="Profile" />
            <DropdownIcon />
          </ProfileSection>

          <MenuButton onClick={toggleDropdown}>
            <FaEllipsisV />
          </MenuButton>

          <DropdownMenu visible={isDropdownVisible}>
            <Link to="/profile/my-profile" style={{ textDecoration: "none" }}>
              <DropdownItem>
                <CgProfile />
                Profile
              </DropdownItem>
            </Link>
            <Link to="/settings" style={{ textDecoration: "none" }}>
              <DropdownItem>
                <FiSettings />
                Settings
              </DropdownItem>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <DropdownItem>
                <TbLogout />
                Logout
              </DropdownItem>
            </Link>
          </DropdownMenu>
        </HeaderRight>
      </HeaderContainer>

      {isPopupVisible && (
        <NotificationPopupPage
          onClose={togglePopup}
          onViewAll={handleViewAllNotifications}
        />
      )}
    </>
  );
};

export default Header;
