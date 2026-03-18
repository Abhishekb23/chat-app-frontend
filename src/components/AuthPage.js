import React, { useState } from "react";
import { api } from "../api";

function AuthPage({ view, setView, saveAuth, statusText, setStatusText }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const data = await api("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    saveAuth(data.token, data.user);
  };

  const register = async () => {
    const data = await api("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    setStatusText(data.message);
    setView("login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Enterprise Chat</h1>

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
        />

        <button
          className="primary-btn"
          onClick={view === "login" ? login : register}
        >
          {view === "login" ? "Login" : "Register"}
        </button>

        <div>{statusText}</div>

        <p>
          {view === "login" ? "No account?" : "Already have account?"}
          <span onClick={() => setView(view === "login" ? "register" : "login")}>
            {view === "login" ? "Create one" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;