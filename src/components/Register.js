import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const registerData = { email, password };

    try {
      const response = await axios.post('/chatbot/api/auth/register', registerData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        // After successful registration, log the user in
        const loginResponse = await axios.post('/chatbot/api/auth/login', {
          email,
          password,
        });

        if (loginResponse.status === 200) {
          // Step 1: Store only the JWT token in localStorage
          localStorage.setItem('token', response.data);

          // Step 2: Redirect to dashboard
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Show the error message from Spring Boot if available
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Failed to register. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-danger mt-3">{error}</div>}
        <button type="submit" className="btn btn-primary mt-4">Register</button>
      </form>
    </div>
  );
};

export default Register;
