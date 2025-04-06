import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Dashboard = () => {
  const [message, setMessage] = useState(""); // User's input message
  const [loading, setLoading] = useState(false); // Loading state for sending messages
  const [error, setError] = useState(""); // State for error message
  const [contacts, setContacts] = useState([]); // Contact list
  const [selectedContact, setSelectedContact] = useState(null); // Currently selected contact
  const [chatHistory, setChatHistory] = useState([]); // Chat history of the selected contact

  const chatHistoryRef = useRef(null); // Reference for scrolling to last message
  const endOfChatRef = useRef(null); // Reference to scroll to the bottom

  // Function to format date and time to "19 Apr 11:02 AM"
  const getFormattedDateTime = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${day < 10 ? `0${day}` : day} ${month} ${hours % 12 || 12}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    return formattedTime;
  };

  // Fetch the contact list from an API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/chatbot/api/chat/titles", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setContacts(response.data);
      } catch (err) {
        console.error("Failed to load contacts:", err);
        setError("Failed to load contacts");
      }
    };
    fetchContacts();
  }, []);

  // Fetch chat history for the selected contact
  useEffect(() => {
    if (selectedContact) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(`/chatbot/api/chat/history/${selectedContact.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          });
          setChatHistory(response.data); // Update chat history with the fetched data
        } catch (err) {
          console.error("Failed to fetch chat history:", err);
          setError("Failed to fetch chat history");
        }
      };
      fetchChatHistory();
    }
  }, [selectedContact]);

  // Send the message to backend and receive response
  const handleSendMessage = async () => {
    if (!message || !selectedContact) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/chatbot/api/chat/send", message, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      // Add the new message and response to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "You", message, time: getFormattedDateTime() },
        { sender: selectedContact.name, message: response.data, time: getFormattedDateTime() },
      ]);
      setMessage(""); // Clear the input field
    } catch (error) {
      const errorMsg = error.response?.data || error.message || "Something went wrong!";
      setError(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom whenever chat history is updated
  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Handle logout by clearing sessionStorage and redirecting to login page
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mb-5">
        {/* Contact List */}
        <div className="col-4 ">
          <div className="card shadow-sm h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Contacts</h5>
              <button onClick={handleLogout} className="btn btn-sm btn-danger">Logout</button>
            </div>
            <div  style={{ height: "80vh", overflowY: "auto" }}>
              <div className="list-group list-group-flush">
                {contacts.map((contact) => (
                  <a
                    key={contact.id}
                    href="#"
                    className={`list-group-item list-group-item-action ${selectedContact?.id === contact.id ? "active" : ""}`}
                    onClick={() => setSelectedContact(contact)}
                    style={{
                      borderLeft: `4px solid ${selectedContact?.id === contact.id ? "#007bff" : "#ccc"}`,
                    }}
                  >
                    <div className="fw-bold">{contact.name}</div>
                    <div className="text-muted text-truncate" style={{ fontSize: "0.9rem" }}>
                      {contact.lastMessage}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-8">
          <div className="card shadow-lg p-4 h-100 d-flex flex-column">
            {error && <div className="alert alert-danger">{error}</div>}

            {selectedContact && (
              <div className="fw-bold mb-3 fs-5">
                Chat with {selectedContact.name}
              </div>
            )}

            <div
              className="chat-history mb-3 p-3 border rounded"
              style={{
                overflowY: "auto",
                maxHeight: "calc(100vh - 200px)",
                flexGrow: 1, // Allows it to take up available space
              }}
            >
              {chatHistory.length === 0 ? (
                <div className="text-center text-muted" style={{ fontStyle: "italic" }}>
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <>
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className="mb-2"
                      style={{
                        padding: "8px 10px",
                        borderRadius: "8px",
                        backgroundColor: chat.sender === "You" ? "#d1f1d1" : "#f1f1f1",
                        borderLeft: `4px solid ${chat.sender === "You" ? "#007bff" : "#28a745"}`,
                        textAlign: chat.sender === "You" ? "right" : "left",
                      }}
                    >
                      <div className="fw-bold">{chat.sender}</div>
                      <div>{chat.message}</div>
                      <div style={{ fontSize: "0.8rem", color: "#888" }}>
                        {chat.time}
                      </div>
                    </div>
                  ))}
                  {/* Scroll anchor */}
                  <div ref={endOfChatRef} />
                </>
              )}
            </div>

            {/* Chat Input */}
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
