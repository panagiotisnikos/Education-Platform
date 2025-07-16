import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UserProfile.css";
const UserProfile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return authContext?.user || storedUser;
  });
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  

  
 

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost/eduplatform/api/getUserProfile.php?user_id=${user.id}`);
      if (response.data.success) {
        setFullName(response.data.full_name || "");
        setEmail(response.data.email || ""); 
        setProfileImage(response.data.profile_image ? `http://localhost/eduplatform/${response.data.profile_image}` : null);
        setPreviewImage(response.data.profile_image ? `http://localhost/eduplatform/${response.data.profile_image}` : null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!email.trim()) {
      toast.error("Email cannot be empty!");
      return;
    }
  
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("full_name", fullName);
    formData.append("email", email);
    if (profileImage && profileImage instanceof File) {
      formData.append("profile_image", profileImage);
    }
  
    try {
      const response = await axios.post("http://localhost/eduplatform/api/updateUserProfile.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.success) {
        toast.success("Profile updated successfully! 🎉");
  
        // 🔄 Ενημέρωση του χρήστη στο localStorage για να ανανεωθεί το Navbar
        const updatedUser = { 
          ...user, 
          full_name: fullName, 
          email: email, 
          profile_image: response.data.profile_image || user.profile_image 
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
  
        // 🔄 Αναγκαστική ανανέωση του state για να ενημερωθεί το Navbar ΧΩΡΙΣ refresh
        setUser(updatedUser);
      } else {
        toast.error(response.data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  

  

  return (
    <div className="user-profile">
      <h1>User Profile</h1>

      <div className="profile-section">
        {previewImage ? (
          <img src={previewImage} alt="Profile" className="profile-img" />
        ) : (
          <div className="default-profile">{fullName.charAt(0)}</div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <input 
        type="text" 
        value={fullName} 
        onChange={(e) => setFullName(e.target.value)} 
        placeholder="Full Name" 
      />

      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />

      <button class = "savechanges" onClick={handleSave}>Save Changes</button>

      <button className="backchanges" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;











