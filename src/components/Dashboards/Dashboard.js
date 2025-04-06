import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Widget, addResponseMessage, addUserMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css"; // Import chatbot styles
import { Button, Container, Row, Col } from "react-bootstrap"; // Bootstrap components

const ChatBot = () => {
  // Handling chat messages
  const handleNewUserMessage = (newMessage) => {
    // Simulating a bot response after the user's message
    addResponseMessage(`You said: ${newMessage}`);
  };

  return (
    <div className="mt-4">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Chatbot"
        subtitle="How can I help you?"
      />
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from sessionStorage
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/", {
        state: { error: "Invalid session. Please login again." },
      });
      return;
    }

    // Validate token and fetch user details
    axios
      .get("/chatbot/api/auth/details", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        setError("Session expired or invalid token. Please login again.");
        sessionStorage.removeItem("token"); // Clear the token
        navigate("/", {
          state: { error: "Session expired or invalid token. Please login again." },
        });
      });
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Dashboard</h2>

      {/* Display error if any */}
      {error && <div className="text-danger mt-3">{error}</div>}

      {user ? (
        <div className="mt-4">
          <Row>
            <Col md={6}>
              <h4>Welcome, {user.email}!</h4>
              <p>Your account details:</p>
              <ul>
                <li>Email: {user.email}</li>
                {/* Add other fields from UserDto if needed */}
              </ul>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Col>

            <Col md={6}>
              {/* Chatbot component */}
              <ChatBot />
            </Col>
          </Row>
        </div>
      ) : (
        !error && <div className="text-center mt-4">Loading your info...</div>
      )}
    </Container>
  );
};

export default Dashboard;
