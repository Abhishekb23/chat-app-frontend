import React from "react";

function Sidebar({
  user,
  users,
  conversations,
  setSelectedConversation,
  clearAuth,
  search,
  setSearch,
  fetchUsers,
}) {
  return (
    <aside className="sidebar">
      <h2>Chats</h2>
      <p>Hi {user?.username}</p>

      <button onClick={clearAuth}>Logout</button>

      <input
        className="input"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={() => fetchUsers(search)}>Search</button>

      <h3>Users</h3>

      {users.map((u) => (
        <div key={u.id} onClick={() => setSelectedConversation(u)}>
          {u.username}
        </div>
      ))}

      <h3>Conversations</h3>

      {conversations.map((c) => (
        <div key={c.id} onClick={() => setSelectedConversation(c)}>
          {c.name}
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;