// src/App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./styles";

const API_URL = "https://chat-app-backend-tjcb.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [view, setView] = useState(token ? "chat" : "login");

  // Auth
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Chat
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Groups
  const [tab, setTab] = useState("users");
  const [groups, setGroups] = useState([]);

  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const isMobile = window.innerWidth < 768;

  // Scroll refs
  const messagesEndRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // ---------------- AUTH ----------------
  const register = async () => {
    if (!username || !password) return alert("Enter username and password");
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, password });
      alert("Registration successful!");
      setView("login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const login = async () => {
    if (!username || !password) return;

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });

      const t = res.data.token;
      const u = res.data.user;

      setToken(t);
      setUser(u);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));

      setView("chat");

      const g = await axios.get(`${API_URL}/api/groups`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setGroups(g.data);

      const allUsers = await axios.get(`${API_URL}/api/auth/search?query=`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setSearchResults(allUsers.data);
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

  // ---------------- USERS ----------------
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/auth/search?query=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(res.data);
    } catch {}
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/search?query=`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data);
    } catch {}
  };

  const selectChatUser = (u) => {
    setSelectedGroup(null);
    setSelectedUser(u);
    setMessages([]);
    fetchMessages(u.id, null);
  };

  // ---------------- GROUPS ----------------
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch {}
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
    } catch {}
  };

  const selectGroup = (g) => {
    setSelectedUser(null);
    setSelectedGroup(g);
    setMessages([]);
    fetchMessages(null, g.id);
  };

  // ---------------- MESSAGES ----------------
 const fetchMessages = React.useCallback(
  async (userId, groupId) => {
    try {
      let res;
      if (userId) {
        res = await axios.get(
          `${API_URL}/api/messages/conversation/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (groupId) {
        res = await axios.get(`${API_URL}/api/groups/${groupId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setMessages(res.data.messages || res.data);
    } catch {}
  },
  [token] // dependencies safe
);


  // POLLING
useEffect(() => {
  let interval;

  if (selectedUser || selectedGroup) {
    interval = setInterval(() => {
      if (selectedUser) fetchMessages(selectedUser.id, null);
      if (selectedGroup) fetchMessages(null, selectedGroup.id);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [selectedUser, selectedGroup, fetchMessages]);


  // SEND MESSAGE
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (selectedUser) {
        const res = await axios.post(
          `${API_URL}/api/messages/send`,
          { receiver_id: selectedUser.id, message: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((p) => [...p, res.data.data]);
      } else if (selectedGroup) {
        const res = await axios.post(
          `${API_URL}/api/groups/${selectedGroup.id}/messages`,
          { message: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((p) => [...p, res.data]);
      }

      setNewMessage("");
    } catch {}
  };

  // DELETE MESSAGE
  const deleteMessage = async (id) => {
    try {
      if (selectedUser)
        await axios.delete(`${API_URL}/api/messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      else
        await axios.delete(
          `${API_URL}/api/groups/${selectedGroup.id}/messages/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

      setMessages((p) => p.filter((m) => m.id !== id));
    } catch {}
  };

  // ---------------- SCROLL FIX ----------------
  const handleScroll = () => {
    const el = messagesBoxRef.current;
    if (!el) return;

    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    setIsUserScrolling(!atBottom);
  };

  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolling]);

  // ---------------- AUTH UI ----------------
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

  // ---------------- MAIN CHAT SCREEN ----------------
  return (
    <div style={styles.chatContainer}>
      {/* SIDEBAR */}
      {(!isMobile || (!selectedUser && !selectedGroup)) && (
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={{ color: "#fff" }}>Hi, {user?.username}</h3>
            <button style={styles.logoutButton} onClick={logout}>
              Logout
            </button>
          </div>

          {/* TABS */}
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

          {/* TAB CONTENT */}
          {tab === "users" ? (
            <>
              <input
                style={styles.searchInput}
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button style={styles.searchButton} onClick={searchUsers}>
                Search
              </button>

              <div style={styles.searchResults}>
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      ...styles.userItem,
                      background:
                        selectedUser?.id === u.id ? "#2AABEE" : "#1f2a33",
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
              {/* CREATE GROUP */}
              <input
                style={styles.searchInput}
                placeholder="Group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />

              <h4 style={{ color: "#9bb0c0", marginTop: "10px" }}>
                Select members:
              </h4>

              <div
                style={{
                  maxHeight: "140px",
                  overflowY: "auto",
                  marginBottom: "10px",
                }}
              >
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      ...styles.userItem,
                      background: selectedMembers.includes(u.id)
                        ? "#2AABEE"
                        : "#1f2a33",
                    }}
                    onClick={() => {
                      if (selectedMembers.includes(u.id))
                        setSelectedMembers(
                          selectedMembers.filter((i) => i !== u.id)
                        );
                      else setSelectedMembers([...selectedMembers, u.id]);
                    }}
                  >
                    {u.username}
                  </div>
                ))}
              </div>

              <button style={styles.searchButton} onClick={createGroup}>
                Create Group
              </button>

              {/* GROUP LIST */}
              <div style={{ ...styles.searchResults, marginTop: "20px" }}>
                {groups.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      ...styles.userItem,
                      background:
                        selectedGroup?.id === g.id ? "#2AABEE" : "#1f2a33",
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

      {/* CHAT WINDOW */}
      {(!isMobile || selectedUser || selectedGroup) && (
        <div style={styles.chatWindow}>
          {selectedUser || selectedGroup ? (
            <>
              {/* HEADER */}
              <div style={styles.chatHeader}>
                {isMobile && (
                  <button
                    style={styles.backButton}
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedGroup(null);
                    }}
                  >
                    ← Back
                  </button>
                )}
                <span>
                  {selectedUser
                    ? selectedUser.username
                    : selectedGroup?.name}
                </span>
              </div>

              {/* MESSAGES */}
              <div
                style={{
                  ...styles.messages,
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
                onScroll={handleScroll}
                ref={messagesBoxRef}
              >
                {messages.map((msg) => {
                  const date = msg.sent_date
                    ? new Date(`${msg.sent_date} ${msg.sent_time}`)
                    : new Date(msg.created_at);

                  const time = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const isMine = msg.sender_id === user.id;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.message,
                        alignSelf: isMine ? "flex-end" : "flex-start",
                        backgroundColor: isMine ? "#2AABEE" : "#1f2a33",
                      }}
                    >
                      {/* group sender */}
                      {selectedGroup && msg.sender_name && !isMine && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#9bb0c0",
                            marginBottom: "4px",
                          }}
                        >
                          {msg.sender_name}
                        </div>
                      )}

                      <div>{msg.message}</div>

                      <div style={styles.messageMeta}>
                        <small>{time}</small>
                        {isMine && (
                          <span
                            onClick={() => deleteMessage(msg.id)}
                            style={{
                              cursor: "pointer",
                              fontSize: "14px",
                              marginLeft: "8px",
                            }}
                          >
                            ❌
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div style={styles.messageInput}>
                <input
                  style={styles.textInput}
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button style={styles.sendButton} onClick={sendMessage}>
                  ➤
                </button>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>Select a chat to start</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
