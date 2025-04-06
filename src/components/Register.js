import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Added loading state

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/chatbot/api/auth/register', {
        email,
        password,
      });

      if (response.status === 200) {
        // After successful registration, authenticate and get the JWT token (or other response)
        const loginResponse = await axios.post('/chatbot/api/auth/login', {
          email,
          password,
        });

        if (loginResponse.status === 200) {
          const token = loginResponse.data.token; // Assuming the token is returned here

          // Store the token in sessionStorage or localStorage
          sessionStorage.setItem('token', token);

          // Successfully authenticated, redirect to dashboard
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('Registration failed: ' + (err.response?.data || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 mb-5">
            <h2 className="text-center card-title">Register</h2>
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
              <button type="submit" className="btn btn-primary mt-4 w-100" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </button>
            </form>

            {/* Button to navigate to login page if already registered */}
            <div className="text-center mt-3">
              <p>Already registered?</p>
              <button
                onClick={() => navigate('/')} // Navigate to login page
                className="btn btn-outline-secondary"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
