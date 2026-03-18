import React from "react";

function Composer({ newMessage, setNewMessage, sendMessage }) {
  return (
    <div className="composer">
      <input
        className="composer-input"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button className="primary-btn send-btn" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default Composer;