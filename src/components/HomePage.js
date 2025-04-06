import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in (has a token)
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // If token exists, redirect to the dashboard
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/chatbot/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data;
        sessionStorage.setItem("token", token); // Store token
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg = err.response?.data || "Login failed";
      setError("Login failed: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg mb-5">
            <div className="card-body p-4">
              <h1 className="text-center mb-4">Welcome to the Chatbot</h1>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username" // Added autocomplete attribute
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
                    autoComplete="current-password" // Added autocomplete attribute
                  />
                </div>

                {error && <div className="text-danger mt-3">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-primary mt-4 w-100"
                  disabled={loading} // Disable the button during loading
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <div className="text-center mt-3">
                <p>Don't have an account?</p>
                <button
                  onClick={() => navigate("/register")}
                  className="btn btn-outline-secondary"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
