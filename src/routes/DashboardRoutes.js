import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboards/Dashboard";
import { Spinner } from "react-bootstrap"; // Optional loading spinner

const DashboardRoutes = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check for authentication
    const token = sessionStorage.getItem("token");

    if (!token) {
      // If no token, set as not authenticated and redirect to login
      setIsAuthenticated(false);
    } else {
      // If token exists, user is authenticated
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // If still checking authentication status, show a loading spinner
  if (isAuthenticated === null) {
    return <Spinner animation="border" variant="primary" />;
  }

  // If not authenticated, show error message and redirect to login
  if (isAuthenticated === false) {
    navigate("/", {
      state: { error: "You need to be logged in to view this page." },
    });
    return null;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default DashboardRoutes;
