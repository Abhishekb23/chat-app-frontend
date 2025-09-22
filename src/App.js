// src/App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./styles"; // Adjust path if needed

const API_URL = "https://chat-app-backend-tjcb.onrender.com"; // backend API

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [view, setView] = useState(token ? "chat" : "login");

  // Auth
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Search users
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Chat
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Groups
  const [tab, setTab] = useState("users");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [showAddMembers, setShowAddMembers] = useState(false);

  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState([]);

  const isMobile = window.innerWidth < 768;

  // For auto-scroll
  const messagesEndRef = useRef(null);

  // ================= AUTH =================
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
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });

      const receivedToken = res.data.token;
      const receivedUser = res.data.user;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));
      setView("chat");

      await axios
        .get(`${API_URL}/api/groups`, {
          headers: { Authorization: `Bearer ${receivedToken}` },
        })
        .then((res) => setGroups(res.data));

      await axios
        .get(`${API_URL}/api/auth/search?query=`, {
          headers: { Authorization: `Bearer ${receivedToken}` },
        })
        .then((res) => setSearchResults(res.data));
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

  // ================= USERS =================
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/auth/search?query=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(res.data);
    } catch (err) {
      alert("Error searching users");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/search?query=`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data);
    } catch (err) {
      alert("Error fetching users");
    }
  };

  const selectChatUser = async (chatUser) => {
    setSelectedGroup(null);
    setSelectedUser(chatUser);
    setMessages([]);
    fetchMessages(chatUser.id, null); // fetch 1:1 chat messages
  };

  // ================= GROUPS =================
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups", err);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim() || selectedMembers.length === 0)
      return alert("Enter group name & select members");
    try {
      await axios.post(
        `${API_URL}/api/groups`,
        { name: newGroupName, members: selectedMembers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGroupName("");
      setSelectedMembers([]);
      fetchGroups();
      alert("Group created!");
    } catch (err) {
      alert("Error creating group");
    }
  };

  const selectGroup = async (group) => {
    setSelectedUser(null);
    setSelectedGroup(group);
    setMessages([]);
    fetchMessages(null, group.id); // fetch group chat messages
  };

  const searchMembers = async () => {
    if (!memberSearchQuery.trim()) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/auth/search?query=${memberSearchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const filtered = res.data.filter(
        (u) => !groupMembers.map((m) => m.id).includes(u.id)
      );
      setMemberSearchResults(filtered);
    } catch (err) {
      alert("Error searching users");
    }
  };

  const addMembersToGroup = async () => {
    if (selectedMembers.length === 0) return;
    try {
      await axios.post(
        `${API_URL}/api/groups/${selectedGroup.id}/add-members`,
        { members: selectedMembers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Members added!");
      setGroupMembers([
        ...groupMembers,
        ...selectedMembers.map((id) =>
          memberSearchResults.find((u) => u.id === id)
        ),
      ]);
      setSelectedMembers([]);
      setShowAddMembers(false);
      setMemberSearchQuery("");
      setMemberSearchResults([]);
    } catch {
      alert("Error adding members");
    }
  };

  // ================= MESSAGES =================
  const fetchMessages = async (userId, groupId) => {
    try {
      let res;
      if (userId) {
        res = await axios.get(`${API_URL}/api/messages/conversation/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (groupId) {
        res = await axios.get(`${API_URL}/api/groups/${groupId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMessages(res.data.messages || res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Polling for real-time updates
  useEffect(() => {
    let interval;
    if (selectedUser || selectedGroup) {
      interval = setInterval(() => {
        if (selectedUser) fetchMessages(selectedUser.id, null);
        if (selectedGroup) fetchMessages(null, selectedGroup.id);
      }, 1000); // fetch every 3 sec
    }
    return () => clearInterval(interval);
  }, [selectedUser, selectedGroup]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      if (selectedUser) {
        const res = await axios.post(
          `${API_URL}/api/messages/send`,
          { receiver_id: selectedUser.id, message: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) => [...prev, res.data.data]);
      } else if (selectedGroup) {
        const res = await axios.post(
          `${API_URL}/api/groups/${selectedGroup.id}/messages`,
          { message: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) => [...prev, res.data]);
      }
      setNewMessage("");
    } catch {
      alert("Error sending message");
    }
  };

  const deleteMessage = async (msgId) => {
    try {
      if (selectedUser) {
        await axios.delete(`${API_URL}/api/messages/${msgId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (selectedGroup) {
        await axios.delete(
          `${API_URL}/api/groups/${selectedGroup.id}/messages/${msgId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
    } catch {
      alert("Error deleting message");
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ================= UI =================
  if (view === "login" || view === "register") {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2 style={styles.title}>
            {view === "login" ? "Welcome Back" : "Create Account"}
          </h2>
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
              <button style={styles.primaryButton} onClick={login}>
                Login
              </button>
              <p style={styles.switchText}>
                Don't have an account?{" "}
                <span style={styles.link} onClick={() => setView("register")}>
                  Register
                </span>
              </p>
            </>
          ) : (
            <>
              <button style={styles.primaryButton} onClick={register}>
                Register
              </button>
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
      {(!isMobile || (!selectedUser && !selectedGroup)) && (
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={{ color: "#fff" }}>Hi, {user?.username}</h3>
            <button style={styles.logoutButton} onClick={logout}>
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div style={styles.tabRow}>
            <button
              style={tab === "users" ? styles.activeTab : styles.tab}
              onClick={() => setTab("users")}
            >
              Users
            </button>
            <button
              style={tab === "groups" ? styles.activeTab : styles.tab}
              onClick={() => {
                setTab("groups");
                fetchGroups();
                fetchAllUsers();
              }}
            >
              Groups
            </button>
          </div>

          {/* Tab Content */}
          {tab === "users" ? (
            <>
              <div style={{ marginTop: "20px" }}>
                <input
                  style={styles.searchInput}
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button style={styles.searchButton} onClick={searchUsers}>
                  Search
                </button>
              </div>
              <div style={styles.searchResults}>
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      ...styles.userItem,
                      background:
                        selectedUser?.id === u.id ? "#0078d7" : "#2a2f38",
                    }}
                    onClick={() => selectChatUser(u)}
                  >
                    {u.username}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: "20px" }}>
                <input
                  style={styles.searchInput}
                  placeholder="New group name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>

              <div
                style={{
                  marginTop: "10px",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                <h4 style={{ color: "#ccc" }}>Select Members:</h4>
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      ...styles.userItem,
                      background: selectedMembers.includes(u.id)
                        ? "#0078d7"
                        : "#2a2f38",
                    }}
                    onClick={() => {
                      if (selectedMembers.includes(u.id))
                        setSelectedMembers(
                          selectedMembers.filter((id) => id !== u.id)
                        );
                      else setSelectedMembers([...selectedMembers, u.id]);
                    }}
                  >
                    {u.username}
                  </div>
                ))}
              </div>

              <button
                style={{ ...styles.searchButton, marginTop: "10px" }}
                onClick={createGroup}
              >
                Create Group
              </button>

              <div style={styles.searchResults}>
                {groups.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      ...styles.userItem,
                      background:
                        selectedGroup?.id === g.id ? "#0078d7" : "#2a2f38",
                    }}
                    onClick={() => selectGroup(g)}
                  >
                    {g.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat Window */}
      {(!isMobile || selectedUser || selectedGroup) && (
        <div style={styles.chatWindow}>
          {selectedUser || selectedGroup ? (
            <>
              {/* Header */}
              <div style={styles.chatHeader}>
                {isMobile && (
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedGroup(null);
                    }}
                    style={styles.backButton}
                  >
                    ← Back
                  </button>
                )}
                <h3 style={{ margin: 0 }}>
                  {selectedUser
                    ? `Chat with ${selectedUser.username}`
                    : selectedGroup?.name}
                </h3>
              </div>

              {/* Messages */}
              <div style={styles.messages}>
                {messages.map((msg) => {
                  const date = msg.sent_date
                    ? new Date(`${msg.sent_date} ${msg.sent_time}`)
                    : new Date(msg.created_at);

                  const time = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.message,
                        alignSelf:
                          msg.sender_id === user.id ? "flex-end" : "flex-start",
                        background:
                          msg.sender_id === user.id ? "#0078d7" : "#333",
                      }}
                    >
                      {selectedGroup && msg.sender_name && (
                        <div style={{ fontSize: "12px", color: "#bbb" }}>
                          {msg.sender_name}
                        </div>
                      )}
                      <div style={{ fontSize: "14px" }}>{msg.message}</div>
                      <div style={styles.messageMeta}>
                        <small>{time}</small>
                        {msg.sender_id === user.id && (
                          <span
                            style={styles.deleteIcon}
                            onClick={() => deleteMessage(msg.id)}
                            title="Delete message"
                          >
                            🗑
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={styles.messageInput}>
                <input
                  style={styles.textInput}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  autoFocus
                />
                <button style={styles.sendButton} onClick={sendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <h3>Select a user or group to start chatting</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
