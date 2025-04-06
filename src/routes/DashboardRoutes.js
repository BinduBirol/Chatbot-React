import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap"; // Optional loading spinner
import Dashboard from "../components/Dashboards/Dashboard"; // Correct path to your Dashboard component

const DashboardRoutes = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check for authentication
    const token = sessionStorage.getItem("token");

    if (!token) {
      // If no token, set as not authenticated and redirect to login
      setIsAuthenticated(false);
      navigate("/", {
        state: { error: "You need to be logged in to view this page." },
      });
    } else {
      // If token exists, user is authenticated
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // If still checking authentication status, show loading spinner
  if (isAuthenticated === null) {
    return <Spinner animation="border" variant="primary" />;
  }

  // If authenticated, show the dashboard
  return isAuthenticated ? <Dashboard /> : null;
};

export default DashboardRoutes;
