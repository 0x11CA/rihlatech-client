import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/pages/Header";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import ForgotPassword from "./components/pages/ForgotPassword";
import HomePage from "./components/pages/UserMain";
import AdminMain from "./components/pages/AdminMain";
import Profile from "./components/pages/Profile";
import Leaderboard from "./components/pages/Leaderboard";
import ErrorPage from "./components/pages/ErrorPage";
import Dashboard from "./components/pages/Dashboard";
import Challenges from "./components/pages/Challenges";
import UserCQ from "./components/pages/UserCQ";
import ChallengeDetails from "./components/pages/ChallengeDetails";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  // Layout to include the shared Header for private routes
  const Layout = ({ children }) => (
    <div>
      <Header /> {/* Shared header */}
      <div className="content">{children}</div>
    </div>
  );

  // Utility function to fetch user role
  const getUserRole = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // Retrieve role from localStorage
    return token ? role : null;
  };

  // Route handler for the root path "/"
  const RootRoute = () => {
    const role = getUserRole();
    if (role === "admin") {
      return <Navigate to="/adminmain" />;
    } else if (role === "user") {
      return <Navigate to="/home" />;
    } else {
      return <Navigate to="/login" />;
    }
  };

  // Private Route for role-based routing
  const PrivateRoute = ({ children, allowedRoles }) => {
    const role = getUserRole();
    if (!role) {
      return <Navigate to="/login" />; // Redirect if no role is found
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
      return role === "admin" ? <Navigate to="/adminmain" /> : <Navigate to="/home" />;
    }
    return children;
  };

  // Public Route for unauthenticated users
  const PublicRoute = ({ children }) => {
    const role = getUserRole();
    if (role) {
      return role === "admin" ? <Navigate to="/adminmain" /> : <Navigate to="/home" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Root Route */}
        <Route path="/" element={<RootRoute />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Private Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Layout>
                <HomePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/challenges"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Layout>
                <Challenges />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-learning/questions"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Layout>
                <UserCQ />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-learning/questions/:id"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Layout>
                <ChallengeDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/adminmain"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Layout>
                <AdminMain />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["admin", "user"]}>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute allowedRoles={["admin", "user"]}>
              <Layout>
                <Leaderboard />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
