// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://chat-app-backend-tjcb.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const [view, setView] = useState(token ? "chat" : "login");

  // Auth states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Search users
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Chat
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ============= AUTH FUNCTIONS =============
  const register = async () => {
    if (!username || !password) return alert("Enter username and password");
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, password });
      alert("Registration successful! You can now log in.");
      setView("login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const login = async () => {
    if (!username || !password) return alert("Enter username and password");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setView("chat");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setView("login");
  };

  // ============= SEARCH USERS =============
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(`${API_URL}/api/auth/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data);
    } catch (err) {
      alert("Error searching users");
    }
  };

  // ============= CHAT FUNCTIONS =============
  const selectChatUser = async (chatUser) => {
  setSelectedUser(chatUser);
  setMessages([]);
  try {
    const res = await axios.get(`${API_URL}/api/messages/conversation/${chatUser.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.length > 0) {
      setMessages(res.data);
    } else {
      setMessages([]);
    }
  } catch (err) {
    alert("Error loading conversation");
  }
};


const sendMessage = async () => {
  if (!newMessage.trim()) return;
  try {
    const res = await axios.post(
      `${API_URL}/api/messages/send`,
      { receiver_id: selectedUser.id, message: newMessage },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Append the sent message instantly
    setMessages((prevMessages) => [...prevMessages, res.data.data]);
    setNewMessage("");
  } catch (err) {
    alert("Error sending message");
  }
};


const fetchNewMessages = async () => {
  if (!selectedUser || messages.length === 0) return;

  const lastMessageId = messages[messages.length - 1]?.id;

  try {
    const res = await axios.get(
      `${API_URL}/api/messages/conversation/${selectedUser.id}?after=${lastMessageId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.length > 0) {
      setMessages((prevMessages) => {
        // Filter out duplicates using message ID
        const newUniqueMessages = res.data.filter(
          (msg) => !prevMessages.some((m) => m.id === msg.id)
        );
        return [...prevMessages, ...newUniqueMessages];
      });
    }
  } catch (err) {
    console.error("Error fetching new messages", err);
  }
};

  // Auto refresh conversation every 3s
useEffect(() => {
  if (!selectedUser) return;

  const interval = setInterval(() => {
    fetchNewMessages();
  }, 3000);

  return () => clearInterval(interval);
}, [selectedUser, messages]);

  // ============= UI =============
  if (view === "login" || view === "register") {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2 style={styles.title}>{view === "login" ? "Welcome Back" : "Create Account"}</h2>
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {view === "login" ? (
            <>
              <button style={styles.primaryButton} onClick={login}>Login</button>
              <p style={styles.switchText}>
                Don't have an account?{" "}
                <span style={styles.link} onClick={() => setView("register")}>
                  Register
                </span>
              </p>
            </>
          ) : (
            <>
              <button style={styles.primaryButton} onClick={register}>Register</button>
              <p style={styles.switchText}>
                Already have an account?{" "}
                <span style={styles.link} onClick={() => setView("login")}>
                  Login
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={{ color: "#fff" }}>Hi, {user?.username}</h3>
          <button style={styles.logoutButton} onClick={logout}>Logout</button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <input
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button style={styles.searchButton} onClick={searchUsers}>Search</button>
        </div>

        <div style={styles.searchResults}>
          <h4 style={{ color: "#fff" }}>Results</h4>
          {searchResults.map((u) => (
            <div
              key={u.id}
              style={{
                ...styles.userItem,
                background: selectedUser?.id === u.id ? "#0078d7" : "#2a2f38",
              }}
              onClick={() => selectChatUser(u)}
            >
              {u.username}
            </div>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div style={styles.chatWindow}>
        {selectedUser ? (
          <>
            <div style={styles.chatHeader}>
              <h3 style={{ margin: 0 }}>Chat with {selectedUser.username}</h3>
            </div>
            <div style={styles.messages}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.message,
                    alignSelf: msg.sender_id === user.id ? "flex-end" : "flex-start",
                    background: msg.sender_id === user.id ? "#0078d7" : "#333",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{msg.message}</span>
                </div>
              ))}
            </div>

            <div style={styles.messageInput}>
              <input
                style={styles.textInput}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button style={styles.sendButton} onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <h3>Select a user to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// ============= STYLING =============
const styles = {
  // Auth Page
  authContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },
  authBox: {
    background: "#1c1f26",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.6)",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    margin: "8px 0",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #555",
    background: "#2a2f38",
    color: "#fff",
    outline: "none",
  },
  primaryButton: {
    width: "100%",
    padding: "12px",
    background: "#0078d7",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    transition: "0.3s",
  },
  switchText: {
    color: "#ccc",
    marginTop: "15px",
  },
  link: {
    color: "#0078d7",
    cursor: "pointer",
  },

  // Chat Layout
  chatContainer: {
    display: "flex",
    height: "100vh",
    background: "#18191a",
    color: "#fff",
  },
  sidebar: {
    width: "25%",
    background: "#1c1f26",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderRight: "1px solid #333",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    background: "#ff4757",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
  searchInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "100%",
    marginBottom: "10px",
    background: "#2a2f38",
    color: "#fff",
    outline: "none",
  },
  searchButton: {
    width: "100%",
    padding: "10px",
    background: "#0078d7",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  searchResults: {
    marginTop: "20px",
    overflowY: "auto",
    flex: 1,
  },
  userItem: {
    padding: "12px",
    margin: "6px 0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
    color: "#fff",
  },

  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "15px",
    borderBottom: "1px solid #333",
    background: "#2a2f38",
  },
  messages: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    maxWidth: "60%",
    padding: "10px 15px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.4)",
  },
  messageInput: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #333",
    background: "#2a2f38",
  },
  textInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#1c1f26",
    color: "#fff",
    marginRight: "10px",
    outline: "none",
  },
  sendButton: {
    padding: "10px 20px",
    background: "#0078d7",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#777",
  },
};

export default App;
