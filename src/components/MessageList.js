import React from "react";

function MessageList({ messages, user }) {
  return (
    <div className="messages-area">
      {messages.map((msg) => {
        const mine = msg.sender_id === user?.id;

        return (
          <div key={msg.id} className={mine ? "mine" : "theirs"}>
            <div>{msg.sender_name}</div>
            <div>{msg.content}</div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;