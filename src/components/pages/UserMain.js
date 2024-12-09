import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styling/HomePage.css";

const UserMain = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State to hold user's name
  const navigate = useNavigate();

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  // Memoize handleLogout
  const handleLogout = useCallback(() => {
    localStorage.clear(); // Clear token and role from localStorage
    navigate("/login"); // Redirect to login
  }, [navigate]);

  // Fetch user name from the database
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("https://rihlatech-server.onrender.com/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        });
        setUserName(response.data.name.split(" ")[0]); // Extract first name
      } catch (error) {
        console.error("Error fetching user name:", error);
        handleLogout(); // Log out if token is invalid or expired
      }
    };

    fetchUserName();
  }, [handleLogout]); // Add handleLogout to the dependency array

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="homepage-container">
      {/* Main Content */}
      <div className="homepage-content">
        <h1 className="homepage-title">Welcome, {userName || "User"}!</h1>
        <p className="homepage-description">
          Explore courses, track your progress, and join the community of learners.
          Check out your courses or view the leaderboard to see where you rank!
        </p>
        <div className="homepage-buttons">
          <Button
            color="warning"
            className="homepage-btn"
            onClick={() => handleNavigation("/my-courses")}
          >
            My Courses
          </Button>
          <Button
            color="light"
            className="homepage-btn-secondary"
            onClick={() => handleNavigation("/leaderboard")}
          >
            View Leaderboard →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserMain;
