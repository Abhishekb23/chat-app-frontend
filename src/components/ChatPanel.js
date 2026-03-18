import React, { useState } from "react";
import MessageList from "./MessageList";
import Composer from "./Composer";

function ChatPanel({ user, messages, selectedConversation, socketRef }) {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("send_message", {
      conversationId: selectedConversation.id,
      senderId: user.id,
      content: newMessage,
    });

    setNewMessage("");
  };

  if (!selectedConversation) {
    return <div className="empty-state">Select a conversation</div>;
  }

  return (
    <main className="chat-panel">
      <h2>{selectedConversation.name}</h2>

      <MessageList messages={messages} user={user} />

      <Composer
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
      />
    </main>
  );
}

export default ChatPanel;