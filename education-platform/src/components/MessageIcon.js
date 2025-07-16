import React, { useState, useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";

const MessageIcon = ({ userId }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const response = await fetch(`/getMessages.php?user_id=${userId}`);
      const messages = await response.json();
      const unread = messages.filter(msg => !msg.is_read).length;
      setUnreadCount(unread);
    };

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 5000); // Auto refresh every 5s
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="relative">
      <FaEnvelope className="text-2xl cursor-pointer" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default MessageIcon;
