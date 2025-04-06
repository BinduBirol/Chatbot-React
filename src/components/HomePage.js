import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Capture redirected error from Dashboard
  useEffect(() => {
    if (location.state && location.state.error) {
      setError(location.state.error);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/chatbot/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data;
        sessionStorage.setItem('token', token); // Store token

        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data || 'Login failed';
      setError('Login failed: ' + errorMsg);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to the Chatbot</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4 w-100">
              Login
            </button>
          </form>
          <div className="text-center mt-3">
            <p>Don't have an account?</p>
            <button onClick={handleRegisterClick} className="btn btn-outline-secondary">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
