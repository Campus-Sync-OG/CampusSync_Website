// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import logo from "../assets/images/logo.png";
import defaultProfile from "../assets/images/profile.png";
import defaultSlogo from "../assets/images/slogo.png";
import { FaBell, FaCaretDown, FaEllipsisV } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import { TbMessageChatbot } from "react-icons/tb";
import { FaBullhorn } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationPopupPage from "../components/notificationpopup"; // <-- ensure file name matches exactly

// API helpers
import { getUnreadCount, markAllRead } from "../api/ClientApi";

// socket.io-client (install with `npm i socket.io-client` if you want realtime)
import { io } from "socket.io-client";

/* ================= Styles (kept exactly as you had) ================= */
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: nowrap;
  // position: sticky;
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
  cursor: pointer;

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
    margin-right: 7px;
    width: 50px;
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
    right: 50px;
     h1 {
    font-size: 10px;
    margin: 0 10px 0 0;
    font-weight: bold;
    color: #000;
  }
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
    width: 100%;
    justify-content: space-between;
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
  position: relative; /* needed for badge positioning */

  @media (max-width: 768px) {
    position: relative;
    left: 230px;
    top: 3px;
  }
  @media (max-width: 480px) {
    position: relative;
    left: 83px;
    top: 3px;
  }
  @media (max-width: 420px) {
    position: relative;
    left: 78px;
    top: 3px;
  }
  @media (max-width: 320px) {
    position: relative;
    left: 60px;
    top: 3px;
    height: 35px;
    width: 35px;
  }
`;

const NotificationButtonIcon = styled(FaBell)`
  font-size: 20px;
  color: rgb(233, 30, 30);
  @media (max-width: 320px) {
     font-size: 17px;
  }
`;

/* small badge/dot on the bell */
const BellBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(90deg,#9A34FF,#FF7A29);
  color: #fff;
  padding: 3px 7px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  min-width: 22px;
  text-align: center;
  box-shadow: 0 6px 14px rgba(154,52,255,0.12);
`;

