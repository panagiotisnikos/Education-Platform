import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";
import unipiLogo from "../assets/unipi-logo.jpg"; // Προσθήκη του logo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/eduplatform/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!", { position: "top-center", autoClose: 2000 });

        setTimeout(() => {
          navigate("/dashboard");
      }, 2000);
      
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={unipiLogo} alt="University Logo" className="unipi-logo" />
        <h2 className="login-title">EduPlatform</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Σύνδεση</button>
        </form>
        <div className="register-link">
          Δεν έχεις λογαριασμό; <span onClick={() => navigate("/register")}>Κάνε εγγραφή εδώ</span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;











