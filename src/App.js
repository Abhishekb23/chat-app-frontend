/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { IoSend } from "react-icons/io5";

// const API_URL = "https://chat-app-backend-tjcb.onrender.com";
const API_URL = "http://localhost:5000"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const socketRef = useRef(null);
  const [view, setView] = useState(token ? "chat" : "login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [groupSearch, setGroupSearch] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [membersToAdd, setMembersToAdd] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [editingId, setEditingId] = useState(null);

  const [editingText, setEditingText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const bottomRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({ show: true, message, type });

    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };
  const authHeaders = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const saveAuth = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setView("chat");
  };

  const clearAuth = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setView("login");
    setSelectedConversation(null);
    setMessages([]);
    setConversations([]);
  };

  const api = async (path, options = {}) => {
    const res = await fetch(`${API_URL}${path}`, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  };

  const searchUsersForGroup = async (q = "") => {
    try {
      const trimmed = q.trim();
  
      if (!trimmed) {
        setGroupSearchResults([]);
        return;
      }
  
      const data = await api(
        `/api/users/search?q=${encodeURIComponent(trimmed)}`,
        {
          headers: authHeaders,
        },
      );
  
      setGroupSearchResults(data.users || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };
  
  const addMembersToGroup = async () => {
    try {
      if (!selectedConversation || selectedConversation.type !== "GROUP") {
        showToast("Open a group first", "error");
        return;
      }
  
      if (membersToAdd.length === 0) {
        showToast("Select at least one user", "error");
        return;
      }
  
      await api(`/api/groups/${selectedConversation.id}/members`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          memberIds: membersToAdd,
        }),
      });
  
      showToast("Members added successfully", "success");
      setShowAddMembers(false);
      setGroupSearch("");
      setGroupSearchResults([]);
      setMembersToAdd([]);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const register = async () => {
    try {
      setLoading(true);
      const data = await api("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      showToast(data.message || "Registered successfully", "success");
      setView("login");
      setPassword("");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      const data = await api("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      saveAuth(data.token, data.user);
      showToast("Login successful", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (q = "") => {
    try {
      const trimmed = q.trim();

      if (!trimmed) {
        setUsers([]);
        return;
      }

      const data = await api(
        `/api/users/search?q=${encodeURIComponent(trimmed)}`,
        {
          headers: authHeaders,
        },
      );
      setUsers(data.users || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const fetchConversations = async () => {
    try {
      const data = await api("/api/conversations", {
        headers: authHeaders,
      });
      setConversations(data.conversations || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    try {
      const data = await api(`/api/conversations/${conversationId}/messages`, {
        headers: authHeaders,
      });
      setMessages(data.messages || []);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const startDirectChat = async (otherUser) => {
    try {
      const data = await api("/api/conversations/direct", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ userId: otherUser.id }),
      });

      const conv = {
        id: data.conversationId,
        type: "DIRECT",
        name: otherUser.username,
        receiverId: otherUser.id,
      };

      setSelectedConversation(conv);
      await fetchMessages(conv.id);
      setSearch("");
      setUsers([]);
    } catch (err) {
      showToast(err.message, "error");
    }
  };
  const createGroup = async () => {
    try {
      if (!groupName.trim()) {
        showToast("Enter group name", "error");
        return;
      }

      const data = await api("/api/groups", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          name: groupName,
          memberIds: selectedMembers,
        }),
      });

      setGroupName("");
      setSelectedMembers([]);
      setShowCreateGroup(false);
      showToast("Group created", "success");
      await fetchConversations();

      if (data.conversation) {
        setSelectedConversation({
          id: data.conversation.id,
          type: "GROUP",
          name: data.conversation.name,
        });
        await fetchMessages(data.conversation.id);
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !socketRef.current)
      return;

    socketRef.current.emit("send_message", {
      conversationId: selectedConversation.id,
      senderId: user.id,
      content: newMessage,
    });

    setNewMessage("");
  };

  const deleteMessage = async (id) => {
    try {
      await api(`/api/messages/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      await fetchMessages(selectedConversation.id);
      await fetchConversations();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const updateMessage = async () => {
    try {
      if (!editingId || !editingText.trim()) return;

      await api(`/api/messages/${editingId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ content: editingText }),
      });

      setEditingId(null);
      setEditingText("");
      await fetchMessages(selectedConversation.id);
    } catch (err) {
      showToast(err.message, "error");
    }
  };
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!token || !user) return;

    socketRef.current = io(API_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("register", user.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, user]);

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token]);

  useEffect(() => {
    if (!token || !selectedConversation?.id || !socketRef.current) return;

    fetchMessages(selectedConversation.id);

    socketRef.current.emit("join_conversation", selectedConversation.id);

    const handleMessage = (message) => {
      if (Number(message.conversation_id) === Number(selectedConversation.id)) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (m) => Number(m.id) === Number(message.id),
          );

          if (alreadyExists) return prev;

          return [...prev, message];
        });
      }
    };

    socketRef.current.on("receive_message", handleMessage);

    return () => {
      socketRef.current.emit("leave_conversation", selectedConversation.id);
      socketRef.current.off("receive_message", handleMessage);
    };
  }, [token, selectedConversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (view === "login" || view === "register") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Enterprise Chat</h1>
          <p className="subtext">
            Simple, strong and future-ready chat application
          </p>

          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (view === "login" ? login() : register())
            }
          />

          <button
            className="primary-btn"
            disabled={loading}
            onClick={view === "login" ? login : register}
          >
            {loading
              ? "Please wait..."
              : view === "login"
                ? "Login"
                : "Register"}
          </button>
          <p className="switch-text">
            {view === "login" ? "No account?" : "Already have an account?"}{" "}
            <span
              className="link-text"
              onClick={() => {
                setView(view === "login" ? "register" : "login");
              }}
            >
              {view === "login" ? "Create one" : "Login"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {(!isMobile || !selectedConversation) && (
        <aside className="sidebar">
          <div className="sidebar-top">
            <div>
              <h2>Chats</h2>
              <div className="logged-user">Hi, {user?.username}</div>
            </div>
            <button className="danger-btn" onClick={clearAuth}>
              Logout
            </button>
          </div>

          <div className="search-box">
            <input
              className="input search-input"
              placeholder="Search users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="secondary-btn"
              onClick={() => fetchUsers(search)}
            >
              Search
            </button>
          </div>

          <div className="section">
            <div className="section-header">
              <h3>Users</h3>
              <button
                className="ghost-btn"
                onClick={() => {
                  setShowCreateGroup((p) => !p);
                  fetchUsers("");
                }}
              >
                {showCreateGroup ? "Close Group" : "New Group"}
              </button>
            </div>

            <div className="list">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="list-item"
                  onClick={() => startDirectChat(u)}
                >
                  <div className="avatar">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="item-title">{u.username}</div>
                    <div className="item-sub">Start direct conversation</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showCreateGroup && (
            <div className="group-box">
              <h3>Create Group</h3>
              <input
                className="input"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <div className="members-grid">
                {users.map((u) => {
                  const active = selectedMembers.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      className={`member-chip ${active ? "active" : ""}`}
                      onClick={() => {
                        setSelectedMembers((prev) =>
                          prev.includes(u.id)
                            ? prev.filter((id) => id !== u.id)
                            : [...prev, u.id],
                        );
                      }}
                    >
                      {u.username}
                    </div>
                  );
                })}
              </div>

              <button className="primary-btn" onClick={createGroup}>
                Create Group
              </button>
            </div>
          )}

          <div className="section">
            <h3>Conversations</h3>
            <div className="list">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className={`conversation-item ${
                    selectedConversation?.id === c.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedConversation(c);
                  }}
                >
                  <div className="avatar">
                    {(c.name || "C").charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-content">
                    <div className="item-title">{c.name}</div>
                    <div className="item-sub">
                      {c.last_message || "No messages yet"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {(!isMobile || selectedConversation) && (
        <main className="chat-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
  <div className="chat-header-row">
    {isMobile && (
      <button
        className="back-btn"
        onClick={() => setSelectedConversation(null)}
      >
        ←
      </button>
    )}

    <div className="chat-header-main">
      <div>
        <h2>{selectedConversation.name}</h2>
        <div className="chat-sub">
          {selectedConversation.type === "GROUP"
            ? "Group chat"
            : "Direct chat"}
        </div>
      </div>

      {selectedConversation.type === "GROUP" && (
        <button
          className="ghost-btn add-member-btn"
          onClick={() => setShowAddMembers((prev) => !prev)}
        >
          {showAddMembers ? "Close" : "Add Members"}
        </button>
      )}
    </div>
  </div>
</div>

{selectedConversation?.type === "GROUP" && showAddMembers && (
  <div className="group-add-panel">
    <div className="group-add-top">
      <input
        className="input"
        placeholder="Search username to add"
        value={groupSearch}
        onChange={(e) => {
          setGroupSearch(e.target.value);
          searchUsersForGroup(e.target.value);
        }}
      />
      <button className="primary-btn" onClick={addMembersToGroup}>
        Add Selected
      </button>
    </div>

    <div className="members-grid">
      {groupSearchResults.map((u) => {
        const active = membersToAdd.includes(u.id);
        return (
          <div
            key={u.id}
            className={`member-chip ${active ? "active" : ""}`}
            onClick={() => {
              setMembersToAdd((prev) =>
                prev.includes(u.id)
                  ? prev.filter((id) => id !== u.id)
                  : [...prev, u.id],
              );
            }}
          >
            {u.username}
          </div>
        );
      })}
    </div>
  </div>
)}

              <div className="messages-area">
                {messages.map((msg) => {
                  const mine = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`message-row ${mine ? "mine" : "theirs"}`}
                    >
                      <div
                        className={`message-bubble ${mine ? "mine" : "theirs"}`}
                      >
                        {!mine && (
                          <div className="sender-name">{msg.sender_name}</div>
                        )}

                        {editingId === msg.id ? (
                          <div className="edit-box">
                            <textarea
                              className="edit-textarea"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                            />
                            <div className="edit-actions">
                              <button
                                className="secondary-btn"
                                onClick={updateMessage}
                              >
                                Save
                              </button>
                              <button
                                className="ghost-btn"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingText("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="message-text">{msg.content}</div>
                        )}

                        <div className="message-meta">
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {msg.is_edited && !msg.is_deleted && (
                            <span>edited</span>
                          )}
                          {mine && !msg.is_deleted && editingId !== msg.id && (
                            <>
                              <button
                                className="small-link"
                                onClick={() => {
                                  setEditingId(msg.id);
                                  setEditingText(msg.content);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="small-link delete"
                                onClick={() => deleteMessage(msg.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="composer">
                <input
                  className="composer-input"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="primary-btn send-btn" onClick={sendMessage}>
  <IoSend size={20} />
</button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-card">
                <h2>Select a conversation</h2>
                <p>Search a user, create a group, and start chatting.</p>
              </div>
            </div>
          )}

          {toast.show && (
            <div className={`toast toast-${toast.type}`}>{toast.message}</div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
