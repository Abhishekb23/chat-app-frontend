// styles.js – Premium WhatsApp-Web + iMessage Hybrid UI

const baseStyles = {
  // -------------------------------- AUTH --------------------------------
  authContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f1f3f5",
  },

  authBox: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    width: "350px",
    textAlign: "center",
    border: "1px solid #e5e5e5",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },

  title: {
    color: "#222",
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "25px",
  },

  input: {
    padding: "14px",
    marginTop: "12px",
    width: "100%",
    borderRadius: "12px",
    border: "1px solid #dcdcdc",
    background: "#fafafa",
    color: "#000",
    fontSize: "15px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    padding: "14px",
    background: "#25D366",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "17px",
    marginTop: "18px",
    fontWeight: "700",
  },

  switchText: {
    color: "#555",
    marginTop: "16px",
    fontSize: "14px",
  },

  link: {
    color: "#25D366",
    cursor: "pointer",
    fontWeight: "600",
  },

  // ------------------------------ MAIN LAYOUT ------------------------------
  chatContainer: {
    display: "flex",
    height: "100vh",
    background: "#eceff1",
    color: "#111",
    fontFamily: "Segoe UI, sans-serif",
  },

  // ------------------------------- SIDEBAR --------------------------------
  sidebar: {
    width: "28%",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ddd",
    boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
  },

  sidebarHeader: {
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #e5e5e5",
  },

  logoutButton: {
    background: "#ff4d4f",
    border: "none",
    padding: "8px 15px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  tabRow: {
    display: "flex",
    gap: "10px",
    padding: "12px 18px",
  },

  tab: {
    flex: 1,
    background: "#f0f0f0",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    color: "#333",
    cursor: "pointer",
    fontWeight: "600",
  },

  activeTab: {
    flex: 1,
    background: "#25D366",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #25D366",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },

  searchInput: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fafafa",
    margin: "12px 18px 0 18px",
    fontSize: "14px",
    outline: "none",
  },

  searchButton: {
    margin: "10px 18px",
    padding: "12px",
    background: "#25D366",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  searchResults: {
    padding: "0 18px",
    marginTop: "12px",
    overflowY: "auto",
    flex: 1,
  },

  userItem: {
    padding: "14px",
    margin: "8px 0",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#111",
    fontSize: "15px",
    background: "#f7f7f7",
    border: "1px solid #eee",
    transition: "0.2s",
  },

  // ------------------------------ CHAT WINDOW ------------------------------
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f9f9f9",
    position: "relative",
  },

  chatHeader: {
    padding: "18px",
    borderBottom: "1px solid #ddd",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#111",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  backButton: {
    background: "transparent",
    border: "none",
    color: "#25D366",
    fontSize: "20px",
    cursor: "pointer",
  },

  // ----------------------------- MESSAGES AREA -----------------------------
  messages: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    background: "#e7ecef",
    gap: "14px",
  },

  message: {
    maxWidth: "70%",
    padding: "14px 18px",
    borderRadius: "18px",
    color: "#111",
    fontSize: "15px",
    background: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },

  messageMeta: {
    fontSize: "11px",
    color: "#666",
    marginTop: "6px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  deleteIcon: {
    cursor: "pointer",
    fontSize: "16px",
    color: "red",
  },

  // ---------------------------- MESSAGE INPUT ----------------------------
  messageInput: {
    display: "flex",
    padding: "16px",
    background: "#ffffff",
    borderTop: "1px solid #ddd",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 -2px 6px rgba(0,0,0,0.05)",
  },

  textInput: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "#fefefe",
    fontSize: "15px",
    outline: "none",
  },

  sendButton: {
    padding: "14px 20px",
    background: "#25D366",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
  },

  emptyState: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#777",
    fontSize: "20px",
  },
};

// ----------------------------- MOBILE OVERRIDES -----------------------------
const mobileOverrides = {
  sidebar: {
    width: "100%",
    height: "auto",
    borderRight: "none",
    borderBottom: "1px solid #ddd",
  },

  message: {
    maxWidth: "85%",
  },

  chatWindow: {
    width: "100%",
  },

  sendButton: {
    borderRadius: "50%",
    padding: "14px",
  },
};

// ----------------------------- UTILITY -----------------------------
function mergeStyles(base, overrides) {
  const merged = {};
  Object.keys(base).forEach((key) => {
    merged[key] = { ...base[key], ...(overrides[key] || {}) };
  });
  return merged;
}

let styles = baseStyles;

if (typeof window !== "undefined" && window.innerWidth <= 768) {
  styles = mergeStyles(baseStyles, mobileOverrides);
}

export default styles;
