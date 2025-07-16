import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SettingsPage.css";

const SettingsPage = ({ userId }) => {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    document.body.className = theme; // εφαρμογή theme
    localStorage.setItem("theme", theme); 
  }, [theme]);

  useEffect(() => {
    axios.get(`/eduplatform/api/getUserProfile.php?user_id=${userId}`)
      .then(response => {
        if (response.data.success) {
          setEmail(response.data.email || "");
          setNewPassword(""); 
          setConfirmPassword("");
        }
      })
      .catch(error => console.error("Error fetching user data:", error));
  }, [userId]);

  const handleThemeChange = (newTheme) => {
    console.log("Changing theme to:", newTheme); //για κονσολα
    setTheme(newTheme);
  };
  

  const handleSaveChanges = () => {
    if (newPassword && newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    axios.post("/eduplatform/api/updateUserSettings.php", {
      user_id: userId,
      email: newEmail || email,
      password: newPassword
    })
      .then(response => {
        if (response.data.success) {
          setMessage("Settings updated successfully!");
          setMessageType("success");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setMessage("Failed to update settings.");
          setMessageType("error");
        }
      })
      .catch(error => {
        console.error("Error updating settings:", error);
        setMessage("Error updating settings.");
        setMessageType("error");
      });
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="form-group">
        <label>New Password:</label>
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => {
            setNewPassword(e.target.value);
            setShowConfirmPassword(e.target.value.length > 0);
          }} 
          placeholder="New Password" 
        />
      </div>

      {showConfirmPassword && newPassword.length > 0 && (
        <div className="form-group">
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm Password" 
          />
        </div>
      )}

      <div className="form-group">
        <label>Theme:</label>
        <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <button className="unipi-btn" onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default SettingsPage;





