import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaBars,
  FaRegAddressCard,
  FaCaretDown,
  FaAngleRight,
  FaAngleLeft,
} from "react-icons/fa6";
import { SlBadge } from "react-icons/sl";
import { RiCalendarEventFill } from "react-icons/ri";
import { LiaSchoolSolid, LiaPaletteSolid } from "react-icons/lia";
import { HiDocumentCurrencyRupee } from "react-icons/hi2";
import { TbFileSpreadsheet } from "react-icons/tb";
import { AiOutlineForm } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { MdOutlineAssignment } from "react-icons/md";
import { LiaCalendarCheck } from "react-icons/lia";
import { Link } from "react-router-dom";

// Animation for mobile sidebar
const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

// Styled components
const SidebarWrapper = styled.div`
  width: ${(props) => (props.expanded ? "250px" : "80px")};
  background-color: #002087;
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 9px;
  transition: width 0.3s ease;
  overflow-y: auto; /* Enable vertical scroll */
  position: relative;
  height: 86.5vh; /* Fixed height */
  z-index: 1000;

  @media (max-width: 1024px) {
   height: 92vh;

  }
  @media (max-width: 768px) {
    width: ${(props) => (props.expanded ? "200px" : "60px")};
    display: none;
  }

  /* Optional: Style the scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #001a5c;
  }
  &::-webkit-scrollbar-thumb {
    background: grey;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #ff0066;
  }
`;

const MobileBackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  color: white;
  cursor: pointer;
  border-bottom: 1px solid #001a5c;
  margin-bottom: 1rem;

  &:hover {
    color: #df0043;
    svg {
      color: #df0043;
    }
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute; // Changed from relative to fixed for better positioning
    top: 88px; // Changed from -110px to position properly
    left: 28px;
    padding: 15px; // Increased from 10px
    cursor: pointer;
    z-index: 1001;
    border-radius: 5px;

    // Increase the icon size in the JSX component
    svg {
      width: 40px; // Increase icon size
      height: 40px; // Increase icon size
    }
  }
  
  @media (max-width: 480px) {
    display: block;
    position: absolute; // Changed from relative to fixed for better positioning
    top: 85px; // Changed from -110px to position properly
    left: 8px;
  }
  @media (max-width: 320px) {
    display: block;
    position: absolute; // Changed from relative to fixed for better positioning
    top: 98px; // Changed from -110px to position properly
    left: 8px;
  }
`;

const MobileDropdown = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  top: 0; // Changed from 160px to make full height
  left: 0;
  background: #002087;
  width: 200px;
  height: 100vh; // Full viewport height
  padding: 20px;
  z-index: 1002;
  animation: ${(props) => (props.open ? slideIn : slideOut)} 0.3s ease forwards;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  overflow-y: auto; // Enable scrolling

  // Custom scrollbar styling
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #001a5c;
  }

  &::-webkit-scrollbar-thumb {
    background: grey;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ff0066;
  }

  @media (max-width: 480px) {
    width: 180px;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; // Always left-aligned in mobile
  padding: 1rem;
  gap: 1rem;
  white-space: nowrap;
  min-height: 100%; // Ensure content fills available space
  overflow: visible !important; // Override any hidden overflow
  font-family: "Poppins", sans-serif;

  // Mobile-specific adjustments
  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.8rem;
  }
`;

const MenuToggle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 43px;
  height: 48px;
  background-color: #002366;
  padding: 3px;
  margin: 10px auto;
  cursor: pointer;
`;

const SidebarItem = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  cursor: pointer;
  width: 100%;
  gap: ${(props) => (props.expanded ? "10px" : "0")};
  padding: 0.3rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #001a5c;
    color: #df0043;
  }
`;

const Icon = styled.div`
  font-size: 1.5rem;
  min-width: 30px;

  &:hover {
    color: #df0043;
  }
`;

const Label = styled.span`
  font-size: 1rem;
  visibility: ${(props) => (props.expanded ? "visible" : "hidden")};
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.expanded ? "1" : "0")};
`;

const DropdownIcon = styled(FaCaretDown)`
  margin-left: auto;
  font-size: 1.2rem;
  transition: transform 0.3s ease, color 0.3s ease;
  transform: ${(props) => (props.open ? "rotate(90deg)" : "rotate(0)")};
  color: ${(props) => (props.open ? "#df0043" : "red")};
`;

const Dropdown = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  margin-left: ${(props) => (props.expanded ? "2rem" : "0")};
  transition: all 0.3s ease;
`;

const ChildArrow = styled(FaAngleRight)`
  font-size: 14px;
  color: #fff;
  margin-right: 8px;
  transition: transform 0.3s ease;

  ${(props) =>
    props.active &&
    `
    transform: rotate(90deg);
    color: white;
  `}
`;

const MobileBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ open }) => (open ? "block" : "none")};
`;

