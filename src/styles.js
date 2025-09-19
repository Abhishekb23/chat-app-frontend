// styles.js

const baseStyles = {
  authContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#0f2027",
  },
  authBox: {
    background: "#1c1f26",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
  },
  title: { color: "#fff" },
  input: {
    padding: "10px",
    margin: "8px 0",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #555",
    background: "#2a2f38",
    color: "#fff",
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
  },
  switchText: { color: "#ccc", marginTop: "15px" },
  link: { color: "#0078d7", cursor: "pointer" },

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
  tabRow: { display: "flex", gap: "10px", marginTop: "10px" },
  tab: {
    flex: 1,
    background: "#2a2f38",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
  activeTab: {
    flex: 1,
    background: "#0078d7",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "#fff",
  },
  searchInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "100%",
    marginBottom: "10px",
    background: "#2a2f38",
    color: "#fff",
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
  searchResults: { marginTop: "20px", overflowY: "auto", flex: 1 },
  userItem: {
    padding: "12px",
    margin: "6px 0",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
  },

  chatWindow: { flex: 1, display: "flex", flexDirection: "column" },
  chatHeader: {
    padding: "15px",
    borderBottom: "1px solid #333",
    background: "#2a2f38",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  backButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
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
    maxWidth: "70%",
    padding: "10px 15px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.4)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  messageInput: {
    display: "flex",
    padding: "12px",
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
  },
  sendButton: {
    padding: "10px 20px",
    background: "#0078d7",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  deleteButton: {
    alignSelf: "flex-end",
    marginTop: "4px",
    background: "transparent",
    border: "none",
    color: "#bbb",
    cursor: "pointer",
    fontSize: "12px",
  },

  emptyState: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#777",
  },
};

const mobileOverrides = {
  authBox: {
    width: "90%",
    padding: "20px",
  },
  chatContainer: {
    flexDirection: "column",
  },
  sidebar: {
    width: "100%",
    height: "auto",
    borderRight: "none",
    borderBottom: "1px solid #333",
  },
  chatWindow: {
    width: "100%",
    height: "calc(100vh - 200px)",
  },
  message: {
    maxWidth: "90%",
  },
  textInput: {
    marginRight: "5px",
  },
  primaryButton: {
    padding: "14px 16px",
    fontSize: "18px",
  },
  sendButton: {
    padding: "14px 16px",
    fontSize: "18px",
  },
  logoutButton: {
    padding: "14px 16px",
    fontSize: "18px",
  },
};

// Utility to shallow merge styles with mobile overrides when window width <= 768px
function mergeStyles(base, overrides) {
  const merged = {};
  Object.keys(base).forEach((key) => {
    merged[key] = { ...base[key], ...(overrides[key] || {}) };
  });
  return merged;
}

// Default export: merge on load if client side and screen is small
let styles = baseStyles;

if (typeof window !== "undefined" && window.innerWidth <= 768) {
  styles = mergeStyles(baseStyles, mobileOverrides);
}

export default styles;
