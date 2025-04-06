import React, { useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import HomePage from '../components/HomePage';
import Register from '../components/Register';
import Dashboard from '../components/Dashboards/Dashboard';

const AuthRoutes = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated by looking for a token (you can modify this)
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      // Redirect to HomePage if not authenticated
      navigate('/', { state: { error: 'You need to be logged in to view this page.' } });
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Route */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default AuthRoutes;