const PrincipalSidebar = () => {
  const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState({ profile: false, school: false });

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setExpanded(false);
      setMobileOpen(false);
    } else {
      setExpanded(true);
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth > 768) {
      setExpanded(!expanded);
    } else {
      setMobileOpen(!mobileOpen);
      setExpanded(false);
    }
  };

  const toggleDropdown = (menu) => {
    setDropdown((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <>
      <MobileBackdrop open={mobileOpen} onClick={() => setMobileOpen(false)} />
      <MobileMenu onClick={() => setMobileOpen(!mobileOpen)}>
        <FaBars size={40} color="red" />
      </MobileMenu>

      {mobileOpen && (
        <MobileDropdown open={mobileOpen}>
          <MobileBackButton onClick={() => setMobileOpen(false)}>
            <FaAngleLeft size={20} color="#df0043" />
            <span>Back</span>
          </MobileBackButton>
          <SidebarContent expanded={true}>
            <SidebarItem
              to="/teacher-dashboard"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <LiaPaletteSolid />
              </Icon>
              <Label expanded={true}>Dashboard</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-academics"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <TbFileSpreadsheet />
              </Icon>
              <Label expanded={true}>Academics</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-studentinfo"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <MdOutlineAssignment />
              </Icon>
              <Label expanded={true}>Student Data</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-teacherinfo"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <MdOutlineAssignment />
              </Icon>
              <Label expanded={true}>Teacher Data</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-addnotification"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <FiImage />
              </Icon>
              <Label expanded={true}>Notification</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-assignedsubjects"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <FiImage />
              </Icon>
              <Label expanded={true}>Subjects</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-fees"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <LiaCalendarCheck />
              </Icon>
              <Label expanded={true}>Fees</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-feedback"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <AiOutlineForm />
              </Icon>
              <Label expanded={true}>Feedback</Label>
            </SidebarItem>

            <SidebarItem
              to="/principal-announcement"
              onClick={() => setMobileOpen(false)}
            >
              <Icon>
                <HiDocumentCurrencyRupee />
              </Icon>
              <Label expanded={true}>Announcement</Label>
            </SidebarItem>
          </SidebarContent>
        </MobileDropdown>
      )}

      {!mobileOpen && (
        <SidebarWrapper expanded={expanded}>
          <MenuToggle onClick={toggleSidebar}>
            <FaBars size={24} color="red" />
          </MenuToggle>

          <SidebarContent expanded={expanded}>
            <SidebarItem to="/principal-dashboard" expanded={expanded}>
              <Icon>
                <LiaPaletteSolid />
              </Icon>
              <Label expanded={expanded}>Dashboard</Label>
            </SidebarItem>

            <SidebarItem to="/principal-academics" expanded={expanded}>
              <Icon>
                <MdOutlineAssignment />
              </Icon>
              <Label expanded={expanded}>Academics</Label>
            </SidebarItem>

            <SidebarItem to="/principal-teacherinfo" expanded={expanded}>
              <Icon>
                <TbFileSpreadsheet />
              </Icon>
              <Label expanded={expanded}>Teachers Data</Label>
            </SidebarItem>

            {/* My School Dropdown */}
            <SidebarItem
              as="div"
              expanded={expanded}
              onClick={() => toggleDropdown("school")}
            >
              <SidebarItem to="/principal-studentinfo" expanded={expanded}>
                <Icon>
                  <LiaSchoolSolid />
                </Icon>
                <Label expanded={expanded}>Student Data</Label>
              </SidebarItem>
            </SidebarItem>

            <SidebarItem to="/Principal-gallery" expanded={expanded}>
              <Icon>
                <AiOutlineForm />
              </Icon>
              <Label expanded={expanded}>Gallery</Label>
            </SidebarItem>

            <SidebarItem to="/principal-addnotification" expanded={expanded}>
              <Icon>
                <FiImage />
              </Icon>
              <Label expanded={expanded}>Notification</Label>
            </SidebarItem>

            <SidebarItem to="/principal-subjects" expanded={expanded}>
              <Icon>
                <FiImage />
              </Icon>
              <Label expanded={expanded}>Subjects</Label>
            </SidebarItem>

            <SidebarItem to="/principal-fees" expanded={expanded}>
              <Icon>
                <HiDocumentCurrencyRupee />
              </Icon>
              <Label expanded={expanded}>Fees</Label>
            </SidebarItem>

            <SidebarItem to="/principal-feedback" expanded={expanded}>
              <Icon>
                <HiDocumentCurrencyRupee />
              </Icon>
              <Label expanded={expanded}>Feedback</Label>
            </SidebarItem>

            <SidebarItem to="/principal-announcement" expanded={expanded}>
              <Icon>
                <HiDocumentCurrencyRupee />
              </Icon>
              <Label expanded={expanded}>Announcement</Label>
            </SidebarItem>
          </SidebarContent>
        </SidebarWrapper>
      )}
    </>
  );
};

export default PrincipalSidebar;
