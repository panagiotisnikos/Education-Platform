import React, { useState, useEffect } from "react";

const MessageList = ({ userId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/getMessages.php?user_id=${userId}`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [userId]);

  const markAsRead = async (messageId) => {
    await fetch("/markAsRead.php", {
      method: "POST",
      body: JSON.stringify({ message_id: messageId }),
      headers: { "Content-Type": "application/json" },
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, is_read: true } : msg
      )
    );
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Μηνύματα</h2>
      {messages.length === 0 ? (
        <p>Δεν υπάρχουν μηνύματα.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={`p-2 border-b ${msg.is_read ? "text-gray-500" : "font-bold"}`}
              onClick={() => markAsRead(msg.id)}
            >
              <strong>{msg.sender_name}:</strong> {msg.message}
              <span className="text-sm text-gray-400 ml-2">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageList;
