// styles.js (Telegram Modern UI)

const baseStyles = {
  // ---------------- AUTH ----------------
  authContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },

  authBox: {
    background: "rgba(0,0,0,0.35)",
    padding: "35px",
    borderRadius: "16px",
    width: "340px",
    textAlign: "center",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
  },

  title: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  },

  input: {
    padding: "12px",
    margin: "10px 0",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    padding: "12px",
    background: "#2AABEE",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
  },

  switchText: { color: "#eee", marginTop: "15px" },
  link: { color: "#2AABEE", cursor: "pointer", fontWeight: "600" },

  // ---------------- CHAT LAYOUT ----------------
  chatContainer: {
    display: "flex",
    height: "100vh",
    background: "#0e1621",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
  },

  // ---------------- SIDEBAR ----------------
  sidebar: {
    width: "27%",
    background: "#17212b",
    display: "flex",
    flexDirection: "column",
    padding: "18px",
    borderRight: "1px solid #1c2932",
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
  },

  logoutButton: {
    background: "#e63946",
    border: "none",
    padding: "7px 12px",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  tabRow: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
  },

  tab: {
    flex: 1,
    background: "#1f2a33",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    color: "#9bb0c0",
    cursor: "pointer",
    fontWeight: "500",
  },

  activeTab: {
    flex: 1,
    background: "#2AABEE",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
  },

  searchInput: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    width: "100%",
    marginTop: "15px",
    background: "#1f2a33",
    color: "#fff",
    outline: "none",
  },

  searchButton: {
    width: "100%",
    padding: "10px",
    background: "#2AABEE",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    marginTop: "8px",
  },

  searchResults: {
    marginTop: "15px",
    overflowY: "auto",
    flex: 1,
  },

  userItem: {
    padding: "14px",
    margin: "8px 0",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#fff",
    fontSize: "15px",
    background: "#1f2a33",
    transition: "0.2s",
  },

  // ---------------- CHAT WINDOW ----------------
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "url('https://telegram.org/img/bg_pattern.webp') #0e1621",
    backgroundSize: "300px",
  },

  chatHeader: {
    padding: "18px",
    borderBottom: "1px solid #1c2932",
    background: "#17212b",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "600",
  },

  backButton: {
    background: "transparent",
    border: "none",
    color: "#2AABEE",
    fontSize: "18px",
    cursor: "pointer",
  },

  // ---------------- MESSAGES LIST ----------------
  messages: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  message: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    position: "relative",
    lineHeight: "20px",
  },

  messageMeta: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.7)",
    marginTop: "4px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },

  deleteIcon: {
    cursor: "pointer",
    opacity: 0.7,
    fontSize: "13px",
  },

  // ---------------- MESSAGE INPUT ----------------
  messageInput: {
    display: "flex",
    padding: "14px",
    borderTop: "1px solid #1c2932",
    background: "#17212b",
    alignItems: "center",
    gap: "10px",
  },

  textInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#1f2a33",
    color: "#fff",
    outline: "none",
    fontSize: "15px",
  },

  sendButton: {
    padding: "12px 18px",
    background: "#2AABEE",
    border: "none",
    borderRadius: "14px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyState: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#70808f",
    fontSize: "18px",
  },
};

// ---------------- MOBILE OVERRIDES ----------------
const mobileOverrides = {
  sidebar: {
    width: "100%",
    height: "auto",
    borderRight: "none",
    borderBottom: "1px solid #1c2932",
  },

  chatWindow: {
    width: "100%",
    height: "calc(100vh - 200px)",
  },

  message: { maxWidth: "90%" },

  sendButton: { borderRadius: "50%", padding: "12px" },
};

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
