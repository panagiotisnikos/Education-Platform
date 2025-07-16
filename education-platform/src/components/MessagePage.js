import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MessagePage.css"; 
// Εισαγωγή του CSS αρχείου

const MessagesPage = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (receiverId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
    fetchUsers();
  }, [userId, receiverId]);

  const fetchMessages = async () => {
    if (!receiverId) {
      setMessages([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost/eduplatform/api/getMessages.php?user_id=${userId}&receiver_id=${receiverId}`);
      console.log("Fetched messages response:", response.data);
      
      if (!response.headers["content-type"] || !response.headers["content-type"].includes("application/json")) {
        console.error("API returned HTML instead of JSON:", response.data);
        setMessages([]);
        return;
      }
      
      if (!Array.isArray(response.data)) {
        console.error("Unexpected API response, expected an array but received:", response.data);
        setMessages([]);
        return;
      }
      
      const filteredMessages = response.data.filter(
        (msg) => (msg.sender_id === userId && msg.receiver_id === receiverId) || (msg.sender_id === receiverId && msg.receiver_id === userId)
      );
      
      setMessages(filteredMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));

    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost/eduplatform/api/getUsers.php?user_id=${userId}`);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !receiverId) return;

    try {
      const response = await axios.post("http://localhost/eduplatform/api/sendMessage.php", {
        sender_id: userId,
        receiver_id: receiverId,
        message: newMessage,
        reply_to: replyTo ? replyTo.id : null,
      }, {
        headers: { "Content-Type": "application/json" }
      });
      
      console.log("Send message response:", response.data);
      
      if (response.data.error) {
        console.error("Error from API:", response.data.error);
        return;
      }
      
      setNewMessage("");
      setReplyTo(null);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="text-xl font-bold mb-4">Συνομιλία</h2>
      <select
        className="w-full p-2 border rounded"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      >
        <option value="">Επιλέξτε χρήστη</option>
        {users.length > 0 ? (
          users.map((user) => (
            <option key={user.id} value={user.id}>{user.full_name}</option>
          ))
        ) : (
          <option value="">Φόρτωση χρηστών...</option>
        )}
      </select>
      <div className="chat-box">
        {Array.isArray(messages) && messages.length === 0 ? (
          <p className="text-gray-500">Δεν υπάρχουν μηνύματα.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}>
              {msg.reply_to && (
                <div className="reply-indicator">Απάντηση σε: {msg.reply_to_message}</div>
              )}
              <strong>{msg.sender_name}:</strong> {msg.message}
              <span className="text-xs block text-gray-700 mt-1">
                {new Date(msg.created_at).toLocaleString()}
              </span>
              {msg.sender_id !== userId && (
  <button 
    className="reply-button"
    onClick={() => setReplyTo(msg)}
  >
    ↩ Απάντηση
  </button>
)}


            </div>
          ))
        )}
      </div>
      {replyTo && (
        <div className="reply-indicator">
          Απαντάτε στο μήνυμα: "{replyTo.message}"
        </div>
      )}
      <div className="chat-input">
      <textarea
  className="w-full p-2 border rounded mt-2"
  rows="3"
  placeholder="Γράψτε το μήνυμά σας..."
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Αποτρέπει την αλλαγή γραμμής
      sendMessage(); // Στέλνει το μήνυμα
    }
  }}
></textarea>

        <button className="send-button" onClick={sendMessage}>
          Αποστολή
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;












