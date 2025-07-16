import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FaStar , FaCog, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MessageIcon from "./MessageIcon";
import "../styles/Navbar.css";
import unipiLogo from "../assets/unipi-logo.jpg"; 
const Navbar = ({ userId, unreadMessages }) => {
  const navigate = useNavigate();
  
  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost/eduplatform/api/getUserProfile.php?user_id=${user.id}`)
        .then(response => {
          if (response.data.success) {
            setProfileImage(response.data.profile_image ? `http://localhost/eduplatform/${response.data.profile_image}` : null);
            setFullName(response.data.full_name || "User");
          }
        })
        .catch(error => console.error("Failed to load profile image:", error));
    }
  }, [user]);

  const handleLogout = () => {
    toast.info("Logging out...", {
      position: "top-center",
      autoClose: 2000,
      onClose: () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
    <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
  <img src={unipiLogo} alt="Unipi Logo" className="unipi-logo" />
  <h2 className="navbar-title">EduPlatform</h2>
</div>



<div className="navbar-links">
  {user.role === "instructor" ? (
    <>
      <button className="nav-button" onClick={() => navigate("/admin-panel")}>Διαχείριση Υλικού</button>
      <button className="nav-button" onClick={() => navigate("/create-training-plan")}>Δημιουργία Εκπαιδευτικού Πλάνου</button>
      <button className="nav-button" onClick={() => navigate("/instructor-trainee-progress")}>Πρόοδος Εκπαιδευόμενων</button>
      <button 
  className="nav-button" 
  onClick={() => {
    if (user) {
      navigate(`/preview-training/1`);
    }
  }}
>
  Προεπισκόπιση Εκπαιδεύσεων
</button>

    </>
  ) : (
    <>
      <button className="nav-button" onClick={() => navigate("/dashboard")}>Αρχική Σελίδα</button>
      <button className="nav-button" onClick={() => navigate("/my-trainings")}>Οι εκπαιδεύσεις μου</button>
    </>
  )}

  <div className="profile-section" onClick={() => navigate("/profile")}>
    {profileImage ? (
      <img src={profileImage} alt="Profile" className="profile-image" />
    ) : (
      <div className="default-profile">{fullName.charAt(0)}</div>
    )}
    <span className="profile-name">{fullName}</span>
  </div>
  <button className="nav-button logout-button" onClick={handleLogout}>Αποσύνδεση</button>
  <div className="message-icon-container" onClick={() => navigate("/messages")}>
    <FaEnvelope className="message-icon" />
    {unreadMessages > 0 && <span className="message-badge">{unreadMessages}</span>}
  </div>
  <FaStar
  className="rating-icon"
  title="Αξιολογήσεις"
  onClick={() => navigate("/average-ratings")}
/>

  <FaCog className="gear-icon" onClick={() => {
  console.log("Navigating to /settings");
  navigate("/settings");
  
}} />
  <ToastContainer />
</div>

    </nav>
  );
};

export default Navbar;










