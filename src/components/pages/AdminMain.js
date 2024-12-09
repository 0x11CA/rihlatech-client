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

const AdminMain = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState(""); // State to hold admin's name
  const navigate = useNavigate();

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  // Memoize handleLogout
  const handleLogout = useCallback(() => {
    localStorage.clear(); // Clear token and role from localStorage
    navigate("/login"); // Redirect to login
  }, [navigate]);

  // Fetch admin name from the database
  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("https://rihlatech-server.onrender.com/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token for authentication
          },
        });
        setAdminName(response.data.name.split(" ")[0]); // Extract first name
      } catch (error) {
        console.error("Error fetching admin name:", error);
        handleLogout(); // Log out if token is invalid or expired
      }
    };

    fetchAdminName();
  }, [handleLogout]); // Add handleLogout to the dependency array

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="homepage-container">
      {/* Main Content */}
      <div className="homepage-content">
        <h1 className="homepage-title">Welcome, {adminName || "Admin"}!</h1>
        <p className="homepage-description">
          Manage your platform, monitor progress, and engage with your community.
          Navigate to the Dashboard to get insights or explore the Leaderboard for top performers.
        </p>
        <div className="homepage-buttons">
          <Button
            color="warning"
            className="homepage-btn"
            onClick={() => handleNavigation("/dashboard")}
          >
            Go to Dashboard
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

export default AdminMain;
