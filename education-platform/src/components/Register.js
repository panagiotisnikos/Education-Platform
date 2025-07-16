import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.css"; // Προσθέτουμε το CSS αρχείο
import logo from "../assets/unipi-logo.jpg";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("trainee");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // ✅ Προσθέτουμε state για το preview
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file)); // ✅ Δημιουργία προσωρινού URL για preview
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1/eduplatform/api/register.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast.success("Registration successful! Redirecting...", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/dashboard");
      }, 2000);
      
      } else {
        toast.error(response.data.error || "Registration failed. Please try again.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src={logo} alt="University Logo" className="university-logo" />
        <h1>EduPlatform</h1>
        <p>Έλα και εσύ στην καλύτερη μαθησιακή εμπειρία!</p>

        <form onSubmit={handleRegister} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 📌 Ανέβασμα εικόνας με preview */}
          <label className="upload-label">
            Προσθήκη Εικόνας Προφίλ
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Profile Preview" className="image-preview" />
            </div>
          )}

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="trainee">Εκπαιδευόμενος</option>
            <option value="instructor">Εκπαιδευτής</option>
          </select>

          <button type="submit" className="register-btn">Εγγραφή</button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;






