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
              <NavLink onClick={() => navigate("/adminmain")} style={{ cursor: "pointer" }}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => navigate("/leaderboard")} style={{ cursor: "pointer" }}>
                Leaderboard
              </NavLink>
            </NavItem>
          </>
        ) : (
          <>
            <NavItem>
              <NavLink onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => navigate("/courses")} style={{ cursor: "pointer" }}>
                Courses
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => navigate("/my-learning/questions")} style={{ cursor: "pointer" }}>
                My Learning
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => navigate("/leaderboard")} style={{ cursor: "pointer" }}>
                Leaderboard
              </NavLink>
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