const BellDot = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: linear-gradient(90deg,#9A34FF,#FF7A29);
  box-shadow: 0 6px 14px rgba(154,52,255,0.12);
`;

const IconButton = styled.button`
  background-color: #4a90e2;
  border: none;
  padding: 10px 14px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;

  &:hover {
    background-color: #357ab8;
  }

  svg {
    color: white;
    width: 24px;
    height: 24px;
  }
  @media (max-width: 768px) {
    position: relative;
    left: 47%;
    top: 5px;
    svg {
      color: white;
      width: 20px;
      height: 20px;
    }
  }
  @media (max-width: 480px) {
    position: relative;
    left: 30%;
    top: 5px;
    svg {
      color: white;
      width: 20px;
      height: 20px;
    }
  }
  @media (max-width: 320px) {
    position: relative;
    left: 25%;
    top: 5px;
    padding: 5px 10px;
  }
`;

const MeesageIcon = styled(TbMessageChatbot)`
  font-size: 20px;
  color: rgb(233, 30, 30);
`;
const SpeakerIcon = styled(FaBullhorn)`
  font-size: 18px;
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
    left: 107px;
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
  @media (max-width: 380px) {
    top: 2px;
    position: relative;
    left: 33px;
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
  font-size: 30px;
  color: red;

  @media (max-width: 768px) {
    display: block;
    position: relative;
    top: 8px;
    right: 10px;
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
    font-size: 23px;
  }
`;

const SpeakerWrapper = styled.div`
  background-color: #f5f5f5; /* off-white background */
  padding: 10px 14px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e0e0e0; /* subtle hover effect */
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    position: relative;
    left: 62%;
    top: 5px;
  }
  @media (max-width: 460px) {
    position: relative;
    left: 38%;
    top: 5px;
  }
  @media (max-width: 320px) {
    position: relative;
    left: 30%;
    top: 5px;
    padding: 5px 10px;
     svg {
    width: 18px;
    height: 24px;
  }
  }
`;

/* ================= Header component ================= */
const Header = ({
  schoolName = "LocateUs International School",
  location = "Bangalore, Karnataka",
  profilePic = defaultProfile,
  schoolLogo = defaultSlogo,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const back_location = useLocation();
  const [role, setRole] = useState(null);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.unique_id;

  // SOCKET URL supporting both Vite and CRA env styles; fallback to window.location.origin
  const SOCKET_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SOCKET_URL) ||
  window.location.origin;

  // Fetch unread count on mount
  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    (async () => {
      try {
        const resp = await getUnreadCount(userId); // expects { unread }
        if (mounted) setUnread(resp?.unread || 0);
      } catch (err) {
        console.warn("getUnreadCount failed", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Setup socket (optional) to receive realtime new_notification events
  useEffect(() => {
    if (!userId) return;
    try {
      socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

      socketRef.current.on("connect", () => {
        if (userId) socketRef.current.emit("register", userId);
      });

      socketRef.current.on("new_notification", (payload) => {
        if (typeof payload?.unread === "number") {
          setUnread(payload.unread);
        } else {
          setUnread((c) => c + 1);
        }
      });

      socketRef.current.on("connect_error", (err) => {
        console.warn("socket connect_error", err);
      });
    } catch (e) {
      console.warn("socket init failed", e);
    }

    return () => {
      try {
        socketRef.current && socketRef.current.disconnect();
      } catch (e) {}
    };
  }, [userId, SOCKET_URL]);

  // mark all read when user opens popup
  const handleBellClick = async () => {
    togglePopup();
    // optimistic clear
    setUnread(0);
    try {
      if (userId) await markAllRead(userId);
    } catch (err) {
      console.warn("markAllRead failed", err);
    }
  };

  const handleViewAllNotifications = () => {
    const Role = localStorage.getItem("role")?.trim().toLowerCase();
    if (Role === "teacher") {
      navigate("/teacher-notification");
    } else {
      navigate("/notifications");
    }
  };

  const redirectToProfile = (userRole) => {
    switch (userRole) {
      case "student":
        navigate("/profile/my-profile");
        break;
      case "teacher":
        navigate("/profile/teacher-profile");
        break;
      case "principal":
        navigate("/profile/principalprofile");
        break;
      default:
        console.warn("Unknown role, redirecting to login");
        navigate("/login");
    }
  };

  const handleChatbotClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const rawRole = user?.role || "";
    const role = rawRole.trim().toLowerCase();
    const path = role === "teacher" ? "/teacher-chatbot" : "/chatbot";
    if (back_location.pathname !== path) navigate(path);
  };

  // profile click
  const handleProfileClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.role?.toLowerCase();
    if (!userRole) {
      console.warn("Role not set, redirecting to login");
      navigate("/login");
      return;
    }
    redirectToProfile(userRole);
  };

  // close popup on route change
  useEffect(() => {
    setIsPopupVisible(false);
  }, [back_location]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole?.toLowerCase());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".profile-section") &&
        !event.target.closest(".menu-button")
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <HeaderContainer>
        <LogoSection
          onClick={() => {
            const user = JSON.parse(localStorage.getItem("user"));
            const userRole = user?.role?.toLowerCase();
            const userState = { user };
            if (userRole === "student")
              navigate("/dashboard", { state: userState });
            else if (userRole === "teacher")
              navigate("/teacher-dashboard", { state: userState });
            else if (userRole === "principal")
              navigate("/principal-dashboard", { state: userState });
            else if (userRole === "admin")
              navigate("/admin-dashboard", { state: userState });
            else navigate("/login");
          }}
        >
          <Logo src={logo} alt="Campus Sync Logo" />
          <Divider />
          <SchoolDetails onClick={handleProfileClick}>
            <SlogoImage src={schoolLogo} alt="School Logo" />
            <div>
              <h1>{schoolName}</h1>
              <p>{location}</p>
            </div>
          </SchoolDetails>
        </LogoSection>

        <HeaderRight>
          <SpeakerWrapper
            onClick={() => {
              const user = JSON.parse(localStorage.getItem("user"));
              const role = user?.role?.toLowerCase();
              if (role === "teacher") navigate("/teacher/announcement");
              else if (role === "principal") navigate("/principal/announcement");
              else if (role === "admin") navigate("/admin/announcement");
              else navigate("/announcement");
            }}
          >
            <SpeakerIcon />
          </SpeakerWrapper>

          <IconButton>
            <MeesageIcon
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user"));
                const role = user?.role?.trim().toLowerCase();
                if (role === "teacher") navigate("/teacher-chatbot");
                else if (role === "student") navigate("/chatbot");
                else if (role === "principal" || role === "admin")
                  alert("Chatbot is not available for Principal and Admin users.");
                else alert("Unknown role. Access denied.");
              }}
            />
          </IconButton>

          {/* Notification bell with unread badge (inline) */}
          <NotificationButton onClick={handleBellClick}>
            <NotificationButtonIcon />
            {unread > 0 ? (
              <BellBadge>{unread > 99 ? "99+" : unread}</BellBadge>
            ) : (
              <BellDot />
            )}
          </NotificationButton>

          <DividerRight />

          <ProfileSection onClick={toggleDropdown} className="profile-section">
            <ProfilePic src={profilePic} alt="Profile" />
            <DropdownIcon />
          </ProfileSection>

          <MenuButton onClick={toggleDropdown} className="menu-button">
            <FaEllipsisV />
          </MenuButton>

          <DropdownMenu ref={dropdownRef} visible={isDropdownVisible}>
            <DropdownItem onClick={handleProfileClick}>
              <CgProfile />
              Profile
            </DropdownItem>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <DropdownItem>
                <TbLogout />
                Logout
              </DropdownItem>
            </Link>
          </DropdownMenu>
        </HeaderRight>
      </HeaderContainer>

      {/* existing popup usage — opens via isPopupVisible */}
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
