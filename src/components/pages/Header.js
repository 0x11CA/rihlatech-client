import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styling/Header.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(""); // User's name
  const [profileImage, setProfileImage] = useState(""); // User's profile image
  const [role, setRole] = useState(""); // User's role
  const navigate = useNavigate();

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const roleFromStorage = localStorage.getItem("role"); // Get role from localStorage
        if (!token) throw new Error("Unauthorized");

        const response = await axios.get("https://rihlatech-server.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserName(response.data.name.split(" ")[0]); // Extract first name
        setProfileImage(response.data.profileImage); // Set profile image
        setRole(roleFromStorage);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear(); // Clear token and role from localStorage
    navigate("/login"); // Redirect to login
  };

  return (
    <Navbar dark expand="md" className="navbar-dark homepage-navbar">
      {/* Left Section: Brand */}
      <div className="navbar-brand-container">
        <span className="navbar-brand-text">RihlaTech | رحلتك</span>
      </div>

      {/* Center Section: Navbar Links */}
      <Nav className="center-navbar-links" navbar>
        {role === "admin" ? (
          <>
            <NavItem>
              <NavLink href="/adminmain">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/leaderboard">Leaderboard</NavLink>
            </NavItem>
          </>
        ) : (
          <>
            <NavItem>
              <NavLink href="/home">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/courses">Courses</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/my-learning/questions">My Learning</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/leaderboard">Leaderboard</NavLink>
            </NavItem>
          </>
        )}
      </Nav>

      {/* Right Section: User Info */}
      <Dropdown isOpen={dropdownOpen} toggle={toggle} className="user-dropdown-container">
        <DropdownToggle className="user-dropdown" tag="div">
        <img
  src={
    profileImage ||
    "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png"
  }
  alt="User Avatar"
  className="rounded-circle user-avatar"
/>

          <span className="user-info">
            Hi, {userName || "User"} {/* Display fetched name */}
            <br />
            <small>{role === "admin" ? "Admin" : "User"}</small>
          </span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => navigate("/profile")}>Profile</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Navbar>
  );
};

export default Header;
